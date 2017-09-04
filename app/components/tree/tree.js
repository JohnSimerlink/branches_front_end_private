import {Trees} from '../../objects/trees'
import {proficiencyToColor, syncGraphWithNode, removeTreeFromGraph} from "../knawledgeMap/knawledgeMap"
import {Fact} from '../../objects/fact'
import ContentItems from '../../objects/contentItems'

import user from '../../objects/user'
import {Heading} from "../../objects/heading";
import {secondsToPretty} from "../../core/filters"
import {Skill} from "../../objects/skill";
import {PROFICIENCIES} from "../proficiencyEnum";
import './tree.less'

export default {
    template: require('./tree.html'), // '<div> {{movie}} this is the tree template</div>',
    props: ['id'],
    async created () {
        var me = this;

        this.editing = false
        this.addingChild = false
        // this.tree = {} // init to empty object until promises resolve, so vue does not complain
        // this.fact = {}
        // this.content = {}
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

    },
    data () {
        return {
            tree:{}, //this.tree
            content: {},// this.content
            editing: this.editing,
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
            styles['background-color'] = proficiencyToColor(this.content.proficiency)
            return styles
        },
        timerMouseOverMessage(){
            return "You have spent " + secondsToPretty(this.content.timer) + "studying this item"
        }
    },
    methods: {
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
        syncProficiency() {
            this.content.saveProficiency() //  this.content.proficiency is already set I thinkh
            this.tree.recalculateProficiencyAggregation() // << i don't like that this gets calle
            syncGraphWithNode(this.tree.id)
        },
        recalculateProficiencyAggregation() {
            this.tree.recalculateProficiencyAggregation()
        },
        syncGraphWithNode(){
            syncGraphWithNode(this.tree.id)
        },
        setProficiencyToOne() {
            this.content.setProficiency(PROFICIENCIES.ONE)
        },
        setProficiencyToTwo() {
            this.content.setProficiency(PROFICIENCIES.TWO)
        },
        setProficiencyToThree() {
            this.content.setProficiency(PROFICIENCIES.THREE)
        },
        setProficiencyToFour() {
            this.content.setProficiency(PROFICIENCIES.FOUR)
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
                await removeTreeFromGraph(this.id)
                this.tree.removeAndDisconnectFromParent()
            }
        }
    }
}