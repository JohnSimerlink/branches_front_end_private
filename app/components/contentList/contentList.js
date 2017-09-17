import ContentItems from '../../objects/contentItems'

export default {
    template: require('./contentList.html'),
    async created () {
        this.items = await ContentItems.getAllExceptForHeadings()
        Object.keys(this.items).forEach(key => {
            let item = this.items[key]
            console.log("item Id" + item.id + " ---- primaryParentTreeContentURI: " + item.primaryParentTreeContentURI + "---- item is", item)
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

console.log('i added something to contentList.js')
console.log('i added something again to contentList.js')
