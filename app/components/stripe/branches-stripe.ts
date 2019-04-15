import {Bus} from 'vue-stripe';
import {ISetMembershipExpirationDateArgs} from '../../objects/interfaces';
import axios
	from 'axios';
import './branches-stripe.less';
import {log} from '../../core/log';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import { request } from 'graphql-request'
const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
	const register = require('ignore-styles').default || require('ignore-styles');
	register(['.html', '.less']);
}
const TEST_PUBLISHABLE_KEY='pk_test_5ohxWhILJDRRiruf88n3Tnzw'
const LIVE_PUBLISHABLE_KEY='pk_test_5ohxWhILJDRRiruf88n3Tnzw'

const template = require('./branches-stripe.html').default || require('./branches-stripe.html');

export default {
	template,
	props: ['membershipSelection'],
	created() {
		const me = this;
		me.stripekey = TEST_PUBLISHABLE_KEY;
		me.subscription = {
			name: 'Branches One Month Purchase',
			description: 'Non-Recurring Purchase to Buy One Month of Branches Membership',
			amount: 399 // $3.99 in cents
		};
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
					purchaseSubscription(purchaseType: MONTHLY_SUBSCRIPTION, userId: "${userId}") {
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

				request('http://' + window.location.hostname + '/api/graphiql', mutation).then(data => {

					console.log('branches stripe', data);
				})


				// request('http://localhost:4000/api/graphiql', mutation).then(data => {
				//
				// 	console.log('branches stripe', data);
				// })

				/* TODO: don't even use this system -
				     rather every once in a while query stripe to see if subscription is still valid,
				      and if not, change a flag in our database */
				// const serverResult = await serverResultPromise;
				const now = Date.now();
				const thirtyDaysFromNow = now + 1000 * 60 * 60 * 24 * 30;
				const mutationArgs: ISetMembershipExpirationDateArgs = {
					membershipExpirationDate: thirtyDaysFromNow,
					userId: this.$store.state.userId
				};
				this.$store.commit(MUTATION_NAMES.SET_MEMBERSHIP_EXPIRATION_DATE, mutationArgs);
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
			stripekey: this.stripekey
		};
	},
};
