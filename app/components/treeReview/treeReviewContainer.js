export default {
    template: require('./treeReviewContainer.html'),
    created () {
        var me = this;
        this.leafId = '83cbe6ea3fa874449982b645f04d14a1'
        PubSub.subscribe('goToState.treeReview', (eventName, treeId) => {
            this.goToTreeReview()
        })
    },
    data () {
        return {
            leafId: this.leafId,
        }
    },
    computed : {
    }
}
