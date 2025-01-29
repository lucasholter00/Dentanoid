const axios = require('axios')
require('dotenv').config()

const apiUrl = process.env.API_URL

async function getPatient(patient_ID){
  try {
    const response = await axios.get(apiUrl + 'patients/' + patient_ID)
    return response.data.patient
  } catch (error) {
    throw new Error('UNABLE TO SEND EMAIL', 'CAUSE:', error.message)
  }
}

async function getDentist(dentist_ID){
  try {
    const response = await axios.get(apiUrl + 'dentists/' + dentist_ID)
    return response.data.dentist
    } catch (error) {
      throw new Error('UNABLE TO SEND EMAIL', 'CAUSE:', error.message)
    }
  }

module.exports = { getPatient, getDentist }

