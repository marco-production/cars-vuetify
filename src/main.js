import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.prototype.$apiUrl = 'http://localhost:8000/';

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

