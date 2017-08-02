//import {offlineFacts} from '../static/of'
//import getFirebase from './firebaseService.js'
//const firebase = getFirebase();
const content = {}
import user from './user'
import {calculateMillisecondsTilNextReview} from '../components/reviewAlgorithm/review'
export default class ContentItem {

    constructor() {
    }
    init () {
        this.userTimeMap = this.userTimeMap || {} ;
        this.timer = user.loggedIn && this.userTimeMap && this.userTimeMap[user.getId()] || 0
        this.timerId = null;

        this.userProficiencyMap = this.userProficiencyMap || {}
        this.proficiency = user.loggedIn && this.userProficiencyMap && this.userProficiencyMap[user.getId()] || 0

        this.userInteractionsMap = this.userInteractionsMap || {}
        this.interactions = user.loggedIn && this.userInteractionsMap[user.getId()] || 0

        this.userReviewTimeMap = this.userReviewTimeMap || {}
        this.timeTilReview = user.loggedIn && this.userReviewTimeMap && this.userReviewTimeMap[user.getId()] || 0
    }

    static get(contentId) {
        if(!contentId){
            throw "Content.get(contentId) error! contentId empty!"
        }
        return new Promise((resolve, reject) => {
            if (content[contentId]){
                resolve(content[contentId])
            } else {
                firebase.database().ref('content/' + contentId).on("value", function(snapshot){
                    const contentData = snapshot.val()
                    const contentItem = new ContentItem() // make sure content item is of type ContentItem. ToDO: polymorphically invoke the correct subType constructor - eg new Fact()
                    for (let prop in contentData){ //copy over data into this new typed object
                        contentItem[prop] = contentData[prop]
                    }
                    contentItem.init() // post constructor

                    content[contentItem.id] = contentItem // add to cache
                    resolve(contentItem)
                }, reject)
            }
        })
    }

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
    //used for creating a new fact in db. new Fact is just used for loading a fact from the db, and/or creating a local fact that never talks to the db.

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
        //TODO : make timer for heading be the sum of the time of all the child facts
    startTimer() {
        var self = this

        if (!this.timerId) { //to prevent from two or more timers being created simultaneously on the content item
            this.timerId = setInterval(function () {
                self.timer = self.timer || 0
                self.timer++ // = fact.timer || 0
            }, 1000)
        }

    }
    saveTimer(){
        this.userTimeMap[user.getId()] = this.timer
        console.log('settimer for user just called on this now,', this)

        var updates = {
            userTimeMap: this.userTimeMap
        }

        this.timerId = null
        firebase.database().ref('content/' + this.id).update(updates)
    }
    setProficiency(proficiency) {
        //proficiency

        //-proficiency stored under fact
        this.proficiency = proficiency
        this.userProficiencyMap[user.getId()] = this.proficiency

        var updates = {
           userProficiencyMap : this.userProficiencyMap
        }

        this.timerId = null
        firebase.database().ref('content/' + this.id).update(updates)

        //interactions
        this.interactions.push({timestamp: firebase.database.ServerValue.TIMESTAMP, proficiency: proficiency})
        this.userInteractionsMap[user.getId()] = this.interactions

        var updates = {
            userInteractionsMap : this.userInteractionsMap
        }

        firebase.database().ref('content/' + this.id).update(updates)

        //user review time map
        const millisecondsTilNextReview = calculateMillisecondsTilNextReview(this.interactions)
        this.nextReviewTime = firebase.database.ServerValue.TIMESTAMP + millisecondsTilNextReview

        this.userReviewTimeMap[user.getId()] = this.nextReviewTime

        //user contentItemReviewTimeMap
        user.addItemReviewTime({id: this.id, nextReviewTime: this.nextReviewTime})
    }
}