import {Trees} from '../../objects/trees'
import {proficiencyToColor, syncGraphWithNode} from "../treesGraph"
import {Fact} from '../../objects/fact'
import ContentItem from '../../objects/contentItem'
import timers from './timers'

import {Heading} from "../../objects/heading";
import {removeTreeFromGraph} from "../treesGraph"
import {secondsToPretty} from "../../core/filters"
export default {
    template: require('./tree.html'), // '<div> {{movie}} this is the tree template</div>',
    props: ['id'],
    created () {
        var me = this;

        this.editing = false
        this.addingChild = false
        this.tree = {} // init to empty object until promises resolve, so vue does not complain
        this.fact = {}
        this.content = {}
        this.nodeBeingDragged = false
        Trees.get(this.id).then(tree => {
            me.tree = tree
            ContentItem.get(tree.contentId).then(content => {
                me.content = content
                // console.log('this.content in tree.js is ', me.content)
                me.startTimer()
            })

        })
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
             tree: this.tree
            , content: this.content
            , editing: this.editing
            , addingChild: this.addingChild
            , draggingNode: window.draggingNode
        }
    },
    computed : {
        typeIsHeading() {
            return this.tree.contentType == 'heading'
        },
        typeIsFact() {
            return this.tree.contentType == 'fact'
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
        setProficiencyToOne() {
            this.content.setProficiency(0)
            syncGraphWithNode(this.tree.id)
        },
        setProficiencyToTwo() {
            this.content.setProficiency(33)
            syncGraphWithNode(this.tree.id)
        },
        setProficiencyToThree() {
            this.content.setProficiency(66)
            syncGraphWithNode(this.tree.id)
        },
        setProficiencyToFour() {
            this.content.setProficiency(100)
            syncGraphWithNode(this.tree.id)
        },
        toggleAddChild(){
            this.addingChild = !this.addingChild
        },
        //global methods
        changeContent() {
            switch (this.tree.contentType){
                case 'fact':
                    var fact = new Fact({question: this.content.question, answer: this.content.answer})
                    this.content = ContentItem.create(fact)
                    break;
                case 'heading':
                    this.content = ContentItem.create(new Heading({title: this.content.title}))
                    break;
            }
            this.content.addTree(this.id)
            this.tree.changeContent(this.content.id, this.tree.contentType)

            this.toggleEditing()
        },
        changeTypeToFact() {
            this.tree.contentType == 'fact'
        },
        changeTypeToFact() {
            this.tree.contentType == 'heading'
        },
        unlinkFromParent(){
            if (confirm("Warning! Are you sure you would you like to delete this tree AND all its children?")){
                this.tree.unlinkFromParent()
            }
            removeTreeFromGraph(this.id)
        }
    }
}