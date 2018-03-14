import {log} from '../../core/log'
const env = process.env.NODE_ENV || 'development';
let template = '';
if (env === 'test') {
    let register = require('ignore-styles').default || require('ignore-styles');
    register(['.html'])
} else {
    template = require('./playButton.html').default;
    require('./playButton.less')
}
// tslint:disable-next-line no-var-requires
export default {
    template,
    methods: {
        togglePlaying() {
        }
    },
    computed: {
        treeId() {
            return this.$store.state.currentStudyingCategoryTreeId;
        },
        playing() {
            return this.$store.getters.playing
        }
    },
}
