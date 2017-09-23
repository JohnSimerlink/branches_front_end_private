import ContentItems from '../../objects/contentItems'

export default {
    template: require('./contentList.html'),
    async created () {
        this.items = await ContentItems.getAllExceptForHeadings()
        Object.keys(this.items).forEach(key => {
            let item = this.items[key]
        })
    },
    data () {
        return {
            items: {}
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
        },
        recalculateProficiencyAggregationForAll(){
           ContentItems.recalculateProficiencyAggregationForEntireGraph()
        }
    }
}

