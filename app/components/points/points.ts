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
    template, // '<div> {{movie}} this is the tree template</div>',
    props: [],
    async created() {
    },
    data() {
        return {
            name: 'Tai',
        }
    },
    methods: {
    },
    computed: {
        points() {
            const userId = this.$store.getters.userId
            return this.$store.getters.userPoints(userId)
        }
    }
}
