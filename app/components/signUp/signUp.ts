import {log} from '../../core/log'
import {MUTATION_NAMES} from '../../core/store';
const env = process.env.NODE_ENV || 'development';
let template;
if (env === 'test') {
    let register = require('ignore-styles').default;
    if (!register) {
        register = require('ignore-styles')
    }
    register(['.html, .less'])
} else {
    let style = require('./signUp.less').default;
    if (!style) {
        style = require('./signUp.less')
    }
    template = require('./signUp.html').default;
    if (!template) {
        template = require('./signUp.html')
    }
}
// tslint:disable-next-line no-var-requires
export default {
    template, // '<div> {{movie}} this is the tree template</div>',
    data() {
        return {
        }
    },
    computed: {
        loggedIn() {
            return this.$store.getters.loggedIn
        }
    },
    // TODO: loggedIn getter
    methods: {
        loginWithFacebook() {
            this.$store.commit(MUTATION_NAMES.LOGIN_WITH_FACEBOOK)
        }
    }
}
