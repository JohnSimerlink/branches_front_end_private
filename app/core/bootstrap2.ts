// import {AppContainer} from './appContainer';
import Vue from 'vue';
// import AsyncComputed from 'vue-async-computed'
import VueRouter from 'vue-router'
import KnawledgeMap from '../components/knawledgeMap/knawledgeMap2'
import './components2'
import {log} from './log'
import store from './store2'
Vue.use(VueRouter);
// Vue.use(AsyncComputed);

// const appContainer = new AppContainer()
// appContainer.start()

// 1. Define route components.
// These can be imported from other files
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const Buy = { template: '<div> Give us ur monee</div>'}
// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
    { path: '/', component: KnawledgeMap, props: true }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    routes, // short for `routes: routes`
    mode: 'history',
})

const vm = new Vue({
    el: '#branches-app',
    created() {
        return void 0
    },
    data() {
        return {
        }
    },
    computed: {
    },
    methods: {
    },
    store,
    router
})
