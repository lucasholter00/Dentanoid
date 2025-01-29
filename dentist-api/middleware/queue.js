const { responseMap, client, mqttTimeout } = require('../controllers/utils');
const { v4: uuidv4 } = require('uuid');

function handleQueue(req, res, next) {
    if (!client.connected) { return res.status(502).json({ error: "MQTT client not connected" }) }
    const uuid = uuidv4()
    req.requestID = uuid;
    responseMap.set(uuid, res)
    mqttTimeout(uuid, 10000)
    next()
}

module.exports = {
    handleQueue
}