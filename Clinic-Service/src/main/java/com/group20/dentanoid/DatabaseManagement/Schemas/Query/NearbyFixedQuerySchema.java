package com.group20.dentanoid.DatabaseManagement.Schemas.Query;
import org.bson.Document;

import com.google.gson.JsonObject;
import com.group20.dentanoid.DatabaseManagement.Schemas.CollectionSchema;

// The payload structure that contains a fixed number of nearby clinics to return
public class NearbyFixedQuerySchema implements CollectionSchema {
    private String nearby_clinics_number;
    private String reference_position;
    private String requestID;

    public NearbyFixedQuerySchema() {
        this.nearby_clinics_number = " ";
        this.reference_position = " ";
        this.requestID = " ";
    }

    @Override
    public Document getDocument() {
        return new Document("nearby_clinics_number", this.nearby_clinics_number)
        .append("reference_position", this.reference_position)
        .append("requestId", this.requestID);
    }

    public String getRequestId() {
        return this.requestID;
    }

    @Override
    public void assignAttributesFromPayload(String payload) {
    }

    @Override
    public void assignAttributesFromPayload(String payload, String operation) {
    }
}
