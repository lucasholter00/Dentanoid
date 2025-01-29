const {client} = require("./utils")

async function registerClinic(req, res, next) {

    try {
        const clinic_name = req.body.clinic_name;
        const clinic_id = req.body.clinic_id;
        const position = req.body.position;
        const employees = req.body.employees;

        const publishTopic = "grp20/req/dental/clinics/register"
        const publishMessage = JSON.stringify({
            requestID: req.requestID,
            clinic_name: clinic_name,
            clinic_id: clinic_id,
            position: position,
            employees: employees
        })

        client.publish(publishTopic, publishMessage, (err) => { if (err) { next(err) } });
    }
    catch (err) {
        next(err)
    }
}

async function addDentist(req, res, next) {
    try {
        const clinic_name = req.body.clinic_name;
        const clinic_id = req.body.clinic_id;
        const employee_name = req.body.employee_name;

        const publishTopic = "grp20/req/dental/clinics/add"
        const publishMessage = JSON.stringify({
            requestID: req.requestID,
            clinic_name: clinic_name,
            clinic_id: clinic_id,
            employee_name: employee_name
        })

        client.publish(publishTopic, publishMessage, (err) => { if (err) { next(err) } });
    }
    catch (err) {
        next(err)
    }
}

async function removeDentist(req, res, next) {

    try {
        const clinic_name = req.body.clinic_name;
        const clinic_id = req.body.clinic_id;
        const employee_name = req.body.employee_name;

        const publishTopic = "grp20/req/dental/clinics/remove"
        const publishMessage = JSON.stringify({
            requestID: req.requestID,
            clinic_name: clinic_name,
            clinic_id: clinic_id,
            employee_name: employee_name
        })

        client.publish(publishTopic, publishMessage, (err) => { if (err) { next(err) } });
    }
    catch (err) {
        next(err)
    }
}

async function getClinics(req, res, next) {
    try {
        const publishTopic = "grp20/req/dental/clinics/get"
        const publishMessage = JSON.stringify({
            requestID: req.requestID
        })
        client.publish(publishTopic, publishMessage, (err) => { if (err) { next(err) } });
    }
    catch (err) {
        next(err)
    }
}

module.exports = {
    registerClinic,
    addDentist,
    removeDentist,
    getClinics
};
