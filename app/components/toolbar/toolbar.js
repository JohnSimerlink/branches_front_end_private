import PubSub from 'pubsub-js'
//temporary hacky solution for controller
export default {
    template: require('./toolbar.html'),
    created () {
    },
    data () {
        return {}
    },
    methods: {
        activateLasso () {
            lasso.activate()
        },
        deactivateLasso () {
            lasso.deactivate()
        }
    }
}
