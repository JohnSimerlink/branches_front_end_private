import Exercise from "../../objects/exercise";
import ExerciseQA from "../../objects/exerciseQA";
import ContentItems from "../../objects/contentItems";
import Snack from '../../../node_modules/snack.js/dist/snack'
import './treeReview.less'

import {PROFICIENCIES} from '../proficiencySelector/proficiencySelector'
import invert from 'invert-object'

export default {
    template: require('./treeReview.html'),
    created () {
        var me = this
        this.breadcrumbs = [
            {text: "Spanish",},
            {text: "Conjugating",},
            {text: "Indicative Mood",},
            {text: "1st Person Singular",},
        ]
        this.breadcrumbsAllButLast = this.breadcrumbs.splice(0,this.breadcrumbs.length - 1)
        this.lastBreadcrumb = this.breadcrumbs[this.breadcrumbs.length - 1]
        this.breadcrumbsPreActive = 'A > B > Cat'
        this.breadcrumbsActive = 'Dog'
        this.breadcrumbsPostActive = 'Eel > Wheel > Peel'
        this.items = {} // [{breadcrumb: "Spanish > Hola", id: 'a12345'},{breadcrumb: "Spanish > Senorita", id: 'b23456'}]
        // this.itemIds = {12345: true} //[12345]
        this.selectedItems = []
        this.selectedItemIds = []
        this.question=""
        this.answer=""
        this.tags = null
        this.items = [
            {title: "2nd Person Singular", proficiency: PROFICIENCIES.UNKNOWN},
            {title: "3rd Person Singular", proficiency: PROFICIENCIES.ONE},
            {title: "1st Person Singular", proficiency: PROFICIENCIES.TWO},
        ]
    },
    data () {
        return {
            oneItemTested: true,
            breadcrumbsAllButLast:this.breadcrumbsAllButLast,
            lastBreadcrumb:this.lastBreadcrumb,
            breadcrumbsPreActive: this.breadcrumbsPreActive,
            breadcrumbsActive: this.breadcrumbsActive,
            breadcrumbsPostActive: this.breadcrumbsPostActive,
            items: this.items,
        }
    },
    computed: {
        selectedBreadcrumbs() {
            var me = this
            const selectedBreadcrumbs = Object.keys(this.selectedItemIds).map(id =>  {
                var breadcrumb = me.idBreadcrumbMap[id]
                console.log('id and breadcrumb are ', id, breadcrumb)
                return breadcrumb
            })
            console.log(
                'selected bread crumbs and itemIds are', selectedBreadcrumbs, this.selectedItemIds, me.idBreadcrumbMap
            )
            return selectedBreadcrumbs
        },
    },
    methods: {
        updateProficiency(item, proficiency) {
            console.log('proficiency updated', item, proficiency)
        }
    },
}
