import md5 from 'md5';
import ContentItem from "./contentItem";
import merge from 'lodash.merge'
// import ExerciseQA from "./exerciseQA";

const exercises = {} //cache
window.exercises = exercises
/**
 * abstract class - only subtypes should be instantiated
 */
export default class Exercise {
    constructor ({contentItemIds = {}}){
        this.contentItemIds = contentItemIds
    }
    init(){}
    addContent(contentId){
        this.contentItemIds[contentId] = true
    }
    getDBRepresentation(){
        return {
            contentItemIds: this.contentItemIds
        }
    }

    /**
     *  ABSTRACT METHOD - should only be called by objects whose type is a subclass of Exercise
     * @param exercise - must be an object that is a subclass of Exercise
     * @returns {*}
     */
    static create(exercise){
        let updates = {};
        updates['/exercises/' + exercise.id] = exercise.getDBRepresentation();
        firebase.database().ref().update(updates);
        return exercise;
    }

    static get(exerciseId) {
        if(!exerciseId){
            throw "Exercises.get(exerciseId) error! exerciseId empty!"
        }
        return new Promise((resolve, reject) => {
            if (exercises[exerciseId]){
                resolve(exercises[exerciseId])
            } else {
                firebase.database().ref('exercises/' + exerciseId).once("value", function(snapshot){
                    const exerciseData = snapshot.val()
                    let exercise;
                    switch (exerciseData.type){
                        case 'QA':
                            // exercise = new ExerciseQA(exerciseData)
                            break;
                    }
                    exercises[exercise.id] = exercise // add to cache
                    resolve(exercise)
                }, reject)
            }
        })
    }
    static getAll() {
        return new Promise((resolve, reject) => {
            firebase.database().ref('exercises/').once("value", function(snapshot){
                const exercisesData = snapshot.val()
                exercisesData &&
                Object.keys(exercisesData).forEach(exerciseData => {
                    const exercise = new Exercise(exerciseData) // make sure exercise item is of type ContentItem. ToDO: polymorphically invoke the correct subType constructor - eg new Fact()
                    exercises[exercise.id] = exercise // add to cache
                })
                resolve(exercises)
            }, reject)
        })
    }
}
