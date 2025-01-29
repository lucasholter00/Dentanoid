<template>
  <div class="container text-center ">

    <b-card no-body v-for="clinic in clinics" :key="clinic._id.$oid">
      <b-button variant="light" @click="$emit('clinicClick', clinic._id.$oid)">
         <p class="clinicInfoText">
         {{ clinic.clinic_name }} <br> <b>Address:</b> {{ clinic.address }}
        </p>
      </b-button>
    </b-card>
  </div>
</template>

<script>
/* This component takes an array of clinics and displays all of them as a list
  On click it emits and event with the clinic_id of the clinic that was clicked */
export default {
  props: {
    clinics: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

.clinicInfoText {
  min-width: fit-content;
  word-break: break-word;
  white-space: normal;
}
</style>
