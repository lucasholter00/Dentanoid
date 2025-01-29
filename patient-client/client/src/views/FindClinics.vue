<template>
  <body>
    <div class="flex-container">

      <div class="m-2">
        <h1>Find a Clinic</h1>
      </div>

      <div class="d-flex mb-3">
        <timeSpanModal @selectedTime="handleSelectedTime" v-if="!displayTimeslots" :findClinicsPage="findClinicsPage" />
      </div>

      <div class="container-fluid">
        <b-col cols="12" md="10" sm="12" lg="8">
        <!--clinic list component-->
        <clinicList v-if="displayClinics" @clinicClick="handleClinicClick" :clinics="clinics"></clinicList>

        <!--timeslot list component-->
        <div>
          <timeslotAccordion :clinicID="selectedClinicId" v-if="displayTimeslots" :availableTimes="filteredAvailableTimes"
            @showClinics="handleDisplayClinics" @deleteAvailableTime="handleDeleteAvailableTime">
          </timeslotAccordion>
        </div>

        <!--No clinics to show-->
        <div v-if="clinics.length < 1" class="text-center">
          <b-card no-body>
            <b-card-text>
              <p>No clinics to show <br> try changing your search parameters</p>
              <div class="image-container"><img src="../assets/sad-face.svg" alt=""></div>
            </b-card-text>
          </b-card>
        </div>

        </b-col>
      </div>

    </div>
  </body>
</template>

<script>
import clinicList from '../component/clinics/ClinicList.vue'
import timeslotAccordion from '../component/timeslots/timeslotAccordion.vue'
import timeSpanModal from '../component/timeslots/timeSpanModal.vue'
import { getAllClinics, getClinic, getNclosestClinics } from '@/utility/clinicUtils'
import { getTimeWindowTimeSlots } from '@/utility/timeslotUtils'
import getClient from '../utility/mqttClient.js'

export default {
  name: 'ClinicsView',
  components: {
    clinicList,
    timeslotAccordion,
    timeSpanModal
  },
  data() {
    return {
      clinics: [],
      displayClinics: true,
      displayTimeslots: false,
      resetText: 'Show Clinics',
      availableTimes: [],
      userLocation: null,
      selectedClinicId: null,
      findClinicsPage: true,
      client: null,
      timespan: null
    }
  },
  computed: {
    filteredAvailableTimes() {
      return this.availableTimes.filter((availableTime) => availableTime.clinic_id === this.selectedClinicId)
    }
  },
  methods: {
    handleClinicClick(clinicId) {
      this.displayClinics = false
      this.displayTimeslots = true
      this.selectedClinicId = clinicId
    },
    handleDisplayClinics() {
      this.displayClinics = true
      this.displayTimeslots = false
    },
    /* This method takes a timespan and gets all available times matching the timespan for all clinics present
    in the clinic array */
    async getTimeSpanAppointments(timeSpan) {
      this.timespan = timeSpan
      try {
        const clinicIds = []
        this.clinics.forEach((clinic) => {
          clinicIds.push(clinic._id.$oid)
        })
        const res = await getTimeWindowTimeSlots(clinicIds, timeSpan)
        if (res.data.availabletimes) {
          this.availableTimes = res.data.availabletimes
          const availableClinicIds = new Set(this.availableTimes.map(at => at.clinic_id))
          this.clinics = this.clinics.filter(clinic => availableClinicIds.has(clinic._id.$oid))
        } else {
          this.clinics = []
        }
        this.subscribeToClinics()
      } catch (err) {
        console.error(err)
      }
    },
    /* This method handles the event emitted when the search filters have been selected */
    async handleSelectedTime(filter) {
      if (filter.filterOptions === 'closest') {
        await this.getClosestClinics()
      } else {
        await this.getClinics()
      }
      this.getTimeSpanAppointments(filter.timespan)
    },
    async getClinics() {
      try {
        const res = await getAllClinics()
        this.clinics = res.data.clinics
      } catch (err) {
        console.error(err)
      }
    },
    async getClinic(clinicId) {
      try {
        const res = await getClinic(clinicId)
        this.clinics.push(res.data.clinic)
      } catch (err) {
        console.error(err)
      }
    },
    handleDeleteAvailableTime(availableTimeId) {
      this.availableTimes = this.availableTimes.filter((availableTime) => availableTime._id !== availableTimeId)
    },
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        })
      } else {
        console.log('Geolocation failed.')
      }
    },
    /* This method gets the 10 closest clinics, however only the ones with an available time will actually be displayed */
    async getClosestClinics() {
      try {
        const coordinates = this.userLocation.latitude + ',' + this.userLocation.longitude
        const res = await getNclosestClinics(coordinates, 10)
        this.clinics = res.data.clinics
      } catch (err) {
        console.error(err)
      }
    },
    removeBooked(topic, message) {
      try {
        const deleteTime = JSON.parse(message)
        this.availableTimes = this.availableTimes.filter((availabletime) => availabletime._id !== deleteTime.appointment._id)
      } catch (err) {
        console.log(err)
      }
    },
    addNewTime(topic, message) {
      try {
        const newTime = JSON.parse(message)
        if (newTime.availabletime.start_time >= this.timespan.startDate && newTime.availabletime.end_time <= this.timespan.endDate) {
          this.availableTimes.push(newTime.availabletime)
        }
      } catch (err) {
        console.log(err)
      }
    },
    subscribeToClinics() {
      try {
        this.client.unsubscribe('#')
        for (const clinic of this.clinics) {
          this.client.subscribe('grp20/req/booking/confirmation/' + clinic._id.$oid)
          this.client.subscribe('grp20/availabletimes/live/' + clinic._id.$oid)
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted() {
    this.getUserLocation()
    try {
      this.client = getClient()
      this.client.on('connect', () => {
        console.log('Connected to MQTT broker')
      })

      this.client.on('message', (topic, message) => {
        if (topic.includes('grp20/req/booking/confirmation/')) {
          this.removeBooked(topic, message.toString())
        } else if (topic.includes('grp20/availabletimes/live/')) {
          this.addNewTime(topic, message)
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  destroyed() {
    this.client.end()
  }
}
</script>

<style scoped>
.flex-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-height: fit-content;
}

.container-fluid {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
