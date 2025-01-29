<template>
  <div id="app">
    <div class="auth-inner content">
      <Navbar />
      <b-container class="py-3">
        <router-view />
      </b-container>
    </div>
    <BottomNav />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import BottomNav from './components/Footer.vue'
import './styles/main.css'
export default {
  components: { Navbar, BottomNav }
}
</script>
