import Exercise from "../../objects/exercise";
// import ExerciseQA from "../../objects/exerciseQA";

export default {
    template: require('./newExercise.html'),
    created () {
        var me = this
        this.items = {}
        this.newItem=""
        this.question=""
        this.answer=""
    },
    data () {
        return {
            items: this.items,
            newItem: this.newItem,
            question: this.question,
            answer: this.answer
        }
    },
    methods: {
        addContentItem() {
            if (!this.item) return
            this.items[this.item] = true
            this.item=""
        },
        createExercise() {
           //TODO allow creation of other types of exercises than QA
           // ExerciseQA.create({question: this.question, answer: this.answer, contentItems:this.items})
        }
    },
    computed : {
    }
}
