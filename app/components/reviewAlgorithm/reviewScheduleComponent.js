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
        PubSub.subscribe('login',() => {


            self.loggedIn = true

            // console.log('Review schedule component: login detected')
            // Users.get(user.getId()).then(user => {
            //     console.log('review schedule component on login detect: on user get', user)
            //     self.itemReviewTimeMap = user.branchesData.itemReviewTimeMap
            // })
            console.log('review schedule component on login detect: user object is', user)
        })
        this.num = 5
    },
    data () {
        return {
            // itemReviewTimeMap: this.itemReviewTimeMap,
            // numItemsToReview: this.itemReviewTimeMap.length,
            num: 5,
            loggedIn: this.loggedIn
        }
    }
}

