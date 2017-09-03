import './exercise-creator.less'
export default {
    props: ['contentItemId','exerciseToReplaceId'],
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
        goBack() {
            PubSub.publish('goToState.home')
        }
    }
}