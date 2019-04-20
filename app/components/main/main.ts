import './main.less';
import {PATHS} from '../paths';

const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
	let register = require('ignore-styles').default || require('ignore-styles');
	register(['.html', '.less']);
}
// tslint:disable-next-line no-var-requires
const template = require('./main.html').default;
export default {
	template, // '<div> {{movie}} this is the tree template</div>',
	created() {
		console.log("main.ts created called")
	},
	watch: {
		loggedIn: {
			handler: function(newLoggedIn, oldLoggedIn) {
				console.log("main.ts loggedIn watcher called", newLoggedIn, oldLoggedIn)
				if (newLoggedIn) {
					if (this.hasAccess) {
						this.$router.push(PATHS.STUDY)
						// window.location = window.location // manually refresh page to get rid of initial node not showing bug upon account creation
					} else {
						this.$router.push(PATHS.SIGNUP_3)
					}
					// TODO: add check for if user had membership previously
				} else {
					console.log('main.ts loggedIn Handler newLoggedIn is false')
					if (this.browserHasLoggedInBefore) {
						console.log('main.ts loggedIn Handler newLoggedIn is false but browser has loggedin before')
						this.$router.push(PATHS.LOGIN)
					} else {
						console.log('main.ts loggedIn Handler newLoggedIn is false and browser has not loggedin before')
						this.$router.push(PATHS.SIGNUP_1)
					}
				}
			},
			deep: true
		},
	},
	computed: {
		browserHasLoggedInBefore() {
			return false
		},
		userDataString() {
			const userDataString = this.$store.getters.userData(this.$store.getters.userId);
			return userDataString;
		},
		sample() {
			return this.$store.getters.sampleGetter(4);
		},
		// userHasAccess() {
		// 	const has: boolean = this.$store.getters.userHasAccess(this.$store.getters.userId);
		// 	return has;
		// },
		loggedIn() {
			console.log("main ts loggedIn getter called", this.$store.getters.loggedIn)
			return this.$store.getters.loggedIn;
		},
		hasAccess() {
			const has: boolean = this.$store.getters.hasAccess;
			return has;
		},
		name() {
			if (!this.loggedIn) {
				return "Not Logged In"
			} else {
				return this.$store.getters.currentUserName;
			}
		}
	},
	asyncComputed: {
		sampleAsync() {
			return this.$store.getters.sampleAsyncGetter(6);
		}
	},
	data() {
		return {
			userId: this.$store.state.userId
			// studySettings: defaultStudySettings
		};
	},
	beforeMount() {
	}
};
