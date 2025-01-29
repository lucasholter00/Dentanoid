<template>
  <div id="app">
    <div id="nav">
      <DentaNoidHeader/>
    </div>
    <!-- Your application content -->
    <router-view class="container"/>
    <DentanoidFooter/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
</style>

<script>

import DentaNoidHeader from './component/DentaNoidHeader.vue'
import DentanoidFooter from './component/DentanoidFooter.vue'
export default {
  name: 'app',
  components: { DentanoidFooter, DentaNoidHeader }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
}
.custom-rounded-card {
  border-radius: 7px !important;
  border: blue;
  overflow: hidden;
}

.loading-container {
  display: flex;
  align-items: center !important;
  justify-content: center !important;
  height: 50vh;
}

.loading-spinner {
  color: #535252; /* Set the color to grey or your desired color */
}

</style>
