package controllers

import (
	"Group20/Dentanoid/database"
	"Group20/Dentanoid/schemas"
	"context"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	Username string             `bson:"username,omitempty"`
	Password string             `bson:"password,omitempty"`
}

func getUser(username string) *mongo.SingleResult {
	col := getUserCollection()
	user := col.FindOne(context.TODO(), User{Username: username})
	return user
}

func userExists(username string) bool {
	colPatients := getPatientCollection()
	filterPatients := bson.M{"username": username}
	patient := &schemas.Patient{}
	dataPatients := colPatients.FindOne(context.TODO(), filterPatients)
	dataPatients.Decode(patient)

	colDentists := getDentistCollection()
	filterDentists := bson.M{"username": username}
	dentist := &schemas.Dentist{}
	dataDentists := colDentists.FindOne(context.TODO(), filterDentists)
	dataDentists.Decode(dentist)

	return !(patient.Username == "" && dentist.Username == "")

}

func loginPatient(username string, password string, returnData Res, client mqtt.Client) {

	returnData.Message = "User not found"
	returnData.Status = 404

	colPatients := getPatientCollection()
	filterPatients := bson.M{"username": username}
	patient := &schemas.Patient{}
	dataPatients := colPatients.FindOne(context.TODO(), filterPatients)
	dataPatients.Decode(patient)

	if patient.Username != "" {
		err := bcrypt.CompareHashAndPassword([]byte(patient.Password), []byte(password))
		if err == nil {
			returnData.Status = 200
			returnData.Message = "Authorised"
			patient.Password = ""
			returnData.Patient = patient

		} else {
			returnData.Status = 401
			returnData.Message = "Wrong password"
		}
	}
	PublishReturnMessage(returnData, "grp20/res/patients/login", client)
}

func loginDentist(username string, password string, returnData Res, client mqtt.Client) {
	returnData.Message = "User not found"
	returnData.Status = 404

	colDentists := getDentistCollection()
	filterDentists := bson.M{"username": username}
	dentist := &schemas.Dentist{}
	dataDentists := colDentists.FindOne(context.TODO(), filterDentists)
	dataDentists.Decode(dentist)

	if dentist.Username != "" {
		err := bcrypt.CompareHashAndPassword([]byte(dentist.Password), []byte(password))
		if err == nil {
			returnData.Status = 200
			returnData.Message = "Authorised"
			dentist.Password = ""
			returnData.Dentist = dentist
		} else {
			returnData.Status = 401
			returnData.Message = "Wrong password"
		}
	}

	PublishReturnMessage(returnData, "grp20/res/dentists/login", client)

}

func getUserCollection() *mongo.Collection {
	col := database.Database.Collection("users")
	return col
}
