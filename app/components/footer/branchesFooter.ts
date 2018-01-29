// import {Config} from '../../core/config'
// import {login} from '../../core/login'
// import {user} from '../../objects/user'
// import Users from '../../objects/users'
// import {mapGetters} from 'vuex'
// import {Trees} from "../../objects/trees";
// import ContentItems from "../../objects/contentItems";
import {log} from '../../core/log'

const env = process.env.NODE_ENV || 'development'
if (env === 'test') {
    const register = require('ignore-styles')
    log('configure is ', register)
    register(['.html'])
}
// tslint:disable-next-line no-var-requires
const template = require('./branches-footer.html').default
export default {
    template,
    created() {
        // const self = this
        // self.loggedIn = false
        // self.user = {}
        // self.username = ''
        // self.numItemsMastered = 0
        // self.secondsSpentStudying = 1 // init to 1, not 0 to prevent divBy0 Error
        // this.items = {}
        //
        //
        // PubSub.subscribe('userId', () => {
        //     //TODO: get user object through a Vuex or Redux stores. rather than calling Users.get every time
        //     Users.get(user.get()).then(user => {
        //         //if (!user) return;
        //         self.items = user.items
        //         self.user = user
        //     })
        // })
        // PubSub.subscribe('login', () => {
        //     self.loggedIn = true
        //     self.user = user
        //     self.username = user.fbData.displayName
        //     self.photoURL = user.fbData.photoURL
        // })
    },
    data() {
        return {
            // version: Config.version,
            user: this.user,
            loggedIn: this.loggedIn,
            username: this.username,
            photoURL: this.photoURL,
            items: this.items
        }
    },
    computed: {
        // ...mapGetters(['currentStudyingCategoryTreeId']),
        // itemsMasteredPerMinute() {
        //     return this.numItemsMastered / (this.secondsSpentStudying * 60)
        // },
        // numItemsStudied() {
        //     return Object.keys(this.items).length
        // },
        // //not a useful metric imo
        // numItemsMastered() {
        //     var itemsKeys = Object.keys(this.items)
        //     var numMastered = itemsKeys.reduce((sum, key) => {
        //         if (this.items[key].proficiency >= 96) {
        //             sum++
        //         }
        //         return sum
        //
        //     }, 0)
        //     return numMastered
        // },
        // reviewId() {
        //
        // },
        // treeId (){
        //     const id = this.$store.state.currentStudyingCategoryTreeId
        //     return id
        //     // return this.$stores.state.currentStudyingCategoryTreeId
        // },
        // studying(){
        //     // return true
        //     return this.$store.getters.studying
        // }
    },

    // asyncComputed: {
    //     async numOverdue(){
    //         const tree = await Trees.get(this.treeId)
    //         return tree.numOverdue
    //     },
    //     async title(){
    //         const tree = await Trees.get(this.treeId)
    //         const item = await ContentItems.get(tree.contentId)
    //         return item.getLastNBreadcrumbsString(4)
    //         // return item.title
    //     },
    // },

    // watch: {
    //     currentStudyingCategoryTreeId(newId, oldId){
    //         console.log('now studying ', newId)
    //         // const Tree = Trees.get(newId)
    //     }
    // },
    methods: {
        // login () {
        //     this.loggedIn=true
        //     login()
        // },
        // goToExerciseCreator () {
        //     window.exerciseToReplaceId = null
        //     PubSub.publish('goToState.exerciseCreator')
        // },
        // goToReviewTree () {
        //     PubSub.publish('goToState.reviewTree')
        // },
        // toggleSettingsMenu(){
        //     this.$store.commit('toggleSettingsMenu')
        // },
        // toggleStudying(){
        //     if (this.$store.getters.studying){
        //         this.$store.commit('enterExploringMode')
        //     } else {
        //         this.$store.commit('enterStudyingMode')
        //     }
        // }
    }
}
