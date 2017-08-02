import './components'
import './objects'
import './utils'
import Vue from 'vue'
import HeaderComponent from '../components/header/branchesHeaderComponent'
import ReviewScheduleComponent from '../components/reviewAlgorithm/reviewScheduleComponent'
Vue.component('branchesHeader', HeaderComponent)
Vue.component('reviewSchedule', ReviewScheduleComponent)
var vm = new Vue({
    el: '#branches-app'
})