import ContentItems from '../../objects/contentItems'

export default {
    template: require('./contentList.html'),
    created () {
        var me = this;
        this.items = {}
        
        ContentItems.getAllExceptForHeadings().then(items => {
            console.log('all items returned are ', items)
            me.items = items
            Object.keys(me.items).forEach(key => {
                let item = me.items[key]
                console.log("item Id" + item.id + " ---- initialParentTreeContentURI: " + item.initialParentTreeContentURI + "---- item is", item)
            })
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
            return this.items && Object.keys(this.items).length
        },
    },
    methods: {
        remove(item) {
            ContentItems.remove(item.id)
        }
    }
}
