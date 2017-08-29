import './components'
import './filters'
import './objects'
import './utils'
import Vue from 'vue'
import Header from '../components/header/branchesHeader'
import ReviewSchedule from '../components/reviewAlgorithm/reviewSchedule'
import MobileAnswerTray from '../components/mobileAnswerTray/mobileAnswerTray'
import Toolbar from '../components/toolbar/toolbar'
Vue.component('branchesHeader', Header);
Vue.component('reviewSchedule', ReviewSchedule);
Vue.component('mobileAnswerTray', MobileAnswerTray);
Vue.component('toolbar', Toolbar);
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
    el: '#branches-app',
    created(){

        PubSub.subscribe('goToState.exerciseCreator', (eventName, data) => {
           this.goToExerciseCreator()
        })
        PubSub.subscribe('goToState.home', (eventName, data) => {
            this.goToHome()
        })
    },
    data() {
        return {
            state: 'home',
        }
    },
    computed: {
        home() {
           return this.state == 'home'
        },
        exercisecreator() {
            return this.state == 'exercisecreator'
        },
    },
    methods: {
        goToExerciseCreator(){
           this.state='exercisecreator'
        },
        goToHome(){
            window.location = window.location //refresh the page lol
            this.state='home'
        }
    }
})