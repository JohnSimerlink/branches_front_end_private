import '../components/treesGraph'
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
