import {log} from '../../../app/core/log'
export default {
    props: [],
    template: require('./knawledgeMap.html'),
    async created() {
        log('kn created')
    },
    computed: {
    },
    watch: {
        $route: 'init',
    },
    methods: {
        init() {
            alert('hm init')
        }
    }
}
