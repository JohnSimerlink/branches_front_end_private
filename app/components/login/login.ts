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
	let style = require('./login.less').default || require('./login.less');
	template = require('./login.html').default || require('./login.html');
}

export default {
	template,
	computed: {
		loginWithEmailErrorMessage() {
			const state: IState = this.$store.state
			return state.loginWithEmailErrorMessage
		}
	},
	methods: {
		loginWithFacebook() {
			this.$store.commit(MUTATION_NAMES.LOGIN_WITH_FACEBOOK);
		},
		loginWithEmail() {
			console.log("log in with email called vue")
			const email = this.$refs.email.value
			const password = this.$refs.password.value
			const mutationArgs: ILoginWithEmailMutationArgs = {
				email,
				password
			}
			this.$store.commit(MUTATION_NAMES.LOGIN_WITH_EMAIL, mutationArgs);
		},
	}
}
