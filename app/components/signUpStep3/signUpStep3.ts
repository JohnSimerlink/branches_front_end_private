import {PATHS} from '../paths';

const env = process.env.NODE_ENV || 'development';
let template;

if (env === 'test') {
	let register = require('ignore-styles').default || require('ignore-styles');
	register(['.html, .less']);
} else {
	let style = require('./signUpStep3.less').default || require('./signUpStep3.less');
	template = require('./signUpStep3.html').default || require('./signUpStep3.html');
}
// tslint:disable-next-line no-var-requires
export default {
	template, // '<div> {{movie}} this is the tree template</div>',
	data() {
		return {
			signUpMode: true
		}
	},
	mounted() {
		this.$refs.refresh.focus();
	},
	methods: {
		refresh() {
			this.$router.push(PATHS.STUDY)
			window.location = window.location // then refresh the page to remove bug
		}
	}
};
