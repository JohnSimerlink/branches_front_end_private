import './components'
import './filters'
import './objects'
import './utils'
import TreeReview from '../components/treeReview/treeReview'
import TreeReviewContainer from '../components/treeReview/treeReviewContainer'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
Vue.use(Vuex)
Vue.use(VueRouter)
const store = new Vuex.Store({
   state: {
       count: 0
   }
})
// 1. Define route components.
// These can be imported from other files
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar },
  { path: '/review/:leafId', component: TreeReviewContainer, props: true },
  { path: '/:treeId', component: TreeReviewContainer, props: true },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for `routes: routes`
})

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
        console.log('THIS APP is', this)
    },
    data() {
        return {
            state: 'none',
            routing: true,
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
    },
    store,
    router
})