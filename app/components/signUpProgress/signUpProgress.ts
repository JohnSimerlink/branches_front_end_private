import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {
	ICreateUserWithEmailMutationArgs,
	ILoginWithEmailMutationArgs,
	IState
} from '../../objects/interfaces';
import {PATHS} from '../paths';

const env = process.env.NODE_ENV || 'development';
let template;

if (env === 'test') {
	let register = require('ignore-styles').default || require('ignore-styles');
	register(['.html, .less']);
} else {
	let style = require('./signUpProgress.less').default || require('./signUpProgress.less');
	template = require('./signUpProgress.html').default || require('./signUpProgress.html');
}
// tslint:disable-next-line no-var-requires
export default {
	created() {

		console.log("signupProgress created. currentRoute is ", this.$route)
	},
	template, // '<div> {{movie}} this is the tree template</div>',
	data() {
		return {
			signUpMode: true
		}
	},
	computed: {
		step1Active() {
			return this.$route.path === PATHS.SIGNUP_1;
		},
		step2Active() {
			return this.$route.path === PATHS.SIGNUP_2;
		},
		step3Active() {
			return this.$route.path === PATHS.SIGNUP_3;
		},
		loggedIn() {
			return this.$store.getters.loggedIn;
		},
		hasAccess() {
			return false;
			// return await this.$store.getters.hasAccess;
		},
		signUpWithEmailErrorMessage() {
			const state: IState = this.$store.state
			return state.signUpWithEmailErrorMessage
		},
		loginWithEmailErrorMessage() {
			const state: IState = this.$store.state
			return state.loginWithEmailErrorMessage
		}
	},
	// TODO: loggedIn getter
	methods: {
		// createUserWithEmail() {
		// 	console.log("create with email called vue")
		// 	const email = this.$refs.emailCreate.value
		// 	const password = this.$refs.passwordCreate.value
		// 	const passwordConfirm = this.$refs.passwordCreateConfirm.value
		// 	if (password !== passwordConfirm) {
		// 		return this.showPasswordError()
		// 	}
		// 	const mutationArgs: ICreateUserWithEmailMutationArgs = {
		// 		email,
		// 		password
		// 	}
		// 	this.$store.commit(MUTATION_NAMES.CREATE_USER_WITH_EMAIL, mutationArgs);
		// },
		// showPasswordError() {
		// 	this.signUpWithEmailErrorMessage()
		// },
		// removePasswordError() {
		//
		// },
		// loginWithFacebook() {
		// 	this.$store.commit(MUTATION_NAMES.LOGIN_WITH_FACEBOOK);
		// }

	}
};
