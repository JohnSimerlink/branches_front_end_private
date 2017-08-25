import ContentItems from '../../objects/contentItems'

export default {
    template: require('./contentList.html'),
    created () {
        var me = this;
        this.items = {}
        
        ContentItems.getAll().then(items => {
            console.log('all items returned are ', items)
            me.items = items
        })
        this.num = 5
    },
    data () {
        return {
            items: this.items
        }
    },
    computed: {
        numItems() {
            return Object.keys(this.items.length)
        }
    }
}
