// import {newTree} from '../../objects/newTree.js'
// import {Trees} from "../../objects/trees";
// import ContentItems from "../../objects/contentItems";
// //temporary hacky solution for controller
function newTree() {

}
export default {
    template: require('./newTree.html'),
    props: ['parentid','primaryparenttreecontenturi'],
    data () {
        return {
            question: '',
            answer: '',
            title: '',
            type: 'fact'
        }
    },
    computed: {
        headingSelectorStyle () {
            return this.contentIsHeading ? 'font-size: 20px;' : ''; // classes weren't working so im inline CSS-ing it
        },
        factSelectorStyle () {
            return this.contentIsFact ? 'font-size: 20px;' : ''; // classes weren't working so im inline CSS-ing it
        },
        skillSelectorStyle () {
            return this.contentIsSkill ? 'font-size: 20px;' : ''; // classes weren't working so im inline CSS-ing it
        },
        contentIsFact () {
            return this.type == 'fact'
        },
        contentIsHeading () {
            return this.type == 'heading'
        },
        contentIsSkill () {
            return this.type == 'skill'
        },
    },
    methods: {
        createNewTree() {
            let contentArgs;
            switch(this.type) {
                case 'fact':
                    contentArgs = {question: this.question.trim(), answer: this.answer.trim()}
                    break;
                case 'heading':
                    contentArgs = {title: this.title.trim()}
                    break;
                case 'skill':
                    contentArgs = {title: this.title.trim()}
                    break;
            }
            newTree(this.type, this.parentid, this.primaryparenttreecontenturi, contentArgs)
        },
        setTypeToHeading() {
            this.type = 'heading'
        },
        setTypeToFact() {
            this.type = 'fact'
        },
        setTypeToSkill() {
            this.type = 'skill'
        }
    }
}
