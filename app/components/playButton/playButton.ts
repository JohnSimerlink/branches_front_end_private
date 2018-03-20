import {log} from '../../core/log';
import {IPlayTreeMutationArgs} from '../../core/store/store_interfaces';
import {GLOBAL_MAP_ROOT_TREE_ID} from '../../core/globals';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
const env = process.env.NODE_ENV || 'development';
let template = '';
if (env === 'test') {
    const register = require('ignore-styles').default || require('ignore-styles');
    register(['.html']);
} else {
    template = require('./playButton.html').default;
    require('./playButton.less');
}
// tslint:disable-next-line no-var-requires
export default {
    template,
    methods: {
        togglePlaying() {
            if (this.playing) {
                this.$store.commit(MUTATION_NAMES.PAUSE);
            } else {
                const playTreeMutationArgs: IPlayTreeMutationArgs = {
                    treeId: GLOBAL_MAP_ROOT_TREE_ID
                };
                this.$store.commit(MUTATION_NAMES.PLAY_TREE, playTreeMutationArgs);
            }
        }
    },
    computed: {
        treeId() {
            return this.$store.state.currentStudyingCategoryTreeId;
        },
        playing() {
            return this.$store.getters.playing;
        }
    },
};
