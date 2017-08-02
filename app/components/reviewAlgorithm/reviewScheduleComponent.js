import branchuser from '../../objects/user'
import Users from '../../objects/users'
import PubSub from 'pubsub-js'
export default {
    template: require('./reviewSchedule.html'), // '<div> {{movie}} this is the tree template</div>',
    created () {
        var self = this;

        this.loggedIn = false
        this.user = {}
        this.itemReviewTimeMap = {}
        this.editing = false
        this.tree = {} // init to empty object until promises resolve, so vue does not complain
        this.fact = {}
        this.content = {}
        firebase.auth().onAuthStateChanged(function(user) {
            if (user){
                self.user = user;
                self.loggedIn = true
                console.log('ReviewSchedule COMPONENT: firebase auth state changed detected in reviewschedule component')
                console.log('branch user is', branchuser)
            }


        })
        PubSub.subscribe('login',() => {
            // console.log('Review schedule component: login detected')
            // Users.get(user.getId()).then(user => {
            //     self.itemReviewTimeMap = user.branchesData.itemReviewTimeMap
            // })
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

