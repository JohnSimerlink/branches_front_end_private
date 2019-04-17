import {Bus} from '../../../other_imports/vue-stripe';
import {
	IHash,
	ISetMembershipExpirationDateArgs
} from '../../objects/interfaces';
import axios
	from 'axios';
import './branches-stripe.less';
import {log} from '../../core/log';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import { request } from 'graphql-request'
import moment = require('moment');
import {PATHS} from '../paths';
import {cents} from './memberships';
import {PACKAGE_NAMES} from '../packageNames';
const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
	const register = require('ignore-styles').default || require('ignore-styles');
	register(['.html', '.less']);
}
const TEST_PUBLISHABLE_KEY='pk_test_5ohxWhILJDRRiruf88n3Tnzw'
const LIVE_PUBLISHABLE_KEY='pk_live_TB07uwuUxDQZdD2M77YiRy1O'

const template = require('./branches-stripe.html').default || require('./branches-stripe.html');
export interface IPackage {
	amount: cents;
	name: string;
	description: string;
}
const packages: IHash<IPackage> = {
	[PACKAGE_NAMES.MONTHLY]: {
		amount: 199,
		name: 'Branches Monthly Subscription',
		description: 'Branches Monthly Subscription - 513-787-0992'
	},
	[PACKAGE_NAMES.WEEKLY]: {
		amount: 99,
		name: 'Branches Weekly Subscription',
		description: 'Branches Weekly Subscription - 513-787-0992'
	},
	[PACKAGE_NAMES.YEARLY]: {
		amount: 1188,
		name: 'Branches YEARLY Subscription',
		description: 'Branches Yearly Subscription - 513-787-0992'
	},
}
export function getPackageDetails(packageName: PACKAGE_NAMES): IPackage {
	return packages[packageName]
}
export default {
	template,
	props: ['membershipSelection'],
	watch: {
		membershipSelection(newm, oldm) {
			console.log('branchse stripe watch membership selection', newm, oldm)
		}
	},
	created() {
		const me = this;
		console.log("branchse stripe created. membershipSElection is", this.membershipSelection)
		me.stripekey = TEST_PUBLISHABLE_KEY;
		me.subscription = getPackageDetails(this.membershipSelection);
		me.email = this.$store.getters.email
		console.log("branches stripe email is ", me.email)
		;(window as any).$store = this.$store
		// {
		// 	name: 'Branches One Month Purchase',
		// 	description: 'Non-Recurring Purchase to Buy One Month of Branches Membership',
		// 	amount: 399 // $3.99 in cents
		// };
		Bus.$on('vue-stripe.success', async payload => {
			try {
				// const uri = 'https://' + window.location.hostname + '/api/';
				// const uri = 'https://' + 'localhost:8120' + '/api/';
				const userId = this.$store.getters.userId;
				const newPayload = new URLSearchParams();
				newPayload.append('stripeEmail', payload.email);
				newPayload.append('userId', userId);
				newPayload.append('stripeToken', payload.token);
				// const serverResultPromise = await axios.post(uri, newPayload);

				const mutation = `
				mutation PurchaseSubscription{
					purchaseSubscription(purchaseType: ${this.membershipSelection}, userId: "${userId}", email: "${payload.email}", paymentToken: "${payload.token}") {
						message
						rprop
						stripeCustomerId
						stripeSubscriptionId
					}
				}`;
				//
				// const query = `{
				// 	Movie(title: "Inception") {
				// 		releaseDate
				// 		actors {
				// 			name
				// 		}
				// 	}
				// }`

				// TODO CHANGE THIS TO HTTPS
				// TODO CHANGE THIS TO HTTPS
				// TODO CHANGE THIS TO HTTPS
				// TODO CHANGE THIS TO HTTPS
				// TODO CHANGE THIS TO HTTPS

				const prefix = process.env.NODE_ENV === 'dev' ? 'http' : 'https'; // 2
				request(`${prefix}://` + window.location.hostname + '/api/graphiql', mutation).then((data: any) => {

					console.log('branches stripe', data, JSON.parse(data.purchaseSubscription.message));
					const parsed = JSON.parse(data.purchaseSubscription.message)
					const endDateInMilliseconds = parsed.current_period_end * 1000 // to convert into milliseconds
					// console.log("end is ", end)
					// console.log("end is ", moment(end).format('YYYY-MMM-DD'))

					// const now = Date.now();
					// const thirtyDaysFromNow = now + 1000 * 60 * 60 * 24 * 30;
					const mutationArgs: ISetMembershipExpirationDateArgs = {
						membershipExpirationDate: endDateInMilliseconds,
						userId: this.$store.state.userId
					};
					this.$store.commit(MUTATION_NAMES.SET_MEMBERSHIP_EXPIRATION_DATE, mutationArgs);

					this.$router.push(PATHS.SIGNUP_3)


				})


				// request('http://localhost:4000/api/graphiql', mutation).then(data => {
				//
				// 	console.log('branches stripe', data);
				// })

				/* TODO: don't even use this system -
				     rather every once in a while query stripe to see if subscription is still valid,
				      and if not, change a flag in our database */
				// const serverResult = await serverResultPromise;
				// */
			} catch (error) {
				error('request to server FAILED!!!!', error);
				// TODO: I think this still allows for a user's membership to be added even if the request fails
			}
		});
		Bus.$on('vue-stripe.error', payload => {
			log('Error: ', payload);
		});
	},
	data() {
		return {
			stripekey: this.stripekey,
			email: this.email
		};
	},
	computed: {
		subscription() {
			const sub = getPackageDetails(this.membershipSelection)
			console.log("subsription recalculated", sub, this.membershipSelection)
			return sub
		},
		email() {
			return this.$store.getters.email
		}
	}
};
