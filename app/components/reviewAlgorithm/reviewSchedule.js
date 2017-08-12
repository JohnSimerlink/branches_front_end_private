import branchuser from '../../objects/user'
import Users from '../../objects/users'
import user from '../../objects/user'
import PubSub from 'pubsub-js'
export default {
    template: require('./reviewSchedule.html'), // '<div> {{movie}} this is the tree template</div>',
    created () {
        var self = this;

        this.loggedIn = false
        this.user = {}
        this.itemReviewTimeMap = {}
        this.content = {}
        this.items = {}
        PubSub.subscribe('login',() => {
            self.loggedIn = true
            Users.get(user.getId()).then( user => {
                self.items = user.items
            })
        })
        this.num = 5
    },
    data () {
        return {
            num: 5,
            loggedIn: this.loggedIn,
            items: this.items
        }
    },
    computed : {
        numItemsToReview() {
            return Object.keys(this.items).length
        }
    }
}

