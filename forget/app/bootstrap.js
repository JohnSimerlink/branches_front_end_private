import {log} from '../../app/core/log'
import Vue from 'vue'
import forgettingCalculator from './components/forgettingCalculator/forgettingCalculator'
import {truncateToHundredths, times100} from "./components/forgettingCalculator/forgettingCalculator";

Vue.component('forgettingCalculator', forgettingCalculator)

Vue.filter('truncateToHundredths', truncateToHundredths)
Vue.filter('times100', times100)
const vm = new Vue({
    el: '#forgetting-calculator',
    created() {
        log('forgettingCalculator created')
    },
})
