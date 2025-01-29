<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary" id="main-header" style="font-size: 1.3rem;">
      <b-navbar-brand href="/">
        DentaNoid
<!--TODO: Insert logo        <img src="">-->
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item @click="$router.push('/clinics')">Find Clinics</b-nav-item>
          <b-nav-item @click="$router.push('/map')">Clinics Map</b-nav-item>
          <b-nav-item v-if="isLoggedIn" @click="$router.push('/mybookings')">My bookings</b-nav-item>
          <b-nav-item v-if="isLoggedIn" @click="$router.push('/notifications')">Notifications</b-nav-item>

        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="!isLoggedIn" @click="$router.push('/authentication')">Login</b-nav-item>
          <b-nav-item v-if="!isLoggedIn" @click="$router.push('/signup')">Sign Up</b-nav-item>
          <b-nav-item v-if="isLoggedIn" @click="signOut()">Sign out</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { Api } from '@/Api'
export default {
  name: 'Header.vue',
  data() {
    return {
      isLoggedIn: false
    }
  },
  methods: {
    signOut() {
      delete Api.defaults.headers.common.authorization
      localStorage.removeItem('token')
      window.location = '/authentication'
    },
    updateLoginStatus() {
      this.isLoggedIn = localStorage.getItem('token') != null
    }
  },
  created() {
    this.updateLoginStatus()

    window.addEventListener('storage', this.storageChange)
  }
}
</script>

<style scoped>

</style>
