const {  client } = require('./utils');

async function login(req, res, next) {

    try {
        const publishTopic = "grp20/req/dentists/login"
        const username = req.body.username;
        const password = req.body.password;

        client.publish(publishTopic, JSON.stringify({
            requestID: req.requestID,
            username,
            password,
        }), (err) => { if (err) { next(err) } });

    }
    catch (err) {
        next(err)
    }
}


async function register(req, res, next) {

    try {
        /*
        // REFACTORED VERSION (Will be used once the group has agreed on the exact payload-attributes)
        const timeslotID = req.body.timeslotID;
        const patientID = req.body.patientID;
        */
        const publishTopic = "grp20/req/dentists/create"

        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;

        client.publish(publishTopic, JSON.stringify({
            requestID: req.requestID,
            username,
            password,
            email
        }), (err) => { 
            if (err) { next(err) } 
        });

    }
    catch (err) {
        next(err)
    }
}



module.exports = {
    login,
    register
}