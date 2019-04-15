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
	let style = require('./createAccount.less').default || require('./createAccount.less');
	template = require('./createAccount.html').default || require('./createAccount.html');
}
// tslint:disable-next-line no-var-requires
export default {
	template, // '<div> {{movie}} this is the tree template</div>',
	data() {
		return {
			signUpMode: true,
			promptUserToCheck: false,
			checkboxValue: true
		}
	},
	computed: {
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
		receiveCheckboxValue(arg1, arg2, arg3) {
			console.log("createAccount.ts receiveCheckboxValue called", arg1, arg2, arg3)

		},
		createUserWithEmail() {
			if (!this.checkTermsConfirmation())	{
				return
			}
			console.log("create with email called vue")
			const email = this.$refs.emailCreate.value
			const password = this.$refs.passwordCreate.value
			const passwordConfirm = this.$refs.passwordCreateConfirm.value
			if (password !== passwordConfirm) {
				return this.showPasswordError()
			}
			const mutationArgs: ICreateUserWithEmailMutationArgs = {
				email,
				password
			}
			this.$store.commit(MUTATION_NAMES.CREATE_USER_WITH_EMAIL, mutationArgs);
		},
		showPasswordError() {
			this.signUpWithEmailErrorMessage()
		},
		removePasswordError() {

		},
		createAccountViaFacebook() {
			if (!this.checkTermsConfirmation())	{
				return
			}
			this.$store.commit(MUTATION_NAMES.LOGIN_WITH_FACEBOOK);
			// this.$router.push('/auth/signup/2')
		},
		checkTermsConfirmation() {
			if (!this.checkboxValue) {
				this.promptUserToCheck = true
				setTimeout(() => {
					this.promptUserToCheck = false
				}, 500);
				return false
			}
			return true
			// this.$refs.checkbox.value

		}

	}
};
