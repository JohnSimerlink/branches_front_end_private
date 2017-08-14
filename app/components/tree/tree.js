import {Trees} from '../../objects/trees'
import {proficiencyToColor} from "../treesGraph"
import {Fact} from '../../objects/fact'
import ContentItem from '../../objects/contentItem'
import timers from './timers'
import PubSub from 'pubsub-js'
import {Heading} from "../../objects/heading";
import {removeTreeFromGraph} from "../treesGraph"
import {secondsToPretty} from "../../core/filters"
export default {
    template: require('./tree.html'), // '<div> {{movie}} this is the tree template</div>',
    props: ['id'],
    created () {
        var me = this;

        this.editing = false
        this.tree = {} // init to empty object until promises resolve, so vue does not complain
        this.fact = {}
        this.content = {}
        Trees.get(this.id).then(tree => {
            me.tree = tree
            ContentItem.get(tree.contentId).then(content => {
                me.content = content
                console.log('this.content in tree.js is ', me.content)
                me.startTimer()
            })

        })
        //using this pubsub, bc for some reason vue's beforeDestroy or destroy() methods don't seem to be working
        PubSub.subscribe('canvas.closeTooltip',function () {
            console.log('canvas.closeTooltip subscribe called')
            //get reference to content, because by the time
            const content = me.content
            content.saveTimer()
        })
    },
    beforeDestroy(){
        console.log('before destroy called')
        this.saveTimer()
    },
    destroy(){
        console.log('destroy called')
        this.saveTimer()
    },
    activated() {
       console.log('activated called')
    },
    deactivated(){

        console.log('deactivated called')
        this.saveTimer()
    },
    data () {
        return {
             tree: this.tree
            , content: this.content
            , editing: this.editing
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
            console.log('this.startTimer called')
            this.content.startTimer()
            console.log('this.startTimer called FINISHED')
        },
        saveTimer() {
            console.log('this.content.saveTimer in tree controller save timer is', this, this.content, this.content.saveTimer)
            var me = this
            me.content.saveTimer()
        },
        toggleEditing() {
            this.editing = !this.editing
        },
        setProficiencyToOne() {
            this.content.setProficiency(0)
        },
        setProficiencyToTwo() {
            this.content.setProficiency(33)
        },
        setProficiencyToThree() {
            this.content.setProficiency(66)
        },
        setProficiencyToFour() {
            this.content.setProficiency(100)
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
            if (confirm("Warning! Are you sure you would you like to delete this tree?")){
                this.tree.unlinkFromParent()
            }
            removeTreeFromGraph(this.id)
        }
    }
}