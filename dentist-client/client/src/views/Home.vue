<template>
  <div>
    <b-container v-if="this.loading" class="mx-auto text-center" id="loading-container">
      <img src="../assets/tooth.png" id="loading-img" class="d-block m-auto" />
      <h3>Brushing teeth...</h3>
    </b-container>
    <div v-else>
      <vue-cal style="height: 650px" class="vuecal--blue-theme" :disable-views="['years', 'year', 'month']" hide-weekends
        :time-cell-height="50" :events="appointments" :onEventClick="setEvent">
      </vue-cal>

      <add-slot :publishSlot="publishTimeSlot" />
      <manage-slot :selected-event="selectedEvent" :delete-event="deleteAppointment" />
      <b-button variant="primary" class="my-3" v-b-modal.add-slot>Add Timeslot</b-button>
      <br />
      <b-alert show variant="info" dismissible fade v-show="notifications.length > 0">
        <div v-for="(notification, index) in notifications" :key="index">{{ notification }}</div>
      </b-alert>
    </div>
  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import AddSlot from '../components/AddSlot.vue'
import ManageSlot from '../components/ManageSlot.vue'
import { Api } from '../Api'
import moment from 'moment'

export default {
  data() {
    return {
      // newAppointment: { date: '', startTime: '', endTime: '' }, // this depends on how the DB will look like
      appointments: [], // Appointments fetched from API will be stored here
      notifications: [], // Notifications fetched from API will be stored here
      selectedEvent: null,
      loading: false // Set to false once data is fetched from API
    }
  },
  components: { VueCal, AddSlot, ManageSlot },
  methods: {
    publishTimeSlot(appointment) {
      const user = localStorage.getItem('user')
      Api.post('/appointments/', {
        dentist_id: user,
        start_time: new Date(appointment.date + ' ' + appointment.startTime),
        end_time: new Date(appointment.date + ' ' + appointment.endTime),
        clinic_id: appointment.clinic
      })
        .then((response) => {
          const { availabletime } = response.data
          this.appointments.push({
            id: availabletime._id,
            title: 'Free Slot',
            start: `${appointment.date} ${appointment.startTime}`,
            end: `${appointment.date} ${appointment.endTime}`,
            class: 'free-slot'
          })
          this.$bvModal.hide('add-slot')
        })
    },
    deleteAppointment() {
      Api.delete(`/appointments/${this.selectedEvent.id}`).then(response => {
        const index = this.appointments.findIndex(event => event.id === this.selectedEvent.id)
        this.appointments.splice(index, 1)
        this.$bvModal.hide('selectedEvent')
      })
    },
    setEvent(event) {
      this.selectedEvent = event
      this.$bvModal.show('selectedEvent')
    },
    fetchAppointments() {
      Api.get(`/appointments/${localStorage.getItem('user')}/all`)
        .then(response => {
          const { appointments, availabletimes } = response.data
          const timeslots = [...appointments, ...availabletimes]
          this.appointments = timeslots.map(parseAppointment)
          this.loading = false
        })
        .catch(error => {
          console.error(error)
        })
    }
  },
  // Fetch appointments and notifications from API on component mount
  mounted() {
    this.fetchAppointments()
  }
}
function parseAppointment(appointment) {
  const booked = !!appointment.patient_id
  return {
    id: appointment._id,
    title: booked ? 'BookedSlot' : 'Free Slot',
    booked,
    class: booked ? 'booked-slot' : 'free-slot',
    start: moment(appointment.start_time).format('YYYY-MM-DD HH:mm'),
    end: moment(appointment.end_time).format('YYYY-MM-DD HH:mm')
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
