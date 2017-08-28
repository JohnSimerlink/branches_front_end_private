import Exercise from "../../objects/exercise";

export default {
    template: require('./exerciseList.html'),
    created () {
        var me = this;
        this.exercises = {}
        Exercise.getAll().then(exercises => {
            this.exercises = exercises
        })
    },
    data () {
        return {
            exercises: this.exercises
        }
    },
}
