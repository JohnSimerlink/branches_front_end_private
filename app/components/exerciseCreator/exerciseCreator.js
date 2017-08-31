import './exercise-creator.less'
export default {
    template: require('./exerciseCreator.html'),
    created () {
        var me = this;
    },
    methods: {
        goToHome() {
            PubSub.publish('goToState.home')
        }
    }
}