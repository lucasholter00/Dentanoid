import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.config.productionTip = false

Vue.prototype.$myGlobalVariable = 0

/*
const myGlobalVariable = {
  data() {
    return {
      testV: 'my global variable'
    }
  }
}
*/

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
