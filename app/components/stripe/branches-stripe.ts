import {mapGetters} from 'vuex'
import { Bus } from 'vue-stripe';
import {MUTATION_NAMES} from '../../core/store';
import {ISetMembershipExpirationDateArgs} from '../../objects/interfaces';
import axios from 'axios';
import './branches-stripe.less'

const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
    const register = require('ignore-styles').default || require('ignore-styles');
    register(['.html', '.less'])
}
const template = require('./branches-stripe.html');

export default {
    template,
    created() {
        const me = this;
        me.stripekey = 'pk_live_TB07uwuUxDQZdD2M77YiRy1O';
        me.subscription = {
            name: 'Branches One Month Purchase',
            description: 'Non-Recurring Purchase to Buy One Month of Branches Membership',
            amount: 399 // $3.99 in cents
        };
        Bus.$on('vue-stripe.success', async payload => {
            try {
                const uri = 'https://' + window.location.hostname + '/api/';
                const newPayload = new URLSearchParams();
                newPayload.append('stripeEmail', payload.email);
                newPayload.append('stripeToken', payload.token);
                const serverResultPromise = await axios.post(uri, newPayload);
                const serverResult = await serverResultPromise;
                const now = Date.now();
                const thirtyDaysFromNow = now + 1000 * 60 * 60 * 24 * 30;
                const mutationArgs: ISetMembershipExpirationDateArgs = {
                    membershipExpirationDate: thirtyDaysFromNow,
                    userId: this.$store.state.userId
                };
                this.$store.commit(MUTATION_NAMES.SET_MEMBERSHIP_EXPIRATION_DATE, mutationArgs)
            } catch (error) {
                console.error('request to server FAILED!!!!', error);
                // TODO: I think this still allows for a user's membership to be added even if the request fails
            }
        });
        Bus.$on('vue-stripe.error', payload => {
            console.log('Error: ', payload);
        });
    },
    data() {
        return {
            stripekey: this.stripekey
        }
    },
}
