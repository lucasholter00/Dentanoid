<template>
  <body>
    <div>
      <MapComponent />
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <div class="flex-container">
        <b-col cols="12" md="10" sm="12" lg="8" class="text-center">
        <timeSpanModal class="mb-3" @selectedTime="handleFilterTimes" />
        <ClinicList :clinics="clinics" v-if="showClinicList" @clinicClick="handleClinicClick" class="clinicList" />
        <timeslotAccordion :availableTimes="filteredAvailableTimes" v-if="showTimeslots"
          @showClinics="handleDisplayClinics" @deleteAvailableTime="handleDeleteAvailableTime" />
        </b-col>
        <!--No matching timeslots modal-->
        <b-modal id="noTimesFound" ok-only title="No matching times found">
          <p>No available times for selected clinics found</p>
          <br>
          <p>Try updating search criteria</p>
        </b-modal>
      </div>
    </div>

  </body>
</template>

<script>
import MapComponent from '../components/MapComponent.vue'
import ClinicList from '../component/clinics/ClinicList.vue'
import { clinicsData, drawClinicMarkers } from '../../public/maps/map-utils.js'
import timeSpanModal from '../component/timeslots/timeSpanModal.vue'
import { getTimeWindowTimeSlots } from '@/utility/timeslotUtils'
import timeslotAccordion from '../component/timeslots/timeslotAccordion.vue'
import getClient from '../utility/mqttClient.js'

export default {
  name: 'MapPage',
  data() {
    return {
      clinics: [],
      updateInterval: 100,
      previousClinicRequest: '',
      availableTimes: [],
      showClinicList: true,
      showTimeslots: false,
      selectedClinicId: null,
      client: null
    }
  },
  computed: {
    filteredAvailableTimes() {
      return this.availableTimes.filter((availableTime) => availableTime.clinic_id === this.selectedClinicId)
    }
  },
  methods: {
    checkClinicRequest() {
      if (clinicsData) {
        return clinicsData.clinics === this.previousClinicRequest ? 'false' : 'true'
      }
      return 'false'
    },
    handleDeleteAvailableTime(availableTimeId) {
      this.availableTimes = this.availableTimes.filter((availableTime) => availableTime._id !== availableTimeId)
    },
    initiateClinicMapRequestListener() {
      setInterval(
        () => {
          const updateClinicListUI = this.checkClinicRequest()
          if (updateClinicListUI === 'true') {
            this.previousClinicRequest = clinicsData.clinics
            this.clinics = clinicsData.clinics
          }
        },
        this.updateInterval
      )
    },
    async handleFilterTimes(filter) {
      this.timespan = filter.timespan
      try {
        const clinicIds = []
        this.clinics.forEach((clinic) => {
          clinicIds.push(clinic._id.$oid)
        })
        const res = await getTimeWindowTimeSlots(clinicIds, filter.timespan)
        if (res.data.availabletimes) {
          this.availableTimes = res.data.availabletimes
          const availableClinicIds = new Set(this.availableTimes.map(at => at.clinic_id))
          this.clinics = this.clinics.filter(clinic => availableClinicIds.has(clinic._id.$oid))

          const clinicIDsFilteredByTimeslot = new Set()
          res.data.availabletimes.forEach((clinic) => {
            clinicIDsFilteredByTimeslot.add(clinic.clinic_id)
          })

          drawClinicMarkers(clinicIDsFilteredByTimeslot)
        } else if (res.data.availabletimes === null || res.data.availabletimes.length === 0) {
          this.$bvModal.show('noTimesFound')
        }
        this.subscribeToClinics()
      } catch (err) {
        console.log(err)
      }
    },
    handleDisplayClinics() {
      this.showClinicList = true
      this.showTimeslots = false
    },
    handleClinicClick(clinicId) {
      this.showClinicList = false
      this.showTimeslots = true
      this.selectedClinicId = clinicId
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
  created() {
    this.initiateClinicMapRequestListener()
  },
  mounted() {
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
  components: {
    MapComponent,
    ClinicList,
    timeSpanModal,
    timeslotAccordion
  }
}
</script>

<style scoped>
.flex-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-width: 40vw;
  max-height: fit-content;
}

.clinicList {
  max-height: 50vh;
  overflow: auto;
}
</style>
