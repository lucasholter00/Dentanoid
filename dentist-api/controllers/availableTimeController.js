const { client } = require("./utils")


/* GET appointments/users/:patientID' 
gets appointments with matching patientID. */
async function getUsersAppointments(req, res, next) {

    try {
        const patientID = req.params.patientID;
        const publishTopic = "grp20/req/appointments/get";

        client.publish(publishTopic, JSON.stringify({
            patientID: patientID,
            requestID: req.requestID
        }), (err) => { if (err) { next(err) } });
    }
    catch (err) {
        next(err);
    }
}
/* POST appointments/ 
Create appointment using a patientID and timeslotID*/
async function createAvailableTime(req, res, next) {

    try {
        
        const publishTopic = "grp20/req/availabletimes/create"

        const clinic_id = req.body.clinic_id;
        const dentist_id = req.body.dentist_id;
        const start_time = req.body.start_time;
        const end_time = req.body.end_time;

        client.publish(publishTopic, JSON.stringify({
            clinic_id: clinic_id,
            dentist_id,
            Start_time: start_time,
            End_time: end_time,
            requestID: req.requestID
        }), (err) => { if (err) { next(err) } });
        // mqttTimeout(uuid, 10000)
    }
    catch (err) {
        next(err)
    }
}
async function getAllTimeSlots(req, res, next) {
    try {
        const { dentistID } = req.params;
        const publishTopic = "grp20/req/timeslots/get"
        client.publish(publishTopic, JSON.stringify({
            Dentist_id: dentistID,
            requestID: req.requestID
        }))
    }
    catch(err) {
        next(err)
    }
}
/* DELETE appointments/:appointmentID 
DELETE appointment using an appointmentID*/
async function deleteAvailableTime(req, res, next) {

    try {
        const { id } = req.params;
        const publishTopic = "grp20/req/timeslots/delete"
        client.publish(publishTopic, JSON.stringify({
            requestID: req.requestID,
            _id: id
        }), (err) => { if (err) { next(err) } });
    }
    catch (err) {
        next(err)
    }
}
module.exports = {
    getUsersAppointments,
    createAvailableTime,
    deleteAvailableTime,
    getAllTimeSlots
};
