import './components'
import './filters'
import './objects'
import './utils'
import '../components/main.less'
import Vue from 'vue'
var vm = new Vue({
    el: '#branches-app',
    created(){

        PubSub.subscribe('goToState.exerciseCreator', (eventName, data) => {
           this.goToExerciseCreator()
        })
        PubSub.subscribe('goToState.treeReview', (eventName, treeId) => {
            this.goToTreeReview()
        })
        PubSub.subscribe('goToState.home', (eventName, data) => {
            this.goToHome()
        })
    },
    data() {
        return {
            state: 'treeReview',
        }
    },
    computed: {
        home() {
           return this.state == 'home'
        },
        exerciseCreator() {
            return this.state == 'exerciseCreator'
        },
        treeReview() {
            return this.state == 'treeReview'
        },
    },
    methods: {
        goToHome(){
            window.location = window.location //refresh the page lol - for some reason graph seems to malfunction when not doing this
            this.state='home'
        },
        goToExerciseCreator(){
           this.state='exerciseCreator'
        },
        goToTreeReview() {
            this.state = 'treeReview'
        },
    }
})