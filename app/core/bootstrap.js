import './objects'
console.log("1: bootstrap.js", Date.now(), calculateLoadTimeSoFar(Date.now()))
import './components'
import './filters'
import './utils'
import TreeReview from '../components/treeReview/treeReview'
import ContentList from '../components/contentList/contentList'
import TreeReviewContainer from '../components/treeReview/treeReviewContainer'
import ExerciseCreatorContainer from '../components/exerciseCreatorContainer/exerciseCreatorContainer'
import KnawledgeMap from '../components/knawledgeMap/knawledgeMap'
import Ebbinghaus from '../components/ebbinghaus/ebbinghaus'
import Vue from 'vue';
import MobileAnswerTray from '../components/mobileAnswerTray/mobileAnswerTray';
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import AsyncComputed from 'vue-async-computed'
import {Tree} from "../objects/tree";
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(AsyncComputed);
import store from './store.js'
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
  { path: '/study/:leafId', name: 'study', component: TreeReviewContainer, props: true },
  { path: '/create', name: 'create',  component: ExerciseCreatorContainer, props: true },
  { path: '/ebbinghaus', name: 'ebbinghaus', component: Ebbinghaus, props: true },
  { path: '/edit/:exerciseToReplaceId', name: 'edit',  component: ExerciseCreatorContainer, props: true },
  { path: '/contentList', name: 'contentList',  component: ContentList, props: true },
  { path: '/:treeId', component: KnawledgeMap, props: true },
  { path: '/', component: KnawledgeMap, props: true },
  { path: 'trees/:treeId/', component: Tree, props: true },
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
            this.goBack()
        })
        // router.go('/83cbe6ea3fa874449982b645f04d14a1')
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
        goBack(){
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