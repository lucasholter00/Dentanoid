const mqtt = require("mqtt")
require('dotenv').config();
require('../email/emailController')
const {sendNewTimeslotsEmail, sendBookingNotificationEmail} = require("../email/emailController");
const {subToEmails, unsubFromEmails, getSubscriber, updateSubscriber} = require('../database/subscribersController')

const mqttOptions = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    username: "dentanoid",
    password: "dentanoid123"
}

const subscriptionTopics = [
    'grp20/req/notification/sub',
    'grp20/req/notification/unsub',
    'grp20/req/subscriber/get',
    'grp20/availabletimes/live/+',
    'grp20/req/subscriber/update',
    'grp20/req/booking/confirmation',
    'grp20/req/booking/cancellation'
]

const client = mqtt.connect(mqttOptions)

client.on("message", (topic, message) => {
    console.log('Topic: ' + topic)
    console.log('Message received: ' + message)
    switch (topic) {
        case 'grp20/req/notification/sub':
            subToEmails(message)
            break
        case 'grp20/req/notification/unsub':
            unsubFromEmails(message)
            break
        case 'grp20/req/subscriber/get':
            getSubscriber(message)
            break
        case 'grp20/req/subscriber/update':
            updateSubscriber(message)
            break
        case 'grp20/req/booking/confirmation':
            sendBookingNotificationEmail(topic, message)
            break
        case 'grp20/req/booking/cancellation':
            sendBookingNotificationEmail(topic, message)
            break
    }
    if (topic.includes('grp20/availabletimes/live/')) {
       sendNewTimeslotsEmail(message)
    }
})

client.on("connect", () => {
    console.log("Req client Successfully connected to broker")
    client.subscribe(subscriptionTopics)
})

client.on("reconnect", () => {
    console.log("Req client Reconnecting to broker...")
})

client.on("error", (error) => {
    console.error(error)
})

client.on("close", () => {
    console.log("Req client Disconnected from broker")
})

module.exports = {client}
