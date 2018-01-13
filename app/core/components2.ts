import '../components/main.less'

import Vue from 'vue'
import StudyMenu from '../components/studyMenu/studyMenu'
import Tree from '../components/tree/tree'
import ItemHistory from '../components/itemHistory/itemHistory'
import ProficiencySelector from '../components/proficiencySelector/proficiencySelector'
// import NewTree from ''
import NewTree from '../components/newTree/newTree'
Vue.component('tree', Tree)

Vue.component('studyMenu', StudyMenu)
Vue.component('itemHistory', ItemHistory)
Vue.component('proficiencySelector', ProficiencySelector)
Vue.component('newtree', NewTree)
