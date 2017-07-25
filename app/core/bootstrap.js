import App from './App.vue'
import VueFire from 'vuefire'
import Vue from 'vue'
import './components'
import './objects'
import './utils'

Vue.use(VueFire)

new Vue({el: '#bootstrap', render: h => h(App) })
