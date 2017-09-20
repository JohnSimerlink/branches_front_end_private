import {Trees} from '../../objects/trees'
import {proficiencyToColor} from "../proficiencyEnum"
import {Fact} from '../../objects/fact'
import ContentItems from '../../objects/contentItems'

import user from '../../objects/user'
import {Heading} from "../../objects/heading";
import {secondsToPretty} from "../../core/filters"
import {Skill} from "../../objects/skill";
import './tree.less'
import { mapActions } from 'vuex'

function refreshGraph() {
    PubSub.publish('refreshGraph')
}
function removeTreeFromGraph(treeId){
    PubSub.publish('removeTreeFromGraph', treeId)
}
function goToFromMap(path){
    PubSub.publish('goToFromMap', path)
}
export default {
    template: require('./tree.html'), // '<div> {{movie}} this is the tree template</div>',
    props: ['id'],
    async created() {
        var me = this;

        this.editing = false
        this.addingChild = false
        this.nodeBeingDragged = false
        this.tree = await Trees.get(this.id)
        this.content = await ContentItems.get(this.tree.contentId)
        this.startTimer()

        //using this pubsub, bc for some reason vue's beforeDestroy or destroy() methods don't seem to be working
        PubSub.subscribe('canvas.closeTooltip', function (eventName, data) {
            if (data.oldNode != me.id) return

            //get reference to content, because by the time
            const content = me.content
            content.saveTimer()
        })
        await this.tree.getLeaves()
        this.tree.sortLeavesByStudiedAndStrength()

    },
    data() {
        return {
            tree: {}, //this.tree
            content: {},// this.content
            editing: this.editing,
            showHistory: false,
            addingChild: this.addingChild,
            user,
        }
    },
    computed: {
        typeIsHeading() {
            return this.tree.contentType == 'heading'
        },
        typeIsFact() {
            return this.tree.contentType == 'fact'
        },
        typeIsSkill() {
            return this.tree.contentType == 'skill'
        },
        styleObject() {
            const styles = {}
            if (this.typeIsHeading) {
                styles['background-color'] = 'black'
                styles['color'] = 'white'
            } else {
                styles['background-color'] = proficiencyToColor(this.content.proficiency)
                if (this.showHistory) {
                    styles['background-color'] = 'black'
                    styles['color'] = 'white'
                }
            }
            return styles
        },
        timerMouseOverMessage() {
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
        toggleHistory() {
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
        studyHeading() {
            console.log('study HEADING called!')
            this.$store.commit('setCurrentStudyingTree', this.id)
            // goToFromMap({name: 'study', params: {leafId: this.id}})
            // this.$router.push()
        },
        clearHeading() {
            this.tree.clearChildrenInteractions()
        },
        proficiencyClicked() {
            this.syncProficiency()
            // this.itemStudied({contentId:this.content.id})
            this.$store.commit('itemStudied', this.content.id)
        },
        syncProficiency() {
            this.content.saveProficiency() //  this.content.proficiency is already set I think, but not saved in db
            this.content.recalculateProficiencyAggregationForTreeChain()
                .then(this.syncTreeChainWithUI)
                .then(refreshGraph)
            this.content.recalculateNumOverdueAggregationForTreeChain()
        },
        clearInteractions(){
            this.content.clearInteractions()
        },
        //unnecessary now that tree chain is composed of categories/headings whose nodes dont have one color
        async syncTreeChainWithUI() {
            this.syncGraphWithNode()
            let parentId = this.tree.parentId;
            let parent
            let num = 1
            while (parentId) {
                // syncGraphWithNode(parentId)
                PubSub.publish('syncGraphWithNode', parentId)
                parent = await Trees.get(parentId)
                parentId = parent.parentId
                num++
            }
        },
        syncGraphWithNode() {
            // syncGraphWithNode(this.tree.id)
            PubSub.publish('syncGraphWithNode', this.tree.id)
        },
        toggleAddChild() {
            this.addingChild = !this.addingChild
        },
        //global methods
        changeContent() {
            switch (this.tree.contentType) {
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
            if (confirm("Warning! Are you sure you would you like to delete this tree AND all its children? THIS CANNOT BE UNDONE")) {
                removeTreeFromGraph(this.id)
                return this.tree.remove()
            }
        }
    }
}
