package com.group20.dentanoid.BackendMapAPI;
import java.util.ArrayList;

public class ValidatedClinic {
    // Regular clinic attributes
    private String clinic_name;
    private String clinic_id;
    private String position;
    private ArrayList<String> employees;

    // Google API validation attributes
    private String ratings;
    private String photoURL;
    private Integer status;
    private String address;

    public ValidatedClinic() {
    }

    public String getClinicName() {
        return this.clinic_name;
    }

    public String getClinicId() {
        return this.clinic_id;
    }

    public String getPosition() {
        checkPositionFormat();
        return this.position;
    }

    private void checkPositionFormat() { // Catch the case where dental clinic owner is oblivious and seperated lat,lng with an extra space
        String[] coordinates = this.position.split(",");
        String latitudeStartCharacter = String.valueOf(coordinates[1].charAt(0));

        if (latitudeStartCharacter.equals(" ")) {
            coordinates[1] = coordinates[1].substring(1);
        }

        this.position = String.join(",", coordinates);
        System.out.println(this.position);
    }

    public ArrayList<String> getEmployees() {
        return this.employees;
    }

    public String getRatings() {
        return this.ratings;
    }

    public String getPhotoURL() {
        return this.photoURL;
    }

    public Integer getStatus() {
        return this.status;
    }

    public String getAddress() {
        return this.address;
    }
}
