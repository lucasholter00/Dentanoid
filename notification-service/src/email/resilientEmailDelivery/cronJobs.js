const cron = require('node-cron')
const {sendBookingNotificationEmail} = require("../emailController")
const {failedEmails} = require('./failedEmails')

// This cron job runs every 5 minutes trying to resend undelivered emails.
const resilientEmails = cron.schedule('*/5 0-3,4:15-23 * * *', () => {
    console.log('Delivering some forgotten mail')
    for (let [key, value] of failedEmails) {
        failedEmails.delete(key)
        sendBookingNotificationEmail(value.topic, JSON.stringify(value))
    }
})

// This cron job clears the map of undelivered emails everyday at 04:05.
const clearUndeliveredEmailsMap = cron.schedule('5 4 * * *', () => {
    console.log('Clearing some forgotten mail')
    failedEmails.clear()
})

module.exports = {resilientEmails, clearUndeliveredEmailsMap}