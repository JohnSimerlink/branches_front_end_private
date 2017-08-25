import md5 from 'md5';
import ContentItem from "./contentItem";
import merge from 'lodash.merge'
import ExerciseQA from "./exerciseQA";

const exercises = {} //cache
/**
 * abstract class - only subtypes should be instantiated
 */
export default class Exercise {
    constructor ({contentItems = {}}){
        this.contentItems = contentItems
    }
    init(){}
    addContent(contentId){
        this.contentItems[contentId] = true
    }
    getDBRepresentation(){
        return {
            contentItems: this.contentItems
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
        console.log('updates in contentItem.create are', updates)
        firebase.database().ref().update(updates);
        return exercise;
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
                    let exercise;
                    switch (exerciseData.type){
                        case 'QA':
                            exercise = new ExerciseQA(exerciseData)
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
