import {newTree} from '../../objects/newTree.js'
import {Trees} from "../../objects/trees";
import ContentItems from "../../objects/contentItems";
//temporary hacky solution for controller
export default {
    template: require('./newTree.html'),
    props: ['parentid','initialparenttreecontenturi'],
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
            newTree(this.type, this.parentid, this.initialparenttreecontenturi, contentArgs)
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

async function establishURIs(){
   console.log("establish URIs called")
   const tree = await Trees.get(1)
   console.log('tree gotten for id 1 is', tree, tree.contentId)

   const contentItem = await ContentItems.get(tree.contentId)
   console.log('contentItem gotten is', contentItem)

   contentItem.set('uri', 'content/' + contentItem.title)
   contentItem.set('initialParentTreeId', null)
   contentItem.set('primaryParentTreeContentURI', null)

   tree.getChildIds().forEach(establishURIForContentAndThenAllChildren)
}
window.establishURIs = establishURIs


async function establishURIForContentAndThenAllChildren(treeId){
   console.log('establish URI called for', treeId)
   const tree = await Trees.get(treeId)
    if (!tree.parentId){
       return
    }
   const parentTree = await Trees.get(tree.parentId)
   const contentItem = await ContentItems.get(tree.contentId)
   const parentContentItem = await ContentItems.get(parentTree.contentId)
   console.log(treeId + ": contentItem is ", contentItem)
   console.log(treeId + ": parent contentItem URI is ", parentContentItem.uri)
   let uri = parentContentItem.uri + "/" + contentItem.getURIAddition()
   console.log(treeId + ": URI is ", uri)
   console.log(treeId + ": children are ", tree.children && Object.keys(tree.children))
   contentItem.set('uri', uri)
   contentItem.set('initialParentTreeId', parentTree.id)
   contentItem.set('primaryParentTreeContentURI', parentContentItem.uri)
   tree.getChildIds().forEach(establishURIForContentAndThenAllChildren)
}
