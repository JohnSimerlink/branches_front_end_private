import {log} from '../../core/log'
const env = process.env.NODE_ENV || 'development'
let template = ''
if (env === 'test') {
    let register = require('ignore-styles').default
    if (!register) {
        register = require('ignore-styles')
    }
    register(['.html'])
} else {
    template = require('./points.html').default
    require('./points.less')
}
// tslint:disable-next-line no-var-requires
export default {
    props: [],
    async created() {
    },
    computed: {
        points() {
            const userId = this.$store.getters.userId
            return this.$store.getters.userPoints(userId)
        }
    }
}
