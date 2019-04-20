import {PATHS} from '../paths';
import {
	ISetMembershipExpirationDateArgs,
	timestamp
} from '../../objects/interfaces';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';

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
			this.refreshWhenNoPaywall()
			window.location = window.location // refresh the page to remove bug where first node does not show up
		},
		refreshWhenNoPaywall() {
			const TEN_YEARS_INTO_THE_FUTURE: timestamp = 10 * 365 * 24 * 60 * 60 * 1000 + Date.now()
			const setMembershipExpirationDateArgs: ISetMembershipExpirationDateArgs = {
				membershipExpirationDate: TEN_YEARS_INTO_THE_FUTURE,
				userId: this.$store.getters.userId
			}
			this.$store.commit(MUTATION_NAMES.SET_MEMBERSHIP_EXPIRATION_DATE, setMembershipExpirationDateArgs)
			window.location = window.location

		},
		refreshWhenPaywall() {
			this.$router.push(PATHS.STUDY)

		}
	}
};
