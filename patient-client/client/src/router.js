import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import authentication from '@/views/Authentication.vue'
import myBookings from '@/views/MyBookings.vue'
import Notifications from '@/views/Notifications.vue'
import FindClinics from '@/views/FindClinics.vue'
import SignUp from '@/views/SignUp.vue'

import MapPage from './views/MapPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'landingPage',
      component: LandingPage
    },
    {
      path: '/clinics',
      name: 'FindClinics',
      component: FindClinics
    },
    {
      path: '/authentication',
      name: 'authenticationView',
      component: authentication
    },
    {
      path: '/mybookings',
      name: 'myBookingsView',
      component: myBookings
    },
    {
      path: '/notifications',
      name: 'notificationsView',
      component: Notifications
    },
    {
      name: 'MapPage',
      path: '/map',
      component: MapPage
    },
    {
      name: 'SignUp',
      path: '/signup',
      component: SignUp
    }

  ]
})
