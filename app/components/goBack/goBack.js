import './goBack.less'

export default {
    template: require('./goBack.html'),
    methods: {
        goBack() {
            this.$router.go(-1)
            // PubSub.publish('goToState.home')
        }
    }
}
