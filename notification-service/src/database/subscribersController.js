require('dotenv').config()
const mongoose = require('mongoose')
const {dbClient} = require('./databaseClient')
const {publishResponse, formatResponse} = require('../mqtt/mqttResUtils')
const sub = require('./models/subscriber')

const dbName = process.env.DB_NAME

// Gets which clinics a user is currently subscribed to
async function getSubscriber(message) {
    try {
        let parsedMessage = JSON.parse(message)
        
        const patient_ID = {patient_ID: parsedMessage.patient_ID}

        await dbClient.connect()
        console.log('Opened mongo connection')
        const db = dbClient.db(dbName)
        const collection = db.collection("Subscribers")
        const subscriber = await collection.findOne(patient_ID)

        let response
        if (subscriber === null) { // case: no matching subscriber --> formatting response to api
            response = await formatResponse(parsedMessage, 404, 'Subscriber not found', 'sub not found')
        } else {                   // case: subscriber found --> formatting response to api
            parsedMessage.subscriber = subscriber
            response = await formatResponse(parsedMessage, 200, null, 'sub found')
            
        }
        
        await publishResponse('grp20/res/subscriber/get', response)
    } catch (err) {
        console.error('GETSUBSCRIBER ERROR', err)
    } finally {
        await dbClient.close()
        console.log('Closed mongo connection')
    }
} 
// Subscribe patient to emails by adding them to the notification database.
async function subToEmails(message) {
    try {
        const parsedMessage = JSON.parse(message)
        const clinics = JSON.parse(parsedMessage.clinic)

        const newSubscriber = new sub({
            patient_ID: parsedMessage.patient_ID,
            email: parsedMessage.email,
            clinic: clinics
        })
        
        const validationError = newSubscriber.validateSync() // Validateing subscriber with mongoose schema

        let response
        if (validationError) { // Case: Invalid subscriber --> formatting response to api 
            response = await formatResponse(parsedMessage, 400, validationError.toString(), 'invalid document') 
        }  else {              // Case: Valid subscriber --> saveing doc and formatting response to api
            await dbClient.connect()
            console.log('Opened mongo connection')

            const db = dbClient.db(dbName)
            const collection = db.collection("Subscribers")
            const document = await collection.insertOne(newSubscriber)
            parsedMessage.subscriber = document

            response = await formatResponse(parsedMessage, 201, null, 'document saved')
        }

        await publishResponse('grp20/res/notification/sub', response)
    } catch (err) {
        console.error('SUBTOEMAIL ERROR', err)
    } finally {
        await dbClient.close()
        console.log('Closed mongo connection')
    }
}
// Unsubscribe a patient from emails by deleting them from the notification database.
async function unsubFromEmails(message) {
    try {
        const parsedMessage = JSON.parse(message)
        
        const patient_ID = {patient_ID: parsedMessage.patient_ID}

        await dbClient.connect()
        console.log('Opened mongo connection')
        const db = dbClient.db(dbName)
        const collection = db.collection("Subscribers")
        const subscriber = await collection.findOneAndDelete(patient_ID)
        
        let response
        if (subscriber === null) { // case: no matching subscriber found / delete failed --> formatting response to api
            response = await formatResponse(parsedMessage, 404, 'Subscriber not found', 'sub not found')
        } else {                   // Case: subscriber found delete succesful --> formatting response to api
            parsedMessage.subscriber = subscriber
            response = await formatResponse(parsedMessage, 200, null, 'sub found')
        }

        await publishResponse('grp20/res/notification/unsub', response)
    } catch (err) {
        console.error('UNSUBFROMEMAIL ERROR', err)
    } finally {
        await dbClient.close()
        console.log('Closed mongo connection')
    }
}

// Update a subscribers clinic preffrence. 
// This function currently only updates a subscribers clinic choice as the platform currently does not allow changes to email adress.
async function updateSubscriber(message) {
    try {
        const parsedMessage = JSON.parse(message)
    
        const patient_ID = {patient_ID: parsedMessage.patient_ID}
        const clinic = {clinic: JSON.parse(parsedMessage.clinic)}
        
        await dbClient.connect()
        const collection = dbClient.db(dbName).collection("Subscribers")
        const subscriber = await collection.updateOne(patient_ID, { $set: clinic })
        parsedMessage.subscriber = subscriber       
        
        let response
        if (subscriber.modifiedCount === 0) {    // case: no document modified
            if (subscriber.matchedCount === 0) { // case: no document modified && no matching subscriber --> formatting response to api
                response = await formatResponse(parsedMessage, 404, 'Subscriber not found', 'sub not found')
            } else {                             // case: no document modified && new subscriber values are old subscriber values --> formatting response to api
                response = await formatResponse(parsedMessage, 400, 'New value is old value', 'new is old')
            }
        } else {                                  // case: subscriber updated with new values --> formatting response to api
            response = await formatResponse(parsedMessage, 200, null, 'sub found')
        }

        await publishResponse('grp20/res/subscriber/update', response)
    } catch (err) {
        console.error('UPDATESUBSCRIBERPREFFRENCES ERROR', err)
    } finally {
        await dbClient.close()
        console.log('Closed mongo connection')
    }

}

// Returns an array of patients subscribed to a clinic
async function getRecieverList(clinic){
    let receiverList = []
    try {
        const filter = {"clinic": { "$elemMatch": { "$in": [clinic] } } }

        await dbClient.connect()
        console.log('Opened db connection')
        const db = dbClient.db(dbName)
        const collection = db.collection("Subscribers")
        const subscribers = collection.find(filter) // returns cursor
            
        for await (const doc of subscribers) {
            receiverList.push(doc.email)
          }

        return receiverList
    } catch(err) {
        console.error(err)
    } finally {
        await dbClient.close()
        console.log('Closed mongo connection')
    }
}

module.exports = {subToEmails, unsubFromEmails, getSubscriber, getRecieverList, updateSubscriber}