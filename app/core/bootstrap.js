import './components'
import './filters'
import './objects'
import './utils'
import Vue from 'vue'
var vm = new Vue({
    el: '#branches-app',
    created(){

        PubSub.subscribe('goToState.exerciseCreator', (eventName, data) => {
            console.log('going to exercise creator')
           this.goToExerciseCreator()
        })
        PubSub.subscribe('goToState.home', (eventName, data) => {
            console.log('going to home')
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