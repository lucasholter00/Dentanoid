<template>
    <div class="d-flex" role="tablist">
        <b-card no-body class="mb-1">
            <b-button block v-b-toggle="accordionID" variant="light">
              <p class="timeText">
                {{ formatStartTime }} - {{ formatEndTime }}
              </p>
            </b-button>
            <b-collapse :id="accordionID" :visible="false" accordion="timeslot-accordion" role="tabpanel">
                <b-card-body>
                    <b-card-text><strong>Dentist:</strong> {{ this.dentist.username }}</b-card-text>
                    <div class="d-flex justify-content-center">
                        <b-button @click="createBooking">
                            Make appointment
                        </b-button>
                    </div>
                </b-card-body>
            </b-collapse>
        </b-card>
    </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import dateFormat, { masks } from 'dateformat'
import { bookAppointment } from '@/utility/timeslotUtils.js'
import { getDentist } from '@/utility/dentistUtils.js'
export default {
  name: 'timeslotCard',
  props: {
    availableTime: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dentist: ''
    }
  },
  computed: {
    accordionID() {
      return 'accordion' + this.availableTime._id
    },
    formatStartTime() {
      return dateFormat(this.availableTime.start_time, 'dddd, mmmm dS, yyyy, h:MM TT')
    },
    formatEndTime() {
      return dateFormat(this.availableTime.end_time, 'dddd, mmmm dS, yyyy, h:MM TT')
    }
  },
  methods: {
    async createBooking() {
      try {
        const res = await bookAppointment(this.availableTime._id)

        if (res.success === true) {
          this.$emit('bookedAppointment', this.availableTime._id)
        } else {
          this.$emit('bookingFailed')
        }
      } catch (err) {
        console.error(err)
      }
    },
    async getDentist() {
      try {
        const res = await getDentist(this.availableTime.dentist_id)
        this.dentist = res.data.dentist
      } catch (err) {
        console.error(err)
      }
    }
  },
  mounted() {
    this.getDentist()
  }
}
</script>

<style scoped>
.timeText {
  min-width: fit-content;
  word-break: break-word;
  white-space: normal;
}
</style>
