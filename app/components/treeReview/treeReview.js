import Exercise from "../../objects/exercise";
import Exercises from "../../objects/exercises";
import ExerciseQA from "../../objects/exerciseQA";
import ContentItems from "../../objects/contentItems";
import Snack from '../../../node_modules/snack.js/dist/snack'
import './treeReview.less'

import {PROFICIENCIES} from '../proficiencyEnum.ts'
import invert from 'invert-object'
import {Trees} from "../../objects/trees";

export default {
    props: ['leafId'],
    template: require('./treeReview.html'),
    created () {
        var me = this
        this.tree = {
            aggregationTimer: 0
        }
        // this.exerciseId = '8e0e2cc5be752c843ccfb4114a35ba78'
        // this.leafId = '83cbe6ea3fa874449982b645f04d14a1' // amar
        // this.items = []
        console.log('treeReview.js: leafId is', this.leafId)
        me.initReview()

        this.proficiencyForAllItems = PROFICIENCIES.UNKNOWN
    },
    data () {
        return {
            tree: this.tree,
            loading: true,
            breadcrumbsAllButLast:[],
            lastBreadcrumb: {},
            items: [],
            proficiencyForAllItems: this.proficiencyForAllItems,
            exercise: this.exercise,
            flipped: this.flipped,
        }
    },
    computed: {
        oneItemTested() {
            return this.items.length === 1
        }
    },
    methods: {
        async initReview(){
            this.flipped = false
            this.exercise = {}
            this.items = []
            const me = this
            this.loading = true;

            const tree = await Trees.get(me.leafId)
            me.tree = tree
            const contentItem = await ContentItems.get(tree.contentId)

            me.breadcrumbs = contentItem.getBreadcrumbsObjArray()
            me.breadcrumbsAllButLast = me.breadcrumbs.splice(0,me.breadcrumbs.length - 1)
            me.lastBreadcrumb = me.breadcrumbs[me.breadcrumbs.length - 1]

            me.exerciseId = contentItem.getBestExerciseId()
            if (!me.exerciseId) {
                me.loading = false
            } else {
                me.initExercise()
            }
        },
        async initExercise(){
            const me = this
            const exercise = await Exercises.get(me.exerciseId)
            me.exercise = exercise
            Object.keys(exercise.contentItemIds).forEach(async itemId => {
                const item = await ContentItems.get(itemId)
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
                item.startTimer()
                me.loading = false
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
                item.saveProficiency() // update the item's proficiency in the db. right now its just updated locally
                item.recalculateProficiencyAggregationForTreeChain()
                item.saveTimer()
            })
            var snack = new Snack({
                domParent: document.querySelector('.tree-review')
            });
            // show a snack for 4s
            snack.show('+300 points', 1000);
            this.initReview()
        },
        addExercise(){
            this.$router.push({name: 'create', params: {contentItemId: this.tree.contentId }})
        },
        flip() {
            this.flipped = !this.flipped
        },
        flipIfNotFlipped() {
            if (!this.flipped){
                this.flipped = true
            }
        },
        editExercise(){
            this.$router.push({name: 'edit', params: {exerciseToReplaceId: this.exerciseId}})
            // window.exerciseToReplaceId = this.exerciseId
            // PubSub.publish('goToState.exerciseCreator')
        },
        deleteExercise(){
            if (confirm("Are you sure you want to delete this exercise? For every single user?")){
                this.exercise.remove()
                this.initReview()
            }
        }
    },
}
