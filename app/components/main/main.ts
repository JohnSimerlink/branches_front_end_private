import './main.less'
import {log} from '../../core/log'
const env = process.env.NODE_ENV || 'development'
if (env === 'test') {
    let register = require('ignore-styles').default
    if (!register) {
        register = require('ignore-styles')
    }
    register(['.html'])
}
// tslint:disable-next-line no-var-requires
const template = require('./main.html').default
export default {
    template, // '<div> {{movie}} this is the tree template</div>',
    props: [],
    async created() {
    },
    computed: {
        userDataString() {
            log ('userDataString computed called')
            const userDataString = this.$store.getters.userData(this.$store.getters.userId)
            return userDataString
        },
        sample() {
            return this.$store.getters.sampleGetter(4)
        },
        userHasAccess() {
            const has: boolean = this.$store.getters.userHasAccess(this.$store.getters.userId)
            log('has is ', has) // << should actually be a promise
            return has
        }
    },
    asyncComputed: {
        hasAccess() {
            const has: boolean = this.$store.getters.userHasAccess(this.$store.state.userId)
            log('has is ', has) // << should actually be a promise
            return has

        },
        sampleAsync() {
            return this.$store.getters.sampleAsyncGetter(6)
        }
    },
    data() {
        return {
            userId: this.$store.state.userId
            // studySettings: defaultStudySettings
        }
    },
}
