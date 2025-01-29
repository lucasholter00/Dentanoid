<template>
    <div>
        <b-container class="bg-white text-dark p-4 rounded">
        <h3>Register Clinic</h3>
            <add-clinic :publishClinic="publishClinic" />
        </b-container>
    </div>
</template>

<script>
import { Api } from '../Api'
import AddClinic from '../components/AddClinic.vue'

export default {
  components: {
    AddClinic
  },
  methods: {
    publishClinic(clinic) {
      Api.post('/clinics', clinic).then(response => {
        this.$bvModal.hide('add-clinic')
      })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>
