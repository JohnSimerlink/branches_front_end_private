import App from './App.vue'
import VueFire from 'vuefire'
import Vue from 'vue'

Vue.use(VueFire)

new Vue({el: '#app', render: h => h(App) })
