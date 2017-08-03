import './components'
import './objects'
import './utils'
import moment from 'moment'
import Vue from 'vue'
import HeaderComponent from '../components/header/branchesHeaderComponent'
import ReviewScheduleComponent from '../components/reviewAlgorithm/reviewScheduleComponent'
Vue.component('branchesHeader', HeaderComponent)
Vue.component('reviewSchedule', ReviewScheduleComponent)
Vue.filter('timeFromNow', utcTimestamp => {
    return moment(utcTimestamp).fromNow()
})
Vue.filter('sortByNextReviewTime', arr => {
    return arr.sort((a,b) => a.nextReviewTime > b.nextReviewTime)
})
var vm = new Vue({
    el: '#branches-app'
})