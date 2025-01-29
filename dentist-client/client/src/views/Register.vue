<template>
  <div style="background-color: white; padding: 20px; border-radius: 10px; color: black;">
    <b-form @submit="onSubmit" @reset="onReset">

      <div class="text-center">
        <img src="../assets/tooth.png" width="200px" />
      </div>

      <b-form-group label="Email:" label-for="Email:">
        <b-form-input id="input-1" v-model="form.email" required></b-form-input>
      </b-form-group>

      <b-form-group label="Username:" label-for="Username:">
        <b-form-input id="input-2" v-model="form.username" required></b-form-input>
      </b-form-group>

      <b-form-group label="Password:" label-for="Password:">
        <b-form-input type="password" v-model="form.password" required></b-form-input>
      </b-form-group>

      <p>Already have an account? <a href="/login">Login</a></p>
      <b-button type="submit" variant="primary">Register</b-button>
    </b-form>
  </div>
</template>

<script>
import { Api } from '../Api'

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        email: ''
      }
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      Api.post('/users/register', this.form).then(response => {
        localStorage.setItem('user', response.data.dentist._id)
        window.location = '/'
      })
        .catch(error => {
          this.$bvToast.toast(error.response.data.message, {
            title: 'Error',
            variant: 'danger',
            autoHideDelay: 5000
          })
        })
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.email = ''
      this.form.password = ''
      this.form.username = ''
      // Trick to reset/clear native browser form validation state
    }
  }
}
</script>
