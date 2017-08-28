import Exercise from "../../objects/exercise";
// import ExerciseQA from "../../objects/exerciseQA";

export default {
    template: require('./newExercise.html'),
    created () {
        var me = this
        this.items = {'250': true}
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

            if (!this.newItem) return
            this.items[this.newItem] = true
            this.newItem=""
        },
        createExercise() {
           //TODO allow creation of other types of exercises than QA
           // ExerciseQA.create({question: this.question, answer: this.answer, contentItems:this.items})
        }
    },
    computed : {
    }
}
