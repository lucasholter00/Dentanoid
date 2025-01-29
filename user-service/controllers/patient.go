package controllers

import (
	"Group20/Dentanoid/database"
	"Group20/Dentanoid/schemas"
	"context"
	"encoding/json"

	"fmt"
	"log"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

func InitialisePatient(client mqtt.Client) {

	tokenLogin := client.Subscribe("grp20/req/patients/login", byte(0), func(c mqtt.Client, m mqtt.Message) {

		var payload schemas.Dentist
		var returnData Res

		err1 := json.Unmarshal(m.Payload(), &payload)
		err2 := json.Unmarshal(m.Payload(), &returnData)

		if (err1 != nil) && (err2 != nil) {
			returnData.Message = "Bad request"
			returnData.Status = 400
			PublishReturnMessage(returnData, "grp20/res/patients/login", client)
		} else {
			go loginPatient(payload.Username, payload.Password, returnData, client)
		}
	})
	if tokenLogin.Error() != nil {
		panic(tokenLogin.Error())
	}

	//CREATE
	tokenCreate := client.Subscribe("grp20/req/patients/create", byte(0), func(c mqtt.Client, m mqtt.Message) {

		var payload schemas.Patient
		var returnData Res

		err1 := json.Unmarshal(m.Payload(), &payload)
		err2 := json.Unmarshal(m.Payload(), &returnData)

		if (err1 != nil) && (err2 != nil) {
			returnData.Message = "Bad request"
			returnData.Status = 400
			PublishReturnMessage(returnData, "grp20/res/patients/create", client)
		} else {
			go CreatePatient(payload, returnData, client)
		}

	})
	if tokenCreate.Error() != nil {
		panic(tokenCreate.Error())
	}

	//READ
	tokenRead := client.Subscribe("grp20/req/patients/get", byte(0), func(c mqtt.Client, m mqtt.Message) {

		var payload schemas.Patient
		var returnData Res

		err1 := json.Unmarshal(m.Payload(), &payload)
		err2 := json.Unmarshal(m.Payload(), &returnData)

		if (err1 != nil) && (err2 != nil) {
			returnData.Message = "Bad request"
			returnData.Status = 400
			PublishReturnMessage(returnData, "grp20/res/patients/get", client)
		} else {
			go GetPatient(payload.ID, returnData, client)
		}
	})

	if tokenRead.Error() != nil {
		panic(tokenRead.Error())
	}

	//UPDATE
	//TODO
	//Change subscription adress to get username in body
	tokenUpdate := client.Subscribe("grp20/req/patients/update", byte(0), func(c mqtt.Client, m mqtt.Message) {

		var payload UpdateRequest
		var returnData Res

		err1 := json.Unmarshal(m.Payload(), &payload)
		err2 := json.Unmarshal(m.Payload(), &returnData)

		if (err1 != nil) && (err2 != nil) {
			returnData.Message = "Bad request"
			returnData.Status = 400
			PublishReturnMessage(returnData, "grp20/res/patients/update", client)
		} else {
			go UpdatePatient(payload, returnData, client)
		}
	})

	if tokenUpdate.Error() != nil {
		panic(tokenRead.Error())
	}

	//REMOVE
	//TODO
	//Change subscription adress to get username in body

	tokenRemove := client.Subscribe("grp20/req/patients/delete", byte(0), func(c mqtt.Client, m mqtt.Message) {

		var payload schemas.Patient
		var returnData Res

		err1 := json.Unmarshal(m.Payload(), &payload)
		err2 := json.Unmarshal(m.Payload(), &returnData)

		if (err1 != nil) && (err2 != nil) {
			returnData.Message = "Bad request"
			returnData.Status = 400
			PublishReturnMessage(returnData, "grp20/res/patients/delete", client)
		} else {
			go DeletePatient(payload.ID, returnData, client)
		}
	})

	if tokenRemove.Error() != nil {
		panic(tokenRemove.Error())
	}

}

// CREATE
func CreatePatient(patient schemas.Patient, returnData Res, client mqtt.Client) bool {
	var returnVal bool

	//Checks for malformed request
	if (patient.Username == "") || (patient.Password == "") {
		returnData.Message = "Bad request"
		returnData.Status = 400
		PublishReturnMessage(returnData, "grp20/res/patients/create", client)
		return false
	}

	if userExists(patient.Username) {
		returnData.Message = "User already exists"
		returnData.Status = 409
		returnVal = false
	} else {

		col := getPatientCollection()
		hashed, err := bcrypt.GenerateFromPassword([]byte(patient.Password), 12)
		patient.Password = string(hashed)

		result, err := col.InsertOne(context.TODO(), patient)
		if err != nil {
			log.Fatal(err)
		}
		patient.Password = ""
		patient.ID = result.InsertedID.(primitive.ObjectID)
		returnData.Message = "User created"
		returnData.Status = 201
		returnData.Patient = &patient

		fmt.Printf("Registered Patient ID: %v \n", result.InsertedID)

		returnVal = true
	}

	PublishReturnMessage(returnData, "grp20/res/patients/create", client)
	return returnVal
}

// READ
func GetPatient(id primitive.ObjectID, returnData Res, client mqtt.Client) bool {
	var returnVal bool

	col := getPatientCollection()
	user := &schemas.Patient{}
	filter := bson.M{"_id": id}
	data := col.FindOne(context.TODO(), filter)
	data.Decode(user)

	if user.Username == "" {
		returnData.Message = "Patient not found"
		returnData.Status = 404
		returnVal = false
	} else {
		returnData.Status = 200
		user.Password = ""
		returnData.Patient = user
		returnVal = true
	}

	PublishReturnMessage(returnData, "grp20/res/patients/get", client)

	return returnVal
}

// UPDATE
func UpdatePatient(payload UpdateRequest, returnData Res, client mqtt.Client) bool {
	var update bson.M
	var returnVal bool

	if userExists(payload.Username) {
		returnData.Message = "Username taken"
		returnData.Status = 409
		returnVal = false
	} else {

		col := getPatientCollection()
		//Hash password, might introduce performance issues when done before checking if user already exists
		hashed, err := bcrypt.GenerateFromPassword([]byte(payload.Password), 12)

		if (payload.Username != "") && (payload.Password != "") {
			update = bson.M{"$set": bson.M{"username": payload.Username, "password": string(hashed)}}
		} else if payload.Username != "" {
			update = bson.M{"$set": bson.M{"username": payload.Username}}
		} else if payload.Password != "" {
			update = bson.M{"$set": bson.M{"password": string(hashed)}}
		}

		filter := bson.M{"_id": payload.ID}

		result, err := col.UpdateOne(context.TODO(), filter, update)

		if err != nil {
			log.Fatal(err)
			fmt.Printf("Updated failed for Patient with Username: %v \n", payload.OldName)

			returnData.Status = 500
			returnData.Message = "Update failed"

			returnVal = false
		} else if result.MatchedCount == 1 {
			fmt.Printf("Updated Patient with Username: %v \n", payload.OldName)

			returnData.Status = 200
			returnData.Message = "Patient updated"

			returnVal = true
		} else {
			fmt.Printf("No user with that name")

			returnData.Status = 404
			returnData.Message = "User not found"

			returnVal = false
		}

	}
	PublishReturnMessage(returnData, "grp20/res/patients/update", client)
	return returnVal
}

// REMOVE
func DeletePatient(id primitive.ObjectID, returnData Res, client mqtt.Client) bool {
	var returnVal bool

	col := getPatientCollection()
	filter := bson.M{"_id": id}
	result, err := col.DeleteOne(context.TODO(), filter)

	if err != nil {
		log.Fatal(err)
	}

	if result.DeletedCount == 1 {

		returnData.Status = 200
		returnData.Message = "User with id: " + id.Hex() + " deleted"

		returnVal = true
		fmt.Printf("Deleted Patient: %v \n", id.Hex())

	} else {

		returnData.Status = 404
		returnData.Message = "User not found"

		returnVal = false
	}

	PublishReturnMessage(returnData, "grp20/res/patients/delete", client)
	return returnVal
}

func getPatientCollection() *mongo.Collection {
	col := database.Database.Collection("Patients")
	return col
}

//TODO Responses
