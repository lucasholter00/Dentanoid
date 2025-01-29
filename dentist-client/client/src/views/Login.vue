<template>
  <div style="background-color: white; padding: 20px; border-radius: 10px; color: black;">
    <b-form @submit="onSubmit" @reset="onReset">
      <div class="text-center">
        <img src="../assets/tooth.png" width="200px" />
      </div>
      <b-form-group label="Username:" label-for="Username:">
        <b-form-input id="input-2" v-model="form.username" required></b-form-input>
      </b-form-group>

      <b-form-group label="Password:" label-for="Password:">
        <b-form-input type="password" v-model="form.password" required></b-form-input>
      </b-form-group>
      <p>Don't have an account? <a href="/register">Register</a></p>
      <b-button type="submit" variant="primary">Login</b-button>
    </b-form>
    <!-- <b-card class="mt-3" header="Form Data Result">
            <pre class="m-0">{{ form }}</pre>
        </b-card> -->
  </div>
</template>

<script>
import { Api } from '../Api'

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      Api.post('/users/login', this.form)
        .then((response) => {
          localStorage.setItem('user', response.data.dentist._id)
          window.location = '/'
        })
        .catch((err) => {
          this.$bvToast.toast(err.response.data.message, {
            title: 'Error',
            variant: 'danger',
            autoHideDelay: 5000
          })
        })
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      // Trick to reset/clear native browser form validation state
    }
  }
}
</script>
