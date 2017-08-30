import './exercise-creator.less'
export default {
    template: require('./exerciseCreator.html'),
    created () {
        var me = this;
    },
    data () {
        return {
        }
    },
    computed : {
    },
    methods: {
        goToHome() {
            PubSub.publish('goToState.home')
        }
    }
}