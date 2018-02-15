import './studyMenu.less'
import {log} from '../../core/log'
const defaultStudySettings = {
    itemTypes: {
        old: true,
        _new: true,
    }, // TODO get from DB,
    oldTypes: {
        overdue: true,
        notOverdue: true,
    }
}
const env = process.env.NODE_ENV || 'development'
if (env === 'test') {
    const register = require('ignore-styles')
    register(['.html'])
}
// tslint:disable-next-line no-var-requires
const template = require('./studyMenu.html').default
export default {
    template, // '<div> {{movie}} this is the tree template</div>',
    props: [],
    async created() {
        // PubSub.subscribe('login', async () => {
        //     // this.studySettings = await user.getStudySettings() || defaultStudySettings
        // })
    },
    data() {
        return {
            studySettings: defaultStudySettings
        }
    },
    methods: {
        async saveStudySettings() {
             // return await user.applyUpdates({studySettings: this.studySettings})
        },
        selectNew() {
            // this.studySettings.itemTypes._new = true
            // this.studySettings.itemTypes.old = false
            // this.saveStudySettings()
        },
        selectOld() {
            // this.studySettings.itemTypes._new = false
            // this.studySettings.itemTypes.old = true
            // this.saveStudySettings()
        },
        selectBothNewAndOld() {
            // this.studySettings.itemTypes._new = true
            // this.studySettings.itemTypes.old = true
            // this.saveStudySettings()
        },
        selectOverdue() {
            // this.studySettings.oldTypes.overdue = true
            // this.studySettings.oldTypes.notOverdue = false
            // this.saveStudySettings()
        },
        selectNotOverdue() {
            // this.studySettings.oldTypes.overdue = false
            // this.studySettings.oldTypes.notOverdue = true
            // this.saveStudySettings()
        },
        selectBothOverdueAndNotOverdue() {
            // this.studySettings.oldTypes.overdue = true
            // this.studySettings.oldTypes.notOverdue = true
            // this.saveStudySettings()
        },
        toggleStudying() {
            // console.log('toggleStudying called!')
            // if (this.$store.getters.studying){
            //     this.$store.commit('enterExploringMode')
            // } else {
            //     this.$store.commit('enterStudyingMode')
            // }
        }
    },
    computed: {
        browserIsMobile() {
            return this.$store.state.mobile;
        },
        newSelected() {
            return this.studySettings.itemTypes._new && !this.studySettings.itemTypes.old
        },
        oldSelected() {
            return !this.studySettings.itemTypes._new && this.studySettings.itemTypes.old
        },
        bothSelected() {
            return this.studySettings.itemTypes._new && this.studySettings.itemTypes.old
        },
        oldTrue() {
            return this.studySettings.itemTypes.old
        },
        settingsMenuOpen() {
            return this.$store.state.settingsMenuOpen
        },
        overdueSelected() {
            return this.studySettings.oldTypes.overdue && !this.studySettings.oldTypes.notOverdue // !this.itemTypes.old
        },
        notOverdueSelected() {
            return !this.studySettings.oldTypes.overdue && this.studySettings.oldTypes.notOverdue // !this.itemTypes.old
        },
        bothOverdueAndNotOverdueSelected() {
            return this.studySettings.oldTypes.overdue && this.studySettings.oldTypes.notOverdue // !this.itemTypes.old
        },
        treeId() {
            const id = this.$store.state.currentStudyingCategoryTreeId
            log('studymenu - treeId() called', id)
            return id
            // return this.$store.state.currentStudyingCategoryTreeId
        },
        studying() {
            log('studying getter called', this.$store.getters.studying)
            // return true
            return this.$store.getters.studying
        }
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
