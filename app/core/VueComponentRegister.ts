import {inject, injectable} from 'inversify';
import {TYPES} from '../objects/types';
import {IKnawledgeMapCreator, INewTreeComponentCreator, ITree3Creator, IVueConfigurer} from '../objects/interfaces';
import Vue, {ComponentOptions} from 'vue'
// import VueRouter from 'vue-router'
let VueRouter = require('vue-router').default;
if (!VueRouter) {
    VueRouter = require('vue-router')
}
import StudyMenu from '../components/studyMenu/studyMenu'
import ItemHistory from '../components/itemHistory/itemHistory'
import BranchesFooter from '../components/footer/branchesFooter'
import ProficiencySelector from '../components/proficiencySelector/proficiencySelector'
import {Store} from 'vuex';

@injectable()
export class VueConfigurer implements IVueConfigurer {
    public treeComponentCreator: ITree3Creator
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
        // const treeComponentCreator: ITree3Creator =
        //     new Tree3Creator({store})
        const Tree = this.treeComponentCreator.create()
        const NewTree = this.newTreeComponentCreator.create()
        const KnawledgeMap = this.knawledgeMapCreator.create()
        Vue.component('tree', Tree)

        Vue.component('studyMenu', StudyMenu)
        Vue.component('itemHistory', ItemHistory)
        Vue.component('proficiencySelector', ProficiencySelector)
        Vue.component('newtree', NewTree)
        Vue.component('branchesFooter', BranchesFooter)

        Vue.use(VueRouter);
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
        } as ComponentOptions<Vue>)
    }
}

@injectable()
export class VueConfigurerArgs {
    @inject(TYPES.ITree3Creator) public treeComponentCreator: ITree3Creator
    @inject(TYPES.INewTreeComponentCreator) public newTreeComponentCreator: INewTreeComponentCreator
    @inject(TYPES.KnawledgeMapCreator) public knawledgeMapCreator: IKnawledgeMapCreator
    @inject(TYPES.BranchesStore) public store: Store<any>
}
