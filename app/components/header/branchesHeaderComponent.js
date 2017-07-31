import {newTree} from '../../objects/newTree.js'
import {Config} from '../../core/config'
import {login} from '../../core/login'
//temporary hacky solution for controller
export default {
    template: require('./branches-header.html'),
    data () {
        return {
            version: Config.version,
            username: '',
            loggedIn: false
        }
    },
    methods: {
        login () {
            this.loggedIn=true
            login()
        }
    }
}
