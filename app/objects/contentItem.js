//import {offlineFacts} from '../static/of'
//import getFirebase from './firebaseService.js'
//const firebase = getFirebase();
const content = {}
window.content = content //expose to window for easy debugging
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
        this.proficiency = user.loggedIn && this.userProficiencyMap[user.getId()] || 0

        this.userInteractionsMap = this.userInteractionsMap || {}
        this.interactions = user.loggedIn && this.userInteractionsMap[user.getId()] || []

        this.userReviewTimeMap = this.userReviewTimeMap || {}
        this.nextReviewTime = user.loggedIn && this.userReviewTimeMap[user.getId()] || 0

        this.studiers = this.studiers || {}
        this.inStudyQueue = user.loggedIn && this.studiers[user.getId()]
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

        console.log('contentItem.js 83: startTimer called')
        if (!this.timerId) { //to prevent from two or more timers being created simultaneously on the content item
            this.timerId = setInterval(function () {
                self.timer  = self.timer || 0
                self.timer++ // = fact.timer || 0
            }, 1000)
        } else {
            console.log('contentItem.js 90: startTimer didnt execute its logic because it already had a timerId of ', this.timerId)
        }

    }
    saveTimer(){
        console.log('contentItem.js 95: saveTimer called')
        this.userTimeMap[user.getId()] = this.timer

        var updates = {
            userTimeMap: this.userTimeMap
        }

        clearInterval(this.timerId)
        this.timerId = null
        firebase.database().ref('content/' + this.id).update(updates)
    }
    addToStudyQueue() { //don't display nextReviewTime if not in user's study queue
        this.studiers[user.getId()] = true

        var updates = {
            studiers: this.studiers
        }
        this.inStudyQueue = true

        firebase.database().ref('content/' + this.id).update(updates)
    }
    setProficiency(proficiency) {
        !this.inStudyQueue && this.addToStudyQueue()
        //proficiency

        //-proficiency stored under fact
        this.proficiency = proficiency
        this.userProficiencyMap[user.getId()] = this.proficiency

        var updates = {
           userProficiencyMap : this.userProficiencyMap
        }

        firebase.database().ref('content/' + this.id).update(updates)


        //interactions
        this.interactions.push({timestamp: firebase.database.ServerValue.TIMESTAMP, proficiency: proficiency})
        this.userInteractionsMap[user.getId()] = this.interactions

        var updates = {
            userInteractionsMap : this.userInteractionsMap
        }

        firebase.database().ref('content/' + this.id).update(updates)

        //duplicate some of the information in the user database <<< we should really start using a graph db to avoid this . . .
        //user review time map
        const millisecondsTilNextReview = calculateMillisecondsTilNextReview(this.interactions)
        this.nextReviewTime = Date.now() + millisecondsTilNextReview

        this.userReviewTimeMap[user.getId()] = this.nextReviewTime
        var updates = {
            userReviewTimeMap : this.userReviewTimeMap
        }
        firebase.database().ref('content/' + this.id).update(updates)

        user.setItemProperties(this.id, {nextReviewTime: this.nextReviewTime, proficiency});
    }
}