import './components'
import './objects'
import './utils'
import moment from 'moment'
import Vue from 'vue'
import HeaderComponent from '../components/header/branchesHeader'
import ReviewScheduleComponent from '../components/reviewAlgorithm/reviewSchedule'
import TreeComponent from '../components/tree/tree'
import NewTreeComponent from '../components/newTree/newtreecomponent'
Vue.component('branchesHeader', HeaderComponent)
Vue.component('reviewSchedule', ReviewScheduleComponent)
Vue.component('tree', TreeComponent)
Vue.component('newtree', NewTreeComponent)
Vue.filter('timeFromNow', utcTimestamp => {
    return moment(utcTimestamp).fromNow()
})
Vue.filter('sortByNextReviewTime', arr => {
    return arr.sort((a,b) => a.nextReviewTime > b.nextReviewTime)
})
Vue.filter('secondsToPretty', (seconds=0)  => {
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    let days = Math.floor(hours / 24)
    console.log('minutes, hours, days', minutes, hours,days)
    let unit, word;
    if (days){
        unit = days;
        word = "day"
    } else if (hours){
        unit = hours;
        word = 'hour'
    } else if (minutes){
        unit = minutes;
        word = 'minute'
    } else {
        unit = 0
        word = 'minutes'
    }
    if (unit > 1){
        word += 's'
    }
    var ret = unit + ' ' + word
    console.log('seconds pretty res is ', ret)
    return unit + " " + word
})
var vm = new Vue({
    el: '#branches-app'
})