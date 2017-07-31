import {Trees} from '../../objects/trees'
import {Facts} from '../../objects/facts'
import {Fact} from '../../objects/fact'
import ContentItem from '../../objects/contentItem'
import timers from './timers'
import PubSub from 'pubsub-js'
import {Heading} from "../../objects/heading";
import {removeTreeFromGraph} from "../treesGraph"
export default {
    template: require('./tree.html'), // '<div> {{movie}} this is the tree template</div>',
    props: ['movie', 'id'],
    created () {
        var self = this;

        this.editing = false
        this.tree = {} // init to empty object until promises resolve, so vue does not complain
        this.fact = {}
        this.content = {}
        Trees.get(this.id).then(tree => {
            self.tree = tree
            ContentItem.get(tree.contentId).then(content => {
                self.content = content
                self.startTimer()
            })

        })
        // Trees.get(this.id).then( (tree) => {
        //     self.tree = tree
        //     Facts.get(tree.factId).then((fact) =>{
        //         self.fact = fact
        //         this.startTimer()
        //     })
        // })
        PubSub.subscribe('canvas.clicked', () => {
            console.log('canvas clicked!')
            self.saveTimer()
        })
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
        }
    },
    methods: {
        startTimer() {
            console.log()
            this.content.startTimer()
        },
        saveTimer() {
            this.content.saveTimer()
        },
        toggleEditing() {
            this.editing = !this.editing
        },
        changeFactForTree() {
            this.fact = Facts.create({question: this.fact.question, answer: this.fact.answer})
            this.fact.addTree(this.id)
            // this.tree.changeFact(this.fact.id)
            this.tree.changeContent(contentId, contentType)
            this.toggleEditing()
        },
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