import App from './App.vue'
import VueFire from 'vuefire'
import Vue from 'vue'
import './components'
import './objects'
import './utils'
import angular from 'angular'

Vue.use(VueFire)

angular.element(document.querySelector('#bootstrap2')).ready( () => {
    angular.bootstrap(document, ['app'], {
        strictDi: true
    });
});
new Vue({el: '#bootstrap', render: h => h(App) })
