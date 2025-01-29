<template>
  <div>
    <b-button @click="$bvModal.show('dateSelector')" variant="dark">Filter times</b-button>

    <b-modal id="dateSelector" @ok="$emit('selectedTime', { timespan: {startDate: startDate, endDate: endDate}, filterOptions: clinicFilter })"
    :ok-disabled="!validInput" title="Select search parameters">
      <div>
        <b-form-group label="Start time">
          <b-form-datepicker id="startDate" v-model="startDate" locale="en" size="sm"></b-form-datepicker>
        </b-form-group>
        <b-form-group label="End time">
          <b-form-datepicker id="endDate" v-model="endDate" locale="en" size="sm"></b-form-datepicker>
        </b-form-group>
        <b-form-group label="Filter clinics" v-if="findClinicsPage">
          <b-form-select v-model="clinicFilter" :options="filterOptions" size="sm" class="mt-1"></b-form-select>
        </b-form-group>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  /* This component contains a modal which allows for selecting dates and clinics, this is emitted in an event on ok click */
  name: 'timeSpanModal',
  props: {
    findClinicsPage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      startDate: null,
      endDate: null,
      clinicFilter: null,
      filterOptions: [
        { text: 'All clinics', value: 'all' },
        { text: '10 Closest clinics', value: 'closest' }
      ]
    }
  },
  methods: {
    show() {
      this.$bvModal.show('dateSelector')
    }
  },
  computed: {
    validInput() {
      if (this.findClinicsPage) {
        return this.startDate && this.endDate && this.clinicFilter
      }
      return this.startDate && this.endDate
    }
  }
}

</script>
