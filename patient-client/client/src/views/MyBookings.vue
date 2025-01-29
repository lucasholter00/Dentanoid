<template>
  <body>
  <b-container>
    <div v-if="!finishedLoading" class="loading-container">
      <b-spinner class="loading-spinner" label="Loading..."></b-spinner>
    </div>
    <b-row v-else>
      <b-row v-if="appointments.length > 0">
        <b-col v-for="(appointment, index) in appointments" :key="index">
          <b-card class="my-3 custom-rounded-card shadow-lg">
            <b-card-title>{{ appointment.clinicInfo.clinic_name }}</b-card-title>
            <br/>
            <b-card-sub-title> <b>Time: </b>{{ formatDateRange(appointment.start_time, appointment.end_time).subtitle }} {{ formatDateRange(appointment.start_time, appointment.end_time).title }}</b-card-sub-title>
            <br/>
            <b-card-sub-title><b>Location:</b> {{ appointment.clinicInfo.address }}</b-card-sub-title>
            <br/>
            <b-button variant="danger" @click="cancelAppointment(appointment._id, index)">
              Cancel Appointment
            </b-button>
          </b-card>
        </b-col>
      </b-row>
      <div v-else>
        <b-card no-body class="my-3 custom-rounded-card shadow-lg">
          <b-card-text>
            <p>You have no appointments <br> Try booking one! </p>
            <div class="image-container"><img src="../assets/sad-face.svg" alt=""></div>
          </b-card-text>
        </b-card>
      </div>
    </b-row>
    <div v-if="message">Error fetching data. Please try again.</div>
  </b-container>
  </body>
</template>

<script>
import { getAppointments, cancelAppointment } from '@/utility/timeslotUtils.js'

export default {
  name: 'MyBookings.vue',
  data() {
    return {
      appointments: [],
      finishedLoading: false,
      message: ''
    }
  },
  mounted() {
    this.getAppointments()
  },
  methods: {
    async getAppointments() {
      try {
        const res = await getAppointments()

        this.appointments = res.data.appointments
        this.finishedLoading = true
      } catch (error) {
        this.message = 'Error fetching appointments!'
      }
    },
    formatDateRange(start, end) {
      // Parse the start and end dates
      const startDate = new Date(start)
      const endDate = new Date(end)

      // Format the dates
      const formattedStartDate = `${String(startDate.getDate()).padStart(2, '0')}/${String(startDate.getMonth() + 1).padStart(2, '0')} -${String(startDate.getFullYear()).slice(2)}`
      const formattedStartTime = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`

      const formattedEndTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`

      // Create the formatted title and subtitle, separating the date and time
      const title = `${formattedStartDate}`
      const subtitle = `${formattedStartTime} - ${formattedEndTime}`

      return { title, subtitle }
    },
    async cancelAppointment(appointmentId, index) {
      try {
        if (await cancelAppointment(appointmentId)) {
          this.appointments.splice(index, 1)
        }
      } catch (error) {
        console.log('Error')
      }
    }
  }
}
</script>

<style scoped>

</style>
