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
    template = require('./mapChooser.html').default
    require('./mapChooser.less')
}
// tslint:disable-next-line no-var-requires
export default {
    template, // '<div> {{movie}} this is the tree template</div>',
    data() {
        return {
            globalSelected: true,
            localSelected: false
        }
    },
    methods: {
        selectGlobal() {
            this.globalSelected = true
        },
        selectLocal() {
            this.localSelected = true
        },
    },
}
