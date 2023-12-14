package com.group20.dentanoid.TopicManagement.ClinicManagement;

import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.bson.conversions.Bson;
import com.google.gson.Gson;
import com.mongodb.client.FindIterable;

import static com.mongodb.client.model.Filters.eq;

import com.group20.dentanoid.GoogleAPI.ValidatedClinic;
import com.group20.dentanoid.Utils.Entry;
import com.group20.dentanoid.Utils.Utils;
import com.group20.dentanoid.ClinicService;
import com.group20.dentanoid.MqttMain;
import com.group20.dentanoid.DatabaseManagement.DatabaseManager;
import com.group20.dentanoid.DatabaseManagement.PayloadParser;
import com.group20.dentanoid.DatabaseManagement.Schemas.CollectionSchema;
import com.group20.dentanoid.DatabaseManagement.Schemas.Clinic.ClinicSchema;
import com.group20.dentanoid.DatabaseManagement.Schemas.Clinic.EmploymentSchema;

public class DentalClinic implements Clinic {
    private String publishTopic = "-1";
    private Document payloadDoc = null;
    private String publishString = "-1"; // Used only for GET methods, otherwise 'publishPayloadDoc' is used --> TODO: Refactor into a more clear structure

    private String topic;
    private String payload;

    // TODO: Make 'topic' and 'payload' a private String attribute to avoid reduntant passing as a parameter across all methods
    
    public DentalClinic(String topic, String payload) {
        this.topic = topic;
        this.payload = payload;
        executeRequestedOperation();
    }

    public void executeRequestedOperation() {
        publishTopic = runRequestedMethod();
        publishMessage();
    }

    public void registerClinic() {
        String status = "200";

        payloadDoc = getClinicDocument("create", new ClinicSchema());
        String requestID = payloadDoc.remove("requestID").toString(); // Don't store requestID in DB

        try {
            DatabaseManager.clinicsCollection.insertOne(payloadDoc);
        }
        catch (Exception exception) {
            status = "500";
            publishString = payloadDoc.toJson();
        }

        payloadDoc.append("requestID", requestID);
        payloadDoc.append("status", status);
        publishString = payloadDoc.toJson();

        // Note for developers: This code is in development
        /*
        JSONObject jsonObject = new JSONObject();
        ValidatedClinic clinicRequestObj = (ValidatedClinic) PayloadParser.getObjectFromPayload(payload, ValidatedClinic.class);

        // TOOD: Refactor this
        jsonObject.put("clinic_name", clinicRequestObj.getClinicName());
        jsonObject.put("clinic_id", clinicRequestObj.getClinicId());
        jsonObject.put("position", clinicRequestObj.getPosition());
        jsonObject.put("employees", clinicRequestObj.getEmployees());
        jsonObject.put("ratings", "-1");
        jsonObject.put("total_user_ratings", "-1");
        jsonObject.put("photoURL", "-1");

        try {
            FileWriter file = new FileWriter("Clinic-Service\\src\\main\\java\\com.group20.dentanoid\\GoogleAPI\\validatedClinic.json");
            file.write(jsonObject.toJSONString());
            file.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        System.out.println("JSON file created: "+ jsonObject);
        
        // ------------------------------------------------------------
        try {
            // Write to validatedClinic.json - Change attributes 'clinic_name' and 'position'


            // TODO: Account for bin and mac os - cmd.exe = windows
            Process myChildProcess = Runtime.getRuntime().exec("cmd.exe /c start bash bash-api.sh");

            // TODO: Refactor further
            new java.util.Timer().schedule(
                new java.util.TimerTask() {
                    @Override
                    public void run() {
                        try {
                            ClinicService.readValidatedClinic();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                },
                1000 
            );
        }
        catch (Exception e){
           System.out.println("Error: " + e);
        }
        */
        // ------------------------------------------------------------
    }

    public void deleteClinic() {
        payloadDoc = getClinicDocument("delete", new ClinicSchema());
        publishString = payloadDoc.toJson();
        DatabaseManager.clinicsCollection.deleteOne(eq("clinic_id", payloadDoc.get("clinic_id")));
    }

    public void getOneClinic() {
        Gson gson = new Gson();
        Document retrievedPayloadDoc = getClinicDocument("getOne", new ClinicSchema());

        String clinicJson = "-1";
        String requestID = retrievedPayloadDoc.get("requestID").toString();
        String statusCode = "200";        

        Map<String, Object> map = new HashMap<>(); // TODO: Refactor 'Map-Payload' into PayloadParser.java and use in NearbyClinics.java

        try {
            Document clinic = DatabaseManager.clinicsCollection.find(eq("clinic_id", retrievedPayloadDoc.get("clinic_id"))).first();

            if (clinic == null) { // REFACTORING IDEA: StatusCode class - Constructor value '404' --> Put -1 on every attribute except 'status'
                statusCode = "404";
            }
            else {
                clinicJson = gson.toJson(clinic);
            }
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            statusCode = "500";
        }


        // Refactor: PayloadParser.createJSONPayload(map)
        map.put("clinics", clinicJson);
        map.put("requestID", requestID);
        map.put("status", Integer.parseInt(statusCode));

        publishString = gson.toJson(map);
    }

    public void getAllClinics() {
        Document retrievedPayloadDoc = getClinicDocument("getAll", new ClinicSchema());
        FindIterable<Document> allRegisteredClinics = DatabaseManager.clinicsCollection.find();

        // TODO: Refactor later
        Gson gson = new Gson();
        String clinicsJson = "-1";
        String requestID = retrievedPayloadDoc.get("requestID").toString();
        String statusCode = "200";

        try {
            Iterator<Document> it = allRegisteredClinics.iterator();
            ArrayList<Document> clinics = new ArrayList<>();

            while (it.hasNext()) {
                Document currentClinic = it.next();
                clinics.add(currentClinic);
            }

            clinicsJson = gson.toJson(clinics);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            statusCode = "500";
        }

        // TODO: Refactor later
        Map<String, Object> map = new HashMap<>(); // TODO: Refactor into PayloadParser.java and use in NearbyClinics.java
        map.put("clinics", clinicsJson.toString());
        map.put("requestID", requestID.toString());
        map.put("status", Integer.parseInt(statusCode));

        publishString = gson.toJson(map);
    }

    public void addEmployee() {
        updateClinicEmployees("add");
    }

    public void removeEmployee() {
        updateClinicEmployees("remove");
    }

    // Register or delete clinic from system
    private Document getClinicDocument(String operation, CollectionSchema collectionSchema) { // TODO: Replace this method in the method below where we use EmploymentSchema
        CollectionSchema clinicObject = new ClinicSchema();
        clinicObject.assignAttributesFromPayload(payload, operation);
        return clinicObject.getDocument();
    }

     // Accounts for addition and removal of dentists
    private void updateClinicEmployees(String operation) { // TODO: Refactor further according to single responsibility principle
        EmploymentSchema employmentObject = new EmploymentSchema();
        employmentObject.assignAttributesFromPayload(payload, operation);

        payloadDoc = employmentObject.getDocument();

        if (payloadDoc != null) {

            // TODO: Refactor this
            Document clinic = DatabaseManager.clinicsCollection.find(eq("clinic_id", payloadDoc.get("clinic_id"))).first();
            Document updateDoc = DatabaseManager.clinicsCollection.find(eq("clinic_id", payloadDoc.get("clinic_id"))).first();

            List<String> employees = (List<String>)clinic.get("employees");
            String dentistToUpdate = payloadDoc.get("dentist_id").toString();
            
            if (operation.equals("add")) {
                employees.add(dentistToUpdate);
            } else {
                employees.remove(dentistToUpdate);
            }

            updateDoc.replace("employees", employees);
            publishString = updateDoc.toJson();

            Bson query = eq("clinic_id", payloadDoc.get("clinic_id"));
            updateDoc.remove("requestID");
            DatabaseManager.clinicsCollection.replaceOne(query, updateDoc);

            String employeeOperation = operation.equals("add") ? "added to" : "remove from";
            System.out.println("Employee successfully " + employeeOperation +  " clinic");
        }
    }

    // Publishes a JSON message to an external component ('Dentist API' or 'Patient API')
    private void publishMessage() {
        if (publishString != "-1") {
            MqttMain.subscriptionManagers.get(topic).publishMessage(publishTopic, publishString);
        } else {
            System.out.println("Status 404 - Did not find DB-instance based on the given topic");
        }
    }

    /*
     Direct the codeflow to the method that deals with the
     requested operation specified in the mqtt subscription-topic.
     This method returns the corresponding topic to publish to,
     based on the performed operation.
    */
    private String runRequestedMethod() { // TODO: Impose a more strict structure of the topics such that we don't have to manually assign 'publishTopic' in each if-statement, but rather adding substring with a StringBuilder
        String publishTopic = "-1";

        // TODO:
        // 1) Refactor away the if-statements below
        // 2) Each action below is defined as the last substring of the topic. Use a general pattern check in the if-statements

        // Register clinic
        if (topic.contains(MqttMain.clinicTopicKeywords[1])) {
            registerClinic();
            publishTopic = "pub/dentist/clinics/register";
        }
        // Add dentist to clinic
        else if (topic.contains(MqttMain.clinicTopicKeywords[3])) {
            addEmployee();
            publishTopic = "pub/dental/clinics/dentist/add";
        }
        // Delete dentist from clinic
        else if (topic.contains(MqttMain.clinicTopicKeywords[4])) {
            removeEmployee();
            publishTopic = "pub/dental/clinics/dentist/remove";
        }
        else if (topic.contains(MqttMain.clinicTopicKeywords[5])) {
            deleteClinic();
            publishTopic = "pub/dental/clinics/delete";   
        }
        else if (topic.contains("all")) {
            getAllClinics();
            publishTopic = "grp20/dental/res/clinics/get/all";
        }
        else if (topic.contains("get")) {
            getOneClinic();
            publishTopic = "grp20/dental/res/clinics/get/one";
        }

        return publishTopic;
    }
}
