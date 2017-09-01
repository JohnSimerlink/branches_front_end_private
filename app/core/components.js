import '../components/main.less'

import Vue from 'vue'
// import Header from '../components/header/branchesHeader'
import Footer from '../components/footer/branchesFooter'
import ReviewSchedule from '../components/reviewAlgorithm/reviewSchedule'
import ContentList from '../components/contentList/contentList'
import ExerciseCreator from '../components/exerciseCreator/exerciseCreator'
import ExerciseCreatorContainer from '../components/exerciseCreatorContainer/exerciseCreatorContainer'
import TreeReview from '../components/treeReview/treeReview'
import TreeReviewContainer from '../components/treeReview/treeReviewContainer'
import NewExercise from '../components/exerciseCreator/newExercise'
import ExerciseList from '../components/exerciseList/exerciseList'
import Tree from '../components/tree/tree'
import NewTree from '../components/newTree/newtreecomponent'
import Toolbar from '../components/toolbar/toolbar'
import GoToHome from '../components/goToHome/goToHome'
import ProficiencySelector from '../components/proficiencySelector/proficiencySelector'
// Vue.component('branchesHeader', Header)
Vue.component('branchesFooter', Footer)
Vue.component('reviewSchedule', ReviewSchedule)
Vue.component('contentList', ContentList)
Vue.component('exerciseCreator', ExerciseCreator)
Vue.component('exerciseCreatorContainer', ExerciseCreatorContainer)
Vue.component('treeReview', TreeReview)
Vue.component('treeReviewContainer', TreeReviewContainer)
Vue.component('exerciseList', ExerciseList)
Vue.component('newExercise', NewExercise)
Vue.component('tree', Tree)
Vue.component('newtree', NewTree)
Vue.component('toolbar', Toolbar)
Vue.component('goToHome', GoToHome)
Vue.component('proficiencySelector', ProficiencySelector)
