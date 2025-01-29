const {MongoClient} = require('mongodb');
require('dotenv').config();

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbCluster = process.env.DB_CLUSTER

const url = `mongodb+srv://${dbUser}:${dbPassword}@${dbCluster}/?retryWrites=true&w=majority`;

const dbClient = new MongoClient(url);

module.exports = {dbClient}
