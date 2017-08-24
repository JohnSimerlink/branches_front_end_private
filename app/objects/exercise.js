import md5 from 'md5';
import ContentItem from "./contentItem";
import merge from 'lodash.merge'

const exercises = {} //cache
export class Exercise {

    //question and answer can both be user generated HTML that can include image links to imgur
    constructor ({question, answer, contents = {}}){
        this.question = question;
        this.answer = answer;
        this.id = md5(JSON.stringify({question, answer}));
        this.contents = contents
    }
    addContent(contentId){
        this.contents[contentId] = true
    }
    getDBRepresentation(){
        return {
            id: this.id,
            question: this.question,
            answer: this.answer,
            contents: this.contents
        }
    }
    static create({question, answer, contents = {}}){
        const exercise = new Exercise({question, answer, contents})

        let updates = {};
        updates['/exercises/' + exercise.id] = exercise.getDBRepresentation();
        console.log('updates in contentItem.create are', updates)
        firebase.database().ref().update(updates);
        return contentItem;

    }
    static get(exerciseId) {
        if(!exerciseId){
            throw "Content.get(exerciseId) error! exerciseId empty!"
        }
        return new Promise((resolve, reject) => {
            if (exercises[exerciseId]){
                resolve(exercises[exerciseId])
            } else {
                firebase.database().ref('exercises/' + exerciseId).on("value", function(snapshot){
                    const exerciseData = snapshot.val()
                    const exercise = new Exercise(exerciseData) // make sure exercise item is of type ContentItem. ToDO: polymorphically invoke the correct subType constructor - eg new Fact()
                    exercises[exercise.id] = exercise // add to cache
                    resolve(exercise)
                }, reject)
            }
        })
    }
    static getAll() {
        return new Promise((resolve, reject) => {
            if (exercises[exerciseId]){
                resolve(exercises[exerciseId])
            } else {
                firebase.database().ref('exercises/').on("value", function(snapshot){
                    const exercisesData = snapshot.val()
                    Object.keys(exercisesData).forEach(exerciseData => {
                        const exercise = new Exercise(exerciseData) // make sure exercise item is of type ContentItem. ToDO: polymorphically invoke the correct subType constructor - eg new Fact()
                        exercises[exercise.id] = exercise // add to cache
                    })
                    resolve(exercises)
                }, reject)
            }
        })
    }
}
