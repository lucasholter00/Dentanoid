const {v4: uuidv4} = require('uuid');
const {mqttTimeout, responseMap, client} = require("./utils")

async function getPatient(req, res, next) {
    if (!client.connected) {
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();
    try {
        const patientID = req.params.patientID;
        const publishTopic = "grp20/req/patients/get";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            patientID: patientID,
            requestID: uuid,
        }), (err) => {
            if (err) {
                next(err)
            }
        });
        await mqttTimeout(uuid, 10000)
    } catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

async function createPatient(req, res, next) {
    if (!client.connected) {
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();
    try {
        const name = req.body.name;
        const ssn = req.body.ssn;
        const email = req.body.email;
        const publishTopic = "grp20/req/patients/create";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            name: name,
            ssn: ssn,
            email: email,
            requestID: uuid
        }), (err) => {
            if (err) {
                next(err)
            }
        });
        await mqttTimeout(uuid, 10000)
    } catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

module.exports = {
    getPatient,
    createPatient
};