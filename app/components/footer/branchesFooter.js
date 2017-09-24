import {Config} from '../../core/config'
import {login} from '../../core/login'
import user from '../../objects/user'
import Users from '../../objects/users'
import {mapGetters} from 'vuex'

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


        PubSub.subscribe('userId', () => {
            //TODO: get user object through a Vuex or Redux store. rather than calling Users.get every time
            Users.get(user.getId()).then(user => {
                //if (!user) return;
                self.items = user.items
                self.user = user
            })
        })
        PubSub.subscribe('login', () => {
            self.loggedIn = true
            self.user = user
            self.username = user.fbData.displayName
            self.photoURL = user.fbData.photoURL
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
        ...mapGetters(['currentStudyingCategoryTreeId']),
        itemsMasteredPerMinute() {
            return this.numItemsMastered / (this.secondsSpentStudying * 60)
        },
        numItemsStudied() {
            return Object.keys(this.items).length
        },
        //not a useful metric imo
        numItemsMastered() {
            var itemsKeys = Object.keys(this.items)
            var numMastered = itemsKeys.reduce((sum, key) => {
                if (this.items[key].proficiency >= 96) {
                    sum++
                }
                return sum

            }, 0)
            return numMastered
        },
        reviewId() {

        },
    },
    watch: {
        currentStudyingCategoryTreeId(newId, oldId){
            console.log('now studying ', newId)
            // const Tree = Trees.get(newId)
        }
    },
    methods: {
        login () {
            this.loggedIn=true
            login()
        },
        goToExerciseCreator () {
            window.exerciseToReplaceId = null
            PubSub.publish('goToState.exerciseCreator')
        },
        goToReviewTree () {
            PubSub.publish('goToState.reviewTree')
        },
        toggleSettingsMenu(){
            this.$store.commit('toggleSettingsMenu')
        }
    }
}
