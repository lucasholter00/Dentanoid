// The program initializes a mqtt client and connects attempts to connect it to a broker.
// The program initializes a mongo client and attempts to connect it, upon successful connection the db is pinged to prove connection.
// The program uses nodemailer to send an emails.
// The program runs cron jobs for resending failed emails and clearing map unsent emails every 24 h.
const {client} = require('./src/mqtt/mqttReqUtils')
const {resClient} = require('./src/mqtt/mqttResUtils')
const {resilientEmails, clearUndeliveredEmailsMap} = require('./src/email/resilientEmailDelivery/cronJobs')
