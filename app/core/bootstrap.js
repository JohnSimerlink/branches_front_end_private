import './components'
import './objects'
import './utils'
import Vue from 'vue'
import HeaderComponent from '../components/header/branchesHeaderComponent'
Vue.component('branchesHeader', HeaderComponent)
var vm = new Vue({
    el: '#branches-app'
})