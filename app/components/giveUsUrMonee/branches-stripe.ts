import {mapGetters} from 'vuex'
import { Bus } from 'vue-stripe';
import {MUTATION_NAMES} from '../../core/store';
import {ISetMembershipExpirationDateArgs} from '../../objects/interfaces';
let axios = require('axios').default || require('axios')

const env = process.env.NODE_ENV || 'development'
if (env === 'test') {
    let register = require('ignore-styles').default || require('ignore-styles')
    register(['.html', '.less'])
}
let template = require('./branches-stripe.html').default || require('./branches-stripe.html')
import './branches-stripe.less'
export default {
    template,
    created() {
        const me = this;
        me.stripekey = 'pk_live_TB07uwuUxDQZdD2M77YiRy1O';
        me.subscription = {
            name: 'Branches One Month Purchase',
            description: 'Non-Recurring Purchase to Buy One Month of Branches Membership',
            amount: 199 // $19.99 in cents
        }
        Bus.$on('vue-stripe.success', async payload => {
            try {
                console.log('Success: ', payload);
                const uri = 'https://' + window.location.hostname + '/api/'
                const newPayload = new URLSearchParams()
                newPayload.append('stripeEmail', payload.email)
                newPayload.append('stripeToken', payload.token)
                console.log('the server payload is ', newPayload)
                const serverResultPromise =
                    await axios.post(uri, newPayload)

                console.log('serverResultPromise is', serverResultPromise)
                const serverResult = await serverResultPromise
                console.log('serverResult is', serverResult)
                console.log("request to server successful!")
                const now = Date.now()
                const thirtyDaysFromNow = now + 1000 * 60 * 60 * 24 * 30
                const mutationArgs: ISetMembershipExpirationDateArgs = {
                    membershipExpirationDate: thirtyDaysFromNow,
                    userId: this.$store.state.userId
                }
                this.$store.commit(MUTATION_NAMES.SET_MEMBERSHIP_EXPIRATION_DATE, mutationArgs)
            } catch (error) {
                console.error("request to server FAILED!!!!", error)
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
