import {newTree} from '../../objects/newTree.js'
import {Config} from '../../core/config'
import {login} from '../../core/login'
import user from '../../objects/user'
import Users from '../../objects/users'
import PubSub from 'pubsub-js'
//temporary hacky solution for controller
export default {
    template: require('./branches-header.html'),
    created () {
        const self = this
        self.loggedIn = false
        self.user = {}
        self.username = ''
        // self.numItemsStudied = 0
        self.numItemsMastered = 0
        self.secondsSpentStudying = 1
        this.items = {}

        PubSub.subscribe('login', () => {
            console.log('login detected inside branchesheader')
            self.loggedIn = true
            self.user = user
            self.username = user.fbData.displayName
            Users.get(user.getId()).then(user => {
                self.items = user.items
                console.log('user received in branchesheader component is', user, user.items, user.items.length)
                self.user = user
                // self.numItemsStudied = user.items.length
                // console.log('numItems studied is', self.numItemsStudied)
                // console.log('user inside of branchesheader component is ', user, user.branchesData.items.length)
                // self.numItemsStudied = self.user.branchesData.items.length
            })
            // console.log('branches header loggedIn is now', self.loggedIn)
        })
    },
    data () {
        return {
            version: Config.version,
            user: this.user,
            loggedIn: this.loggedIn,
            username: this.username,
            items: this.items
            // numItemsStudied: this.numItemsStudied
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
                console.log('items mastered reduce being called',sum)
                return sum

            }, 0)
            return numMastered
        }
    },

    methods: {
        login () {
            this.loggedIn=true
            login()
        }
    }
}
