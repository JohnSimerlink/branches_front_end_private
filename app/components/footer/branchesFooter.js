import {newTree} from '../../objects/newTree.js'
import {Config} from '../../core/config'
import {login} from '../../core/login'
import user from '../../objects/user'
import Users from '../../objects/users'

export default {
    template: require('./branches-footer.html'),
    created () {
        const self = this
        self.loggedIn = false
        self.user = {}
        self.username = ''
        self.numItemsMastered = 0
        self.secondsSpentStudying = 1 // init to 1, not 0 to prevent divBy0 Error
        this.items = {}


        PubSub.subscribe('login', () => {
            self.loggedIn = true
            self.user = user
            self.username = user.fbData.displayName
            self.photoURL = user.fbData.photoURL
            //TODO: get user object through a Vuex or Redux store. rather than calling Users.get every time
            Users.get(user.getId()).then(user => {
                self.items = user.items
                self.user = user
            })
        })
    },
    data () {
        return {
            version: Config.version,
            user: this.user,
            loggedIn: this.loggedIn,
            username: this.username,
            photoURL: this.photoURL,
            items: this.items
        }
    },
    computed: {
        itemsMasteredPerMinute() {
            return this.numItemsMastered / (this.secondsSpentStudying * 60)
        },
        numItemsStudied() {
            return Object.keys(this.items).length
        },
        numItemsMastered() {
            var itemsKeys = Object.keys(this.items)
            var numMastered = itemsKeys.reduce((sum, key) => {
                if (this.items[key].proficiency >= 96) {
                    sum++
                }
                return sum

            }, 0)
            return numMastered
        }
    },

    methods: {
        login () {
            this.loggedIn=true
            login()
        },
        goToExerciseCreator () {
            PubSub.publish('goToState.exerciseCreator')
        },
    }
}
