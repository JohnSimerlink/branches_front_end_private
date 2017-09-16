import {Trees} from '../../objects/trees'
import {proficiencyToColor, syncGraphWithNode, removeTreeFromGraph,refreshGraph} from "../knawledgeMap/knawledgeMap"
import {Fact} from '../../objects/fact'
import ContentItems from '../../objects/contentItems'

import user from '../../objects/user'
import {Heading} from "../../objects/heading";
import {secondsToPretty} from "../../core/filters"
import {Skill} from "../../objects/skill";
import {PROFICIENCIES} from "../proficiencyEnum";
import './tree.less'
import {goToFromMap} from "../knawledgeMap/knawledgeMap";
import { mapActions } from 'vuex'

export default {
    template: require('./tree.html'), // '<div> {{movie}} this is the tree template</div>',
    props: ['id'],
    async created () {
        var me = this;

        this.editing = false
        this.addingChild = false
        this.nodeBeingDragged = false
        this.tree = await Trees.get(this.id)
        this.content = await ContentItems.get(this.tree.contentId)
        this.startTimer()

        //using this pubsub, bc for some reason vue's beforeDestroy or destroy() methods don't seem to be working
        PubSub.subscribe('canvas.closeTooltip',function (eventName, data) {
            if (data.oldNode != me.id) return

            //get reference to content, because by the time
            const content = me.content
            content.saveTimer()
        })
        //todo replace with vuex
        PubSub.subscribe('canvas.startDraggingNode', function() {
            window.draggingNode = true
        })
        PubSub.subscribe('canvas.stopDraggingNode', function() {
            window.draggingNode = false
        })
        await this.tree.getLeaves()
        this.tree.sortLeavesByStudiedAndStrength()
        console.log('this.tree getLeaves just called')

    },
    data () {
        return {
            tree:{}, //this.tree
            content: {},// this.content
            editing: this.editing,
            showHistory: false,
            addingChild: this.addingChild,
            draggingNode: window.draggingNode,
            user,
        }
    },
    computed : {
        typeIsHeading() {
            return this.tree.contentType == 'heading'
        },
        typeIsFact() {
            return this.tree.contentType == 'fact'
        },
        typeIsSkill() {
            return this.tree.contentType == 'skill'
        },
        styleObject(){
            const styles = {}
            if(this.typeIsHeading){
                styles['background-color'] = 'black'
                styles['color'] = 'white'
            } else {
                styles['background-color'] = proficiencyToColor(this.content.proficiency)
                if (this.showHistory){
                    styles['background-color'] = 'black'
                    styles['color'] = 'white'
                }
            }
            return styles
        },
        timerMouseOverMessage(){
            return "You have spent " + secondsToPretty(this.content.timer) + "studying this item"
        },
        numChildren() {
            return this.tree && this.tree.children instanceof Object ? Object.keys(this.tree.children).length : 0
        },
    },
    methods: {
        ...mapActions(['itemStudied']),
        // ...mapAction
        //user methods
        startTimer() {
            this.content.startTimer()
        },
        saveTimer() {
            this.content.saveTimer()
        },
        toggleEditing() {
            this.editing = !this.editing
        },
        toggleAddChild() {
            this.addingChild = !this.addingChild
        },
        toggleHistory(){
            if (this.typeisHeading) return
            this.showHistory = !this.showHistory
        },
        toggleEditingAndAddChild() {
            this.addingChild = !this.addingChild
            this.editing = this.addingChild
        },
        studySkill() {
            goToFromMap({name: 'study', params: {leafId: this.id}})
            // this.$router.push()
        },
        proficiencyClicked(){
            this.syncProficiency()
            // this.itemStudied({contentId:this.content.id})
            this.$store.commit('itemStudied', this.content.id)
        },
        syncProficiency() {
            this.content.saveProficiency() //  this.content.proficiency is already set I think, but not saved in db
            this.content.recalculateProficiencyAggregationForTreeChain()
                .then(this.syncTreeChainWithUI)
                .then(refreshGraph)
            this.syncGraphWithNode()
        },
        async syncTreeChainWithUI() {
            syncGraphWithNode(this.tree.id)
            // this.syncGraphWithNode()
            let parentId = this.tree.parentId;
            let parent
            let num = 1
            while (parentId){
                syncGraphWithNode(parentId)
                parent = await Trees.get(parentId)
                parentId = parent.parentId
                num++
            }
        },
        async syncGraphWithNode(){
            await syncGraphWithNode(this.tree.id)
        },
        toggleAddChild(){
            this.addingChild = !this.addingChild
        },
        //global methods
        changeContent() {
            switch (this.tree.contentType){
                case 'fact':
                    var fact = new Fact({question: this.content.question, answer: this.content.answer})
                    this.content = ContentItems.create(fact)
                    break;
                case 'heading':
                    const heading = new Heading({title: this.content.title})
                    this.content = ContentItems.create(heading)
                    break;
                case 'skill':
                    const skill = new Skill({title: this.content.title})
                    this.content = ContentItems.create(skill)
                    break;
            }
            this.content.addTree(this.id)
            this.tree.changeContent(this.content.id, this.tree.contentType)

            this.toggleEditing()
        },
        async remove() {
            if (confirm("Warning! Are you sure you would you like to delete this tree AND all its children? THIS CANNOT BE UNDONE")){
                removeTreeFromGraph(this.id)
                return this.tree.remove()
            }
        }
    }
}