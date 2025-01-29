<template>
<!--
Wireframes:
 Sign uo - https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-20/group-20-distributed-systems/-/wikis/Patient-gui#sign-up
 Sign in - https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-20/group-20-distributed-systems/-/wikis/Patient-gui#sign-in
-->
  <body>
    <b-container>
      <p v-if="errorMessage">{{errorMessage}}</p>
      <b-form @submit="onSubmit">
        <b-form-group
          id="email-label"
          label="Email:"
          label-for="email"
        >
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter Email"
            required
          >
          </b-form-input>
        </b-form-group>

        <b-form-group
          id="username-label"
          label="Username:"
          label-for="username"
        >
          <b-form-input
            id="username"
            v-model="form.username"
            type="username"
            placeholder="Enter Username"
            required
          >
          </b-form-input>
        </b-form-group>

        <b-form-group
          id="password-label"
          label="Password:"
          label-for="password"
        >
          <b-form-input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Enter password"
            required
          >
          </b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>

      </b-form>

    </b-container>
  </body>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'SignUp.vue',
  data() {
    return {
      form: {
        username: '',
        password: '',
        email: ''
      },
      errorMessage: ''
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      Api.post('/patients', this.form)
        .then((response) => {
          this.$router.push('/authentication')
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 409) {
              this.errorMessage = 'Username taken'
            }
          } else {
            this.errorMessage = 'Server error'
          }
        })
    }
  }
}
</script>
