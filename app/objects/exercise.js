/**
 * abstract class - only subtypes should be instantiated
 */
import ContentItems from "./contentItems";

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
    delete() {
        const me = this
        //remove this exercise from any contentItems so it is unsearchable
        Object.keys(this.contentItemIds).forEach(contentItemId => {
            ContentItems.get(contentItemId).then(contentItem => {
                contentItem.removeExercise(me.id)
            })
        })
    }

}
