import {inject, injectable} from 'inversify';
import {TYPES} from '../objects/types';
import {IKnawledgeMapCreator, INewTreeComponentCreator, ITreeCreator, IVueConfigurer} from '../objects/interfaces';
import {ComponentOptions} from 'vue'
let Vue = require('vue').default
if (!Vue) {
    Vue = require('vue')
}
// import VueRouter from 'vue-router'
let VueRouter = require('vue-router').default;
if (!VueRouter) {
    VueRouter = require('vue-router')
}
let AsyncComputed = require('vue-async-computed').default
if (!AsyncComputed ) {
    AsyncComputed = require('vue-async-computed')
}
import Main from '../components/main/main'
import SignUp from '../components/signUp/signUp'
import StudyMenu from '../components/studyMenu/studyMenu'
import ItemHistory from '../components/itemHistory/itemHistory'
import BranchesFooter from '../components/footer/branchesFooter'
import ProficiencySelector from '../components/proficiencySelector/proficiencySelector'
import Ebbinghaus from '../components/ebbinghaus/ebbinghaus'
import Coordinates from '../components/coordinates/coordinates'
import Points from '../components/points/points'
import MapChooser from '../components/mapChooser/mapChooser'
import {Store} from 'vuex';
import { StripeCheckout } from 'vue-stripe'
import BranchesStripe from '../components/giveUsUrMonee/branches-stripe';
import AsyncComputed from 'vue-async-computed'
@injectable()
export class VueConfigurer implements IVueConfigurer {
    public treeComponentCreator: ITreeCreator
    public newTreeComponentCreator: INewTreeComponentCreator
    public knawledgeMapCreator: IKnawledgeMapCreator
    public store: Store<any>
    constructor(@inject(TYPES.VueConfigurerArgs){
        treeComponentCreator,
        newTreeComponentCreator,
        knawledgeMapCreator,
        store,
   }: VueConfigurerArgs) {
        this.treeComponentCreator = treeComponentCreator
        this.newTreeComponentCreator = newTreeComponentCreator
        this.knawledgeMapCreator = knawledgeMapCreator
        this.store = store
    }
    public configure() {
        // const treeComponentCreator: ITreeCreator =
        //     new TreeCreator({store})
        const Tree = this.treeComponentCreator.create()
        const NewTree = this.newTreeComponentCreator.create()
        const KnawledgeMap = this.knawledgeMapCreator.create()

        const Buy = { template: require('../components/giveUsUrMonee/branches-stripe.html')};

        Vue.component('knawledgeMap', KnawledgeMap)
        Vue.component('tree', Tree)
        Vue.component('signUp', SignUp)
        Vue.component('stripeCheckout', StripeCheckout);
        Vue.component('studyMenu', StudyMenu)
        Vue.component('itemHistory', ItemHistory)
        Vue.component('proficiencySelector', ProficiencySelector)
        Vue.component('newtree', NewTree)
        Vue.component('branchesFooter', BranchesFooter)
        Vue.component('branchesStripe', BranchesStripe)
        Vue.component('points', Points)
        Vue.component('mapChooser', MapChooser)

        Vue.use(VueRouter);
        Vue.use(AsyncComputed)
        const routes = [
            { path: '/', component: Main, props: true },
            { path: '/buy', component: BranchesStripe, props: true },
            { path: '/ebbinghaus', component: Ebbinghaus, props: true },
            { path: '/coordinates', component: Coordinates, props: true },
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
                // log('Vue instance created')
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
            store: this.store,
            router
        } as ComponentOptions<any> /*TODO: should be ComponentOptions<Vue>*/)
    }
}

@injectable()
export class VueConfigurerArgs {
    @inject(TYPES.ITree3Creator) public treeComponentCreator: ITreeCreator
    @inject(TYPES.INewTreeComponentCreator) public newTreeComponentCreator: INewTreeComponentCreator
    @inject(TYPES.IKnawledgeMapCreator) public knawledgeMapCreator: IKnawledgeMapCreator
    @inject(TYPES.BranchesStore) public store: Store<any>
}
