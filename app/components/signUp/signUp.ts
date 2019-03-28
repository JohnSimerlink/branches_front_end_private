import {log} from '../../core/log';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {
	ICreateUserWithEmailMutationArgs,
	ILoginWithEmailMutationArgs,
	IState
} from '../../objects/interfaces';

const env = process.env.NODE_ENV || 'development';
let template;

if (env === 'test') {
	let register = require('ignore-styles').default || require('ignore-styles');
	register(['.html, .less']);
} else {
	let style = require('./signUp.less').default || require('./signUp.less');
	template = require('./signUp.html').default || require('./signUp.html');
}
// tslint:disable-next-line no-var-requires
export default {
	template, // '<div> {{movie}} this is the tree template</div>',
	computed: {
		loggedIn() {
			return this.$store.getters.loggedIn;
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
		loginWithFacebook() {
			this.$store.commit(MUTATION_NAMES.LOGIN_WITH_FACEBOOK);
		},
		loginWithEmail() {
			console.log("log in with email called vue")
			const email = this.$refs.email.value
			const password = this.$refs.password.value
			const mutationArgs: ILoginWithEmailMutationArgs = {email, password}
			this.$store.commit(MUTATION_NAMES.LOGIN_WITH_EMAIL, mutationArgs);
		},
		createUserWithEmail() {
			console.log("create with email called vue")
			const email = this.$refs.emailCreate.value
			const password = this.$refs.passwordCreate.value
			const passwordConfirm = this.$refs.passwordCreateConfirm.value
			if (password !== passwordConfirm) {
				return this.showPasswordError()
			}
			const mutationArgs: ICreateUserWithEmailMutationArgs = {email, password}
			this.$store.commit(MUTATION_NAMES.CREATE_USER_WITH_EMAIL, mutationArgs);
		},
		showPasswordError() {
			this.signUpWithEmailErrorMessage()
		},
		removePasswordError(){

		}

	}
};
