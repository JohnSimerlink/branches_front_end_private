import {Trees} from '../../objects/trees'
import {proficiencyToColor, syncGraphWithNode, removeTreeFromGraph,refreshGraph} from "../knawledgeMap/knawledgeMap"
import {Fact} from '../../objects/fact'
import ContentItems from '../../objects/contentItems'

import user from '../../objects/user'
import {Heading} from "../../objects/heading";
import {secondsToPretty} from "../../core/filters"
import {Skill} from "../../objects/skill";
import {PROFICIENCIES} from "../proficiencyEnum";
import './itemHistory.less'
import {goToFromMap} from "../knawledgeMap/knawledgeMap";
// import Chartist from 'chartist'

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
