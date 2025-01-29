import { Api } from '../Api'

export async function getFreeTimeslots(dentistId) {
  try {
    const res = await Api.get('availabletimes/dentists/' + dentistId)
    if (res.status === 200) {
      return res
    }
  } catch (err) {
    console.error('Error when getting timeslots', err)
  }
}

export async function bookAppointment(availableTimeId) {
  try {
    const messageBody = { availableTime_id: availableTimeId }
    const res = await Api.post('appointments/', messageBody)
    if (res.status === 200 || res.status === 201) {
      return { success: true }
    }
  } catch (err) {
    console.error('Error when creating appointment', err)
    return { success: false }
  }
}

export async function getTimeWindowTimeSlots(clinics, timeSlot) {
  try {
    const clinicsString = clinics.join(',')
    const params = { clinics: clinicsString, start_time: timeSlot.startDate, end_time: timeSlot.endDate }
    const res = await Api.get('availabletimes/clinics', { params })
    if (res.status === 200) {
      return res
    }
  } catch (err) {
    console.error('Error when getting timeslots', err)
  }
}

export async function getAppointments() {
  try {
    const res = await Api.get('appointments/users/')
    if (res.status === 200 || res.status === 201) {
      return res
    }
  } catch (err) {
    console.error('Error when creating appointment', err)
    return { success: false }
  }
}

export async function cancelAppointment(appointmentId) {
  try {
    const res = await Api.delete('appointments/' + appointmentId)
    return res.status === 200
  } catch (error) {
    console.error('Error when deleting appointment', error)
    return { success: false }
  }
}
