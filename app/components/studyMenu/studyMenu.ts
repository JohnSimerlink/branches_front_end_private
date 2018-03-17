import {log} from '../../core/log';

const defaultStudySettings = {
    itemTypes: {
        old: true,
        _new: true,
    }, // TODO get from DB,
    oldTypes: {
        overdue: true,
        notOverdue: true,
    }
};
const env = process.env.NODE_ENV || 'development';
let template = '';
if (env === 'test') {
    let register = require('ignore-styles').default;
    if (!register) {
        register = require('ignore-styles');
    }
    register(['.html']);
} else {
    template = require('./studyMenu.html').default;
    require('./studyMenu.less');
}
// tslint:disable-next-line no-var-requires
export default {
    template, // '<div> {{movie}} this is the tree template</div>',
    props: [],
    async created() {
    },
    data() {
        return {
            studySettings: defaultStudySettings
        };
    },
    methods: {
        async saveStudySettings() {
             // return await user.applyUpdates({studySettings: this.studySettings})
        },
        selectNew() {
        },
        selectOld() {
        },
        selectBothNewAndOld() {
        },
        selectOverdue() {
        },
        selectNotOverdue() {
        },
        selectBothOverdueAndNotOverdue() {
        },
        toggleStudying() {
        }
    },
    computed: {
        browserIsMobile() {
            return this.$store.state.mobile;
        },
        newSelected() {
            return this.studySettings.itemTypes._new && !this.studySettings.itemTypes.old;
        },
        oldSelected() {
            return !this.studySettings.itemTypes._new && this.studySettings.itemTypes.old;
        },
        bothSelected() {
            return this.studySettings.itemTypes._new && this.studySettings.itemTypes.old;
        },
        oldTrue() {
            return this.studySettings.itemTypes.old;
        },
        settingsMenuOpen() {
            return this.$store.state.settingsMenuOpen;
        },
        overdueSelected() {
            return this.studySettings.oldTypes.overdue && !this.studySettings.oldTypes.notOverdue; // !this.itemTypes.old
        },
        notOverdueSelected() {
            return !this.studySettings.oldTypes.overdue && this.studySettings.oldTypes.notOverdue; // !this.itemTypes.old
        },
        bothOverdueAndNotOverdueSelected() {
            return this.studySettings.oldTypes.overdue && this.studySettings.oldTypes.notOverdue; // !this.itemTypes.old
        },
        treeId() {
            return this.$store.state.currentStudyingCategoryTreeId;
        },
        studying() {
            return this.$store.getters.studying;
        }
    },
};
