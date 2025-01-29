const axios = require('axios');
require('dotenv').config()

const apiUrl = process.env.API_URL

async function getClinic(clinic_id){
    try {
        const response = await axios.get(apiUrl + 'clinics/' + clinic_id)
        return response.data
      } catch (error) {
        throw new Error('UNABLE TO SEND EMAIL', 'CAUSE:', error.message)
      }
}

module.exports = { getClinic }