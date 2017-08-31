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

}
