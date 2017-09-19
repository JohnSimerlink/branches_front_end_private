import './studyMenu.less'
import {Trees} from "../../objects/trees";
import ContentItems from "../../objects/contentItems";
export default {
    template: require('./studyMenu.html'), // '<div> {{movie}} this is the tree template</div>',
    props: [],
    async created() {
    },
    data(){
        return {
            // treeId: 1,
        }
    },
    computed:{
        treeId (){
           return this.$store.state.currentStudyingCategoryTreeId
        },
    },
    asyncComputed: {
        async numOverdue(){
            const tree = await Trees.get(this.treeId)
            return tree.numOverdue
        },
        async title(){
            const tree = await Trees.get(this.treeId)
            const item = await ContentItems.get(tree.contentId)
            return item.title
        }
    }
}
