import Exercise from "../../objects/exercise";
import Exercises from "../../objects/exercises";
import ExerciseQA from "../../objects/exerciseQA";
import ContentItems from "../../objects/contentItems";
import Snack from '../../../node_modules/snack.js/dist/snack'
import './treeReview.less'

import {PROFICIENCIES} from '../proficiencyEnum'
import invert from 'invert-object'
import {Trees} from "../../objects/trees";

export default {
    template: require('./treeReview.html'),
    created () {
        var me = this
        // this.exerciseId = '8e0e2cc5be752c843ccfb4114a35ba78'
        this.treeid = '83cbe6ea3fa874449982b645f04d14a1'
        this.exercise = {}
        this.items = []
        this.breadcrumbsAllButLast = []
        this.lastBreadcrumb = {}
        // this.items = []
        initReview()

        // this.breadcrumbsPreActive = 'A > B > Cat'
        // this.breadcrumbsActive = 'Dog'
        // this.breadcrumbsPostActive = 'Eel > Wheel > Peel'
        // this.itemIds = {12345: true} //[12345]
        // this.items = [
        //     {title: "2nd Person Singular", proficiency: PROFICIENCIES.UNKNOWN},
        //     {title: "3rd Person Singular", proficiency: PROFICIENCIES.ONE},
        //     {title: "1st Person Singular", proficiency: PROFICIENCIES.TWO},
        // ]
        this.proficiencyForAllItems = PROFICIENCIES.UNKNOWN
        function initReview(){
            Trees.get(me.treeid).then(tree => {
                ContentItems.get(tree.contentId).then(contentItem => {
                    me.exerciseId = contentItem.getBestExerciseId()
                    initExercise()
                })
            })
            me.exerciseId = '536bd726cac153319de8f5e65aac1ce0'
        }
        function initExercise(){
            Exercises.get(me.exerciseId).then(exercise => {
                me.breadcrumbs = [
                    {text: "Spanish",},
                    {text: "Conjugating",},
                    {text: "Indicative Mood",},
                    {text: "1st Person Singular",},
                ]
                me.breadcrumbsAllButLast = me.breadcrumbs.splice(0,me.breadcrumbs.length - 1)
                me.lastBreadcrumb = me.breadcrumbs[me.breadcrumbs.length - 1]
                me.exercise = exercise
                Object.keys(exercise.contentItemIds).forEach(itemId => {
                    ContentItems.get(itemId).then(item => {
                        // item.title = item.id
                        item.title = item.getBreadCrumbs()
                        me.items.push(item)
                        console.log('item id is', item.id)
                    })
                })
            })
            me.flipped = false
        }
    },
    data () {
        return {
            breadcrumbsAllButLast:this.breadcrumbsAllButLast,
            lastBreadcrumb:this.lastBreadcrumb,
            breadcrumbsPreActive: this.breadcrumbsPreActive,
            breadcrumbsActive: this.breadcrumbsActive,
            breadcrumbsPostActive: this.breadcrumbsPostActive,
            items: this.items,
            proficiencyForAllItems: this.proficiencyForAllItems,
            exercise: this.exercise,
            flipped: this.flipped,
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
        oneItemTested() {
            return this.items.length == 0
        }
    },
    methods: {
        updateProficiency(item, proficiency) {
            console.log('proficiency updated', item, proficiency)
        },
        updateProficiencyForAllItems(){
            const me = this
            this.items.forEach( item => {
                item.proficiency = me.proficiencyForAllItems
            })
        },
        proficiencyUnknown(item){
         return item.proficiency == PROFICIENCIES.UNKNOWN
        },
        proficiencyOne(item){
            return item.proficiency == PROFICIENCIES.ONE
        },
        nextQuestion(){
            this.items.forEach(item => {
                item.setProficiency(item.proficiency) // update the item's proficiency in the db. right now its just updated locally
            })
        },
        flip() {
            this.flipped = !this.flipped
        },
        editExercise(){
            window.exerciseToReplaceId = this.exerciseId
            PubSub.publish('goToState.exerciseCreator')
        }

    },
}
