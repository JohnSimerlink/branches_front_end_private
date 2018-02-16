import {mapGetters} from 'vuex'
import { Bus } from 'vue-stripe';
import './branches-stripe.less'
import {MUTATION_NAMES} from '../../core/store2';
import {ISetMembershipExpirationDateArgs} from '../../objects/interfaces';
let request = require('request-promise').default
if (!request) {
    request = require('request-promise')
}
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
        me.stripekey = 'pk_test_5ohxWhILJDRRiruf88n3Tnzw';
        me.subscription = {
            name: 'Branches Subscription',
            description: 'Monthly Branches Subscription',
            amount: 199 // $19.99 in cents
        }
        Bus.$on('vue-stripe.success', async payload => {
            try {
                console.log('Success: ', payload);
                const serverResultPromise = request({
                    method: 'POST',
                    uri: '/api/',
                    body: payload
                })
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
