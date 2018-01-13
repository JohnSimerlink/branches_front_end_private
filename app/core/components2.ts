import '../components/main.less'

import Vue from 'vue'
import StudyMenu from '../components/studyMenu/studyMenu'
import Tree from '../components/tree/tree'
import ItemHistory from '../components/itemHistory/itemHistory'
// import ProficiencySelector from '../components/proficiencySelector/proficiencySelector'
Vue.component('tree', Tree)

Vue.component('studyMenu', StudyMenu)
Vue.component('itemHistory', ItemHistory)
// Vue.component('proficiencySelector', ProficiencySelector)
