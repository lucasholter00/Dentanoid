// A subscriber is a user who has opted to subscribe to new available timeslots and potentially other news from a clinic.
// A subscriber shall have email, array of clinics hen subscribes to and a userID as a foreign key.
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subscriberSchema = new Schema({
    patient_ID: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    clinic: {
        type: [String],
        required: true
    }
});

const sub = mongoose.model('subscriber', subscriberSchema);

module.exports = sub;