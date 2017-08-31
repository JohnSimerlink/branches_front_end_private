import './proficiency-selector.less'
export const PROFICIENCIES = {
    UNKNOWN: 0,
    ONE: 33,
    TWO: 66,
    THREE: 95,
    FOUR: 100
}
export default {
    props: ['value'],
    template: require('./proficiencySelector.html'),
    created () {
        var me = this
        // this.proficiency = this.value
        console.log("this.proficiency is", this.proficiency)
        console.log("this.proficiency is", this.value)
        // this.proficiency = this.proficiency || PROFICIENCIES.UNKNOWN
        // console.log("this proficiency in proficiency selector is", proficiency)
    },
    data () {
        return {
            value: this.value
        }
    },
    computed: {
        proficiencyIsUnknown(){ return this.value == PROFICIENCIES.UNKNOWN},
        proficiencyIsOne(){ return this.value == PROFICIENCIES.ONE},
        proficiencyIsTwo(){ return this.value == PROFICIENCIES.TWO},
        proficiencyIsThree(){ return this.value == PROFICIENCIES.THREE},
        proficiencyIsFour(){ return this.value == PROFICIENCIES.FOUR},
    },
    methods: {
        setProficiencyToOne(){
            this.$emit('input', PROFICIENCIES.ONE)
            console.log("this.proficiency is", this.proficiency)
        },
        setProficiencyToTwo(){
            this.$emit('input', PROFICIENCIES.TWO)
            console.log("this.proficiency is", this.proficiency)
        },
        setProficiencyToThree(){
            this.proficiency = PROFICIENCIES.THREE
            this.$emit('input', PROFICIENCIES.THREE)
            console.log("this.proficiency is", this.proficiency)
        },
        setProficiencyToFour(){
            this.proficiency = PROFICIENCIES.FOUR
            this.$emit('input', PROFICIENCIES.FOUR)
            console.log("this.proficiency is", this.proficiency)
        },
    }
}
