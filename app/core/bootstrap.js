import './components'
import './objects'
import './utils'
import moment from 'moment'
import Vue from 'vue'
import Header from '../components/header/branchesHeader'
import ReviewSchedule from '../components/reviewAlgorithm/reviewSchedule'
import Tree from '../components/tree/tree'
import NewTree from '../components/newTree/newtreecomponent'
import Toolbar from '../components/toolbar/toolbar'
Vue.component('branchesHeader', Header)
Vue.component('reviewSchedule', ReviewSchedule)
Vue.component('tree', Tree)
Vue.component('newtree', NewTree)
Vue.component('toolbar', Toolbar)
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