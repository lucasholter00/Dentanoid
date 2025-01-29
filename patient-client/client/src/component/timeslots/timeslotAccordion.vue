<template>
  <div class="d-flex">
    <b-card-body>
      <b-card-text v-if="!availableTimes"><strong>No available times found </strong></b-card-text>
    </b-card-body>
    <b-card no-body>
      <b-button variant="light" @click="$emit('showClinics')">
        {{ resetText }}
      </b-button>
    </b-card>
    <timeslotCard v-for="availableTime in availableTimes" :key="availableTime._id" :availableTime="availableTime"
      @bookedAppointment="deleteAvailableTimes"
      @bookingFailed="$bvModal.show('failedModal')">
    </timeslotCard>

    <div v-if="availableTimes.length < 1" class="text-center">
      <b-card no-body>
        <b-card-text>
          <p>No available times to show <br> try updating the time filter</p>
          <div class="image-container"><img src="@/assets/sad-face.svg" alt=""></div>
        </b-card-text>
      </b-card>
    </div>

    <!----booking outcome modal---->
    <b-modal :id="'successModal'" ok-only title="Success">
      <p>Appointment created</p>
    </b-modal>
    <b-modal :id="'failedModal'" ok-only title="Request failed">
      <p>Unable to book appointment</p>
    </b-modal>
  </div>
</template>

<script>
/* This component expects an array of available times passed to it as a prop, it will then display all available times and the dentist username */
import timeslotCard from './timeslotCard.vue'
export default {
  name: 'timeslotAccordion',
  props: {
    availableTimes: {
      type: Array,
      required: true
    }
  },
  components: {
    timeslotCard
  },
  data() {
    return {
      resetText: 'Back to Clinics'
    }
  },
  mounted() {
  },
  methods: {
    async deleteAvailableTimes(availableTimeId) {
      this.$emit('deleteAvailableTime', availableTimeId)
      this.$bvModal.show('successModal')
    }
  }
}
</script>

<style scoped>
.d-flex {
  flex-direction: column;
}
</style>
