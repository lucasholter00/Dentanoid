<template>
    <!-- <b-modal id="add-clinic" title="Add Clinic" hide-footer> -->
        <b-form @submit.prevent="() => publishClinic(clinic)">
            <b-form-group label="Name:">
                <b-form-input v-model="clinic.clinic_name" required></b-form-input>
            </b-form-group>
            <b-form-group label="Position:" label-for="position">
                <b-form-input v-model="clinic.position" required id="position"></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary">Add Clinic</b-button>
        </b-form>
    <!-- </b-modal> -->
</template>
<script>
export default {
  props: ['publishClinic'],
  data() {
    return {
      clinic: {
        clinic_name: '',
        position: '57.12,12.16',
        employees: []
      }
    }
  }
}
</script>
