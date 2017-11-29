import './proficiency-selector.less'
import {PROFICIENCIES} from "../../objects/proficiency/proficiencyEnum.ts";

export default {
    props: ['value'],
    template: require('./proficiencySelector.html'),
    created () {
    },
    data () {
        return {
        }
    },
    computed: {
        proficiencyIsUnknown(){ return this.value == PROFICIENCIES.UNKNOWN},
        proficiencyIsOne(){ return this.value <= PROFICIENCIES.ONE},
        proficiencyIsTwo(){ return this.value > PROFICIENCIES.ONE && this.value <= PROFICIENCIES.TWO},
        proficiencyIsThree(){ return this.value > PROFICIENCIES.TWO && this.value <= PROFICIENCIES.THREE},
        proficiencyIsFour(){ return this.value > PROFICIENCIES.THREE && this.value <= PROFICIENCIES.FOUR},
    },
    methods: {
        setProficiencyToOne(){
            this.$emit('input', PROFICIENCIES.ONE)
        },
        setProficiencyToTwo(){
            this.$emit('input', PROFICIENCIES.TWO)
        },
        setProficiencyToThree(){
            this.$emit('input', PROFICIENCIES.THREE)
        },
        setProficiencyToFour(){
            this.$emit('input', PROFICIENCIES.FOUR)
        },
    }
}
