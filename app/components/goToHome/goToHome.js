import './goToHome.less'

export default {
    template: require('./goToHome.html'),
    methods: {
        goToHome() {
            PubSub.publish('goToState.home')
        }
    }
}
