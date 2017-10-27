export default {
    props: ['leafId'],
    template: require('./userInfo.html'),
    created () {
    },
    data () {
        return {
            userId: window.cachedUserId
        }
    },
    computed: {
    },
    methods: {

    }
}
