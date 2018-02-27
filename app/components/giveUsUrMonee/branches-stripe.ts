import {mapGetters} from 'vuex'
import { Bus } from 'vue-stripe';
import './branches-stripe.less'
import {MUTATION_NAMES} from '../../core/store';
import {ISetMembershipExpirationDateArgs} from '../../objects/interfaces';
// let request = require('request-promise').default
// if (!request) {
//     request = require('request-promise')
// }
let axios = require('axios').default || require('axios')
// import request from 'request-promise'
// const request = require('request')

let template = require('./branches-stripe.html').default
if (!template) {
    template = require('./branches-stripe.html')
}
export default {
    template,
    created() {
        const me = this;
        // me.loggedIn = false;
            // me.user = {};
                // me.username = '';
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

                //     request({
                //     method: 'POST',
                //     uri,
                //     body: payload,
                //     json: true,
                // })
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
