//import {offlineFacts} from '../static/of'
//import getFirebase from './firebaseService.js'
//const firebase = getFirebase();

export class ContentItem {

    constructor() {}

    static get(contentId) {
        return new Promise((resolve, reject) => {
            firebase.database().ref('content/' + contentId).on("value", function(snapshot){
                let content = snapshot.val();
                resolve(content);
            }, function(err) {
                console.log("Could not get fact?");
                reject(err);
            })
        })
    }
    //used for creating a new fact in db. new Fact is just used for loading a fact from the db, and/or creating a local fact that never talks to the db.
    /**
     * Create a new content object in the database
     * @param contentItem
     * @returns newly created contentItem
     */
    static create(contentItem) {
        let updates = {};
        updates['/content/' + contentItem.id] = contentItem;
        firebase.database().ref().update(updates);
        return contentItem;
    }

    /**
     * Add a tree to the given content item
     * @param treeId
     */
    addTree(treeId){
        this.trees[treeId] = true;
        let trees = {};
        trees[treeId] = true;
        let updates = {
            trees
        };
        firebase.database().ref('content/' +this.id).update(updates)
    }
}