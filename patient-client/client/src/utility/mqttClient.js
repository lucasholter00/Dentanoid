// mqttClient.js
import mqtt from 'mqtt'

let client = null

const getClient = function getClient() {
  if (client === null) {
    client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', { protocol: 'wss' })
  }

  client.on('error', (error) => {
    console.error('MQTT connection error:', error)
  })

  client.on('close', () => {
    console.log('MQTT connection closed')
    client = null
  })

  return client
}

export default getClient
