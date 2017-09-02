import './exercise-creator.less'
export default {
    props: ['contentItemId'],
    template: require('./exerciseCreator.html'),
    created () {
        var me = this;
        console.log("creator just created!")
    },
    data() {
        return {
            window,
        }
    },
    methods: {
        goToHome() {
            PubSub.publish('goToState.home')
        }
    }
}