import Exercises from "../../objects/exercises";
import ContentItems from "../../objects/contentItems";
import Snack from '../../../node_modules/snack.js/dist/snack'

import {PROFICIENCIES} from '../proficiencyEnum'
import {Trees} from "../../objects/trees";

export default {
    props: ['leafId'],
    template: require('./userInfo.html'),
    created () {
    },
    data () {
        return {
            userId: window.cachedUserId
        }
    },
    computed: {
    },
    methods: {

    }
}
