<template>
  <b-modal id="add-slot" title="Add Slot" hide-footer>
    <b-form @submit.prevent="() => publishSlot(appointment)">
      <b-form-group label="Date:" label-for="dateInput">
        <b-form-input v-model="appointment.date" type="date" required id="dateInput"></b-form-input>
      </b-form-group>
      <b-form-group label="Start Time:" label-for="startTimeInput">
        <b-form-input v-model="appointment.startTime" type="time" required id="startTimeInput"></b-form-input>
      </b-form-group>
      <b-form-group label="End Time:" label-for="endTimeInput">
        <b-form-input v-model="appointment.endTime" type="time" required id="endTimeInput"></b-form-input>
      </b-form-group>
      <clinic-select :clinic="appointment.clinic" :setClinic="setClinic" />
      <b-button type="submit" variant="primary">Publish Time Slot</b-button>
    </b-form>
  </b-modal>
</template>
<script>
import ClinicSelect from './ClinicSelect.vue'
export default {
  props: ['publishSlot'],
  components: { ClinicSelect },
  data() {
    return {
      appointment: {
        clinic: '',
        date: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  methods: {
    setClinic(value) {
      this.appointment.clinic = value
    }
  }
}
</script>
