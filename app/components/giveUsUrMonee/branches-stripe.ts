import {mapGetters} from 'vuex'
import { Bus } from 'vue-stripe';
import './branches-stripe.less'

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
        Bus.$on('vue-stripe.success', payload => {
            console.log('Success: ', payload);
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
