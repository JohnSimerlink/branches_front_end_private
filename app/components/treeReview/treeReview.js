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
    props: ['leafId'],
    template: require('./treeReview.html'),
    created () {
        var me = this
        // this.exerciseId = '8e0e2cc5be752c843ccfb4114a35ba78'
        this.leafId = '83cbe6ea3fa874449982b645f04d14a1' // amar
        // this.items = []
        me.initReview()

        this.proficiencyForAllItems = PROFICIENCIES.UNKNOWN
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
        initReview(){
            this.flipped = false
            this.exercise = {}
            this.items = []
            this.breadcrumbsAllButLast = []
            this.lastBreadcrumb = {}
            const me = this
            Trees.get(me.leafId).then(tree => {
                ContentItems.get(tree.contentId).then(contentItem => {
                    me.exerciseId = contentItem.getBestExerciseId()
                    me.initExercise()
                })
            })
        },
        initExercise(){
            const me = this
            Exercises.get(me.exerciseId).then(exercise => {
                me.exercise = exercise
                me.breadcrumbs = [
                    {text: "Spanish",},
                    {text: "Conjugating",},
                    {text: "Indicative Mood",},
                    {text: "1st Person Singular",},
                ]
                me.breadcrumbsAllButLast = me.breadcrumbs.splice(0,me.breadcrumbs.length - 1)
                me.lastBreadcrumb = me.breadcrumbs[me.breadcrumbs.length - 1]
                Object.keys(exercise.contentItemIds).forEach(itemId => {
                    ContentItems.get(itemId).then(item => {
                        switch(item.type){
                            case 'fact':
                                item.title = item.getURIAdditionNotEncoded()
                                break;
                            case 'skill':
                                item.title = item.getLastNBreadcrumbsString(2)
                                break;
                        }
                        // item.title = item.id
                        me.items.push(item)
                        console.log('item id is', item.id)
                    })
                })
            })
            me.flipped = false
        },
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
            var snack = new Snack({
                domParent: document.querySelector('.tree-review')
            });
            // show a snack for 4s
            snack.show('+300 points', 1000);
            this.initReview()
        },
        flip() {
            this.flipped = !this.flipped
            console.log('this.flip called')
        },
        flipIfNotFlipped() {
            console.log('flipp if not flipped called')
            if (!this.flipped){
                this.flipped = true
            }
        },
        editExercise(){
            window.exerciseToReplaceId = this.exerciseId
            PubSub.publish('goToState.exerciseCreator')
        },
        deleteExercise(){
            if (confirm("Are you sure you want to delete this exercise? For every single user?")){
                this.exercise.delete()
                this.initReview()
            }
        }
    },
}
