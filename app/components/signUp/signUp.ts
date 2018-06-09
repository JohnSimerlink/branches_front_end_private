import {log} from '../../core/log'
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';

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
		}
	},
	// TODO: loggedIn getter
	methods: {
		loginWithFacebook() {
			this.$store.commit(MUTATION_NAMES.LOGIN_WITH_FACEBOOK);
		}
	}
};
