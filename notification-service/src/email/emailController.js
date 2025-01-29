// EmailController provides methods for building and sending emails.
require('dotenv').config()
const { DateTime } = require("luxon")
const {sendEmail} = require('./nodemailer')
const {getRecieverList} = require('../database/subscribersController')
const {newTimeslotsEmail} = require('./templates/newTimeslots.js')
const {bookingConfirmationEmail} = require('./templates/bookingConfirmation')
const {bookingCancellationEmail} = require('./templates/bookingCancellation')
const { getPatient, getDentist } = require('../apiRequests/userRequests')
const { getClinic } = require('../apiRequests/clinicRequests')
const {failedEmails} = require('./resilientEmailDelivery/failedEmails')

async function sendNewTimeslotsEmail(message) {
    try {
        message =  JSON.parse(message)

        receiverList = await getRecieverList(message.availabletime.clinic_id)
       
        if(receiverList.length > 0) {
            let email = await JSON.parse(JSON.stringify(newTimeslotsEmail))
            const clinic = await getClinic(message.availabletime.clinic_id)
            email.html = email.html.replace('[clinic]', clinic.clinic_name)
            email.to = receiverList

            await sendEmail(email)
        } else { 
            console.log('Zero patients subscribed to this clinic')
        }
    } catch (err) {
        console.error(err)
    }
}

async function sendBookingNotificationEmail(topic, message) {
    try {
        message =  JSON.parse(message)

        const patient = await getPatient(message.appointment.patient_id)
        const dentist = await getDentist(message.appointment.dentist_id)
        const clinic = await getClinic(message.appointment.clinic_id)
        let start = DateTime.fromISO(message.appointment.start_time).toFormat('yy-MM-dd HH:mm')
        let end = DateTime.fromISO(message.appointment.end_time).toFormat('yy-MM-dd HH:mm')
        
        let email
        if(topic  === 'grp20/req/booking/confirmation') { // Case confirmation
            email =  await JSON.parse(JSON.stringify(bookingConfirmationEmail))
        } else {                                          // Case cancellation
            email =  await JSON.parse(JSON.stringify(bookingCancellationEmail))
        }
            email.html = email.html.replace('[patient]', patient.username).replace('[dentist]', dentist.username)
                                   .replace('[clinic]', clinic.clinic_name).replace('[location]', clinic.address)
                                   .replace('[start_time]', start).replace('[end_time]', end)
            email.to = patient.email + ', ' + dentist.email
    
        await sendEmail(email)
    } catch (err) {
        message.topic = topic
        failedEmails.set(message.requestID, message)
        console.error(err)
    }
}

module.exports = {
    sendNewTimeslotsEmail, sendBookingNotificationEmail
}