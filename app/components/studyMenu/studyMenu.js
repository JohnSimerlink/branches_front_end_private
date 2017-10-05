import './studyMenu.less'
import {Trees} from "../../objects/trees";
import {user} from '../../objects/user'
import ContentItems from "../../objects/contentItems";
let defaultStudySettings = {
    itemTypes: {
        old: true,
        _new: true,
    }, //TODO get from DB,
    oldTypes: {
        overdue: true,
        notOverdue: true,
    }
}
export default {
    template: require('./studyMenu.html'), // '<div> {{movie}} this is the tree template</div>',
    props: [],
    async created() {
        PubSub.subscribe('login', async () => {
            this.studySettings = await user.getStudySettings() || defaultStudySettings
        })
    },
    data(){
        return {
            studySettings: defaultStudySettings
        }
    },
    methods: {
        async saveStudySettings(){
             return await user.applyUpdates({studySettings: this.studySettings})
        },
        selectNew(){
            this.studySettings.itemTypes._new = true
            this.studySettings.itemTypes.old = false
            this.saveStudySettings()
        },
        selectOld(){
            this.studySettings.itemTypes._new = false
            this.studySettings.itemTypes.old = true
            this.saveStudySettings()
        },
        selectBothNewAndOld(){
            this.studySettings.itemTypes._new = true
            this.studySettings.itemTypes.old = true
            this.saveStudySettings()
        },
        selectOverdue(){
            this.studySettings.oldTypes.overdue = true
            this.studySettings.oldTypes.notOverdue = false
            this.saveStudySettings()
        },
        selectNotOverdue(){
            this.studySettings.oldTypes.overdue = false
            this.studySettings.oldTypes.notOverdue = true
            this.saveStudySettings()
        },
        selectBothOverdueAndNotOverdue(){
            this.studySettings.oldTypes.overdue = true
            this.studySettings.oldTypes.notOverdue = true
            this.saveStudySettings()
        },
        toggleStudying(){
            console.log("toggleStudying called!")
            if (this.$store.getters.studying){
                this.$store.commit('enterExploringMode')
            } else {
                this.$store.commit('enterStudyingMode')
            }
        }
    },
    computed:{
        browserIsMobile() {
            return this.$store.state.mobile;
        },
        newSelected(){
            return this.studySettings.itemTypes._new && !this.studySettings.itemTypes.old
        },
        oldSelected(){
            return !this.studySettings.itemTypes._new && this.studySettings.itemTypes.old
        },
        bothSelected(){
            return this.studySettings.itemTypes._new && this.studySettings.itemTypes.old
        },
        oldTrue(){
            return this.studySettings.itemTypes.old
        },
        settingsMenuOpen(){
            return this.$store.state.settingsMenuOpen
        },
        overdueSelected(){
            return this.studySettings.oldTypes.overdue && !this.studySettings.oldTypes.notOverdue //!this.itemTypes.old
        },
        notOverdueSelected(){
            return !this.studySettings.oldTypes.overdue && this.studySettings.oldTypes.notOverdue //!this.itemTypes.old
        },
        bothOverdueAndNotOverdueSelected(){
            return this.studySettings.oldTypes.overdue && this.studySettings.oldTypes.notOverdue //!this.itemTypes.old
        },
        treeId (){
            const id = this.$store.state.currentStudyingCategoryTreeId
            return id
           // return this.$store.state.currentStudyingCategoryTreeId
        },
        treeId (){
            const id = this.$store.state.currentStudyingCategoryTreeId
            return id
            // return this.$store.state.currentStudyingCategoryTreeId
        },
        studying(){
            console.log("studying getter called",this.$store.getters.studying)
            // return true
            return this.$store.getters.studying
        }
    },
    asyncComputed: {
        async numOverdue(){
            const tree = await Trees.get(this.treeId)
            return tree.numOverdue
        },
        async title(){
            const tree = await Trees.get(this.treeId)
            const item = await ContentItems.get(tree.contentId)
            return item.getLastNBreadcrumbsString(4)
            // return item.title
        },
    },
}
