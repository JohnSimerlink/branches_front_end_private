import {log} from '../../core/log'
const env = process.env.NODE_ENV || 'development'
let template = ''
if (env === 'test') {
    let register = require('ignore-styles').default
    if (!register) {
        register = require('ignore-styles')
    }
    register(['.html'])
} else {
    template = require('./studyMenu.html').default
    require('./studyMenu.less')
}
// tslint:disable-next-line no-var-requires
export default {
    template, // '<div> {{movie}} this is the tree template</div>',
    props: [],
    async created() {
        // log('studyMenu created!', template)
        // PubSub.subscribe('login', async () => {
        //     // this.studySettings = await user.getStudySettings() || defaultStudySettings
        // })
    },
    data() {
        return {
            globalSelected: true,
            localSelected: false
        }
    },
    methods: {
        selectGlobal() {
            this.globalSelected = true
        },
        selectLocal() {
            this.localSelected = true
        },
    },
    computed: {
    },
    // asyncComputed: {
    //     async numOverdue() {
    //         return  2
    //         // const tree = await Trees.get(this.treeId)
    //         // return tree.userData.numOverdue
    //     },
    //     async title() {
    //         // console.log('studyMenu - asyncComputed TITLE() called')
    //         // try {
    //         //     log('studyMenu.js this.treeId', this.treeId )
    //         //     const tree = await Trees.get(this.treeId,user.get())
    //         //     log('studyMenu.js title()', tree, )
    //         //     const item = await ContentItems.get(tree.treeData.contentId)
    //         //     log('studyMenu.js title()', item, )
    //         //     const title = item.getLastNBreadcrumbsString(4)
    //         //     log('studyMenu title is', tree, item)
    //         //     return title
    //         // } catch (err){
    //         //     error('studyMenu.js', err)
    //         //     return 'Sample Title'
    //         // }
    //         // // return item.title
    //     },
    // },
}
