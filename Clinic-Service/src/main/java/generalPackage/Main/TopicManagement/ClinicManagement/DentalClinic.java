package generalPackage.Main.TopicManagement.ClinicManagement;

import java.util.List;
import org.bson.Document;
import org.bson.conversions.Bson;
import static com.mongodb.client.model.Filters.eq;

import generalPackage.Main.MqttMain;
import generalPackage.Main.DatabaseManagement.DatabaseManager;
import generalPackage.Main.DatabaseManagement.PayloadParser;
import generalPackage.Main.DatabaseManagement.Schemas.CollectionSchema;
import generalPackage.Main.DatabaseManagement.Schemas.Clinic.ClinicSchema;
import generalPackage.Main.DatabaseManagement.Schemas.Clinic.EmploymentSchema;

public class DentalClinic implements Clinic {
    private Document publishPayloadDoc = null;
    private String publishTopic = "-1";
    private String topic;
    private String payload;

    // TODO: Make 'topic' and 'payload' a private String attribute to avoid reduntant passing as a parameter across all methods
    
    public DentalClinic(String topic, String payload) {
        this.topic = topic;
        this.payload = payload;
        executeRequestedOperation(topic, payload);
    }

    public void executeRequestedOperation(String topic, String payload) { // TODO: Remove both parameters in Client.java
        publishTopic = runRequestedMethod();
        publishMessage();
    }

    public void registerClinic() {
        publishPayloadDoc = getClinicDocument("create", new ClinicSchema());
        DatabaseManager.clinicsCollection.insertOne(publishPayloadDoc);

        /*
        // Note for developers: This code is in development

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
            FileWriter file = new FileWriter("Clinic-Service\\src\\main\\java\\generalPackage\\GoogleAPI\\validatedClinic.json");
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
        // ------------------------------------------------------------
        */
    }

    public void deleteClinic() {
        publishPayloadDoc = getClinicDocument("delete", new ClinicSchema());
        DatabaseManager.clinicsCollection.deleteOne(eq("clinic_id", publishPayloadDoc.get("clinic_id")));
    }

    public void getOneClinic() {
        Document retrievedPayloadDoc = getClinicDocument("getOne", new ClinicSchema());
        Document clinic = DatabaseManager.clinicsCollection.find(eq("clinic_id", retrievedPayloadDoc.get("clinic_id"))).first();
        publishPayloadDoc = clinic.append("requestID", retrievedPayloadDoc.get("requestID"));

        System.out.println("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ");
        System.out.println("publishPayloadDoc: " + publishPayloadDoc);
        System.out.println("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ");
    }

    public void getAllClinics() {
        publishPayloadDoc = getClinicDocument("getAll", new ClinicSchema());
    }

    public void addEmployee() {
        updateClinicEmployees(payload, "add");
    }

    public void removeEmployee() {
        updateClinicEmployees(payload, "remove");
    }

    // Register or delete clinic from system
    private Document getClinicDocument(String operation, CollectionSchema collectionSchema) { // TODO: Replace this method in the method below where we use EmploymentSchema
        CollectionSchema clinicObject = new ClinicSchema();
        clinicObject.assignAttributesFromPayload(payload, operation);
        return clinicObject.getDocument();
    }

     // Accounts for addition and removal of dentists
    private void updateClinicEmployees(String payload, String operation) { // TODO: Refactor further according to single responsibility principle
        EmploymentSchema employmentObject = new EmploymentSchema();
        employmentObject.assignAttributesFromPayload(payload, operation);
        publishPayloadDoc = employmentObject.getDocument();

        if (publishPayloadDoc != null) {

            // TODO: Refactor this
            Document clinic = DatabaseManager.clinicsCollection.find(eq("clinic_id", publishPayloadDoc.get("clinic_id"))).first();
            Document updateDoc = DatabaseManager.clinicsCollection.find(eq("clinic_id", publishPayloadDoc.get("clinic_id"))).first();

            List<String> employees = (List<String>)clinic.get("employees");
            String dentistToUpdate = publishPayloadDoc.get("dentist_id").toString();
            
            if (operation.equals("add")) {
                employees.add(dentistToUpdate);
            } else {
                employees.remove(dentistToUpdate);
            }

            updateDoc.replace("employees", employees);

            Bson query = eq("clinic_id", publishPayloadDoc.get("clinic_id"));
            DatabaseManager.clinicsCollection.replaceOne(query, updateDoc);

            String employeeOperation = operation.equals("add") ? "added to" : "remove from";
            System.out.println("Employee successfully " + employeeOperation +  " clinic");
        }
    }

    // Publishes a JSON message to an external component (Dentist API or Patient API)
    private void publishMessage() {
        if (publishPayloadDoc != null) {
            MqttMain.subscriptionManagers.get(topic).publishMessage(publishTopic, publishPayloadDoc.toJson());
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
        if (topic.contains(MqttMain.clinicTopicKeywords[1])) { // "register"
            registerClinic();
            publishTopic = "pub/dentist/clinic/register";
        }
        // Add dentist to clinic
        else if (topic.contains(MqttMain.clinicTopicKeywords[3])) { // "add"
            addEmployee();
            publishTopic = "pub/dental/clinic/dentist/add";
        }
        // Delete dentist from clinic
        else if (topic.contains(MqttMain.clinicTopicKeywords[4])) { // "remove"
            removeEmployee();
            publishTopic = "pub/dental/clinic/dentist/remove";
        }
        else if (topic.contains(MqttMain.clinicTopicKeywords[5])) { // "delete"
            deleteClinic();
            publishTopic = "pub/dental/clinic/delete";   
        }
        else if (topic.contains("get")) {
            getOneClinic();
            // getAllClinics();
            publishTopic = "grp20/req/clinics/get";
        }

        return publishTopic;
    }
}
