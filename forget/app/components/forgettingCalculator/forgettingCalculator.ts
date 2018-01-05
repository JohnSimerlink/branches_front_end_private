// tslint:disable object-literal-sort-keys
import {log} from '../../../../app/core/log'
export default {
    template: require('./forgettingCalculator.html'),
    data() {
        return {
            years: 0,
            months: 0,
            weeks: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            decibels: 0,
        }
    },
    async created() {
        log('forgettingcalculator componetn created')
    },
    computed: {
    },
    methods: {
    },
}
