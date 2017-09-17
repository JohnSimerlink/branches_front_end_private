import ContentItems from '../../objects/contentItems'
import './itemHistory.less'

export default {
    template: require('./itemHistory.html'), // '<div> {{movie}} this is the tree template</div>',
    props: ['itemId'],
    async created () {
        console.log('item history component created')
        var me = this;
        new Chartist.Line('.ct-chart', {
          labels: [1, 2, 3, 4, 5, 6, 7, 8],
          series: [
            [5, 9, 7, 8, 5, 3, 5, 4]
          ]
        }, {
          low: 0,
          showArea: true
        });

        this.content = await ContentItems.get(this.itemId)
        this.interactions = this.content.interactions
        console.log("interactions are ", this.interactions)
    },
    data () {
        return {
            content: {},// this.content
            interactions: [],
        }
    },
    computed : {

    },
    methods: {

    }
}
