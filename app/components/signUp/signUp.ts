import './signUp.less'
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
const template = require('./signUp.html').default
export default {
    template, // '<div> {{movie}} this is the tree template</div>',
    data() {
        return {
        }
    },
}
