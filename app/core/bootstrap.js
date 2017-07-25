import App from './App.vue'
import VueFire from 'vuefire'
import Vue from 'vue'
import './components'
import './objects'
import './utils'
import {login} from './login.js'


Vue.use(VueFire)
new Vue({el: '#bootstrap', render: h => h(App) })


//ABOVE original VUEJS
///BELOW CONVERTING TO ANGULAR -- below still doesn't work yet



var branches = angular.module('branches', ['ngRoute'])
branches.component('header', {
    template: require('../components/header.html'),
    controller: function HeaderController() {
        this.login = login;
    }
})

branches.config(function($routeProvider){
    $routeProvider.when('/', {
        template: '<header></header>'
    })
})
