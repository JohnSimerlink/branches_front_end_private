import Exercise from "../../objects/exercise";

export default {
    template: require('./exerciseList.html'),
    async created () {
        this.exercises = await Exercise.getAll()
    },
    data () {
        return {
            exercises: {}
        }
    },
}
