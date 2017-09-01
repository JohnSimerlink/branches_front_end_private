const content = {}
if (typeof window !== 'undefined') {
    window.content = content //expose to window for easy debugging
}
import user from './user'
import {calculateMillisecondsTilNextReview} from '../components/reviewAlgorithm/review'
import {PROFICIENCIES} from "../components/proficiencyEnum";
import {Trees} from './trees'

export default class ContentItem {

    constructor(args) {
        this.initialParentTreeId = this.initialParentTreeId || (args && args.initialParentTreeId) || null
        this.initialParentTreeContentURI = this.initialParentTreeContentURI || (args && args.initialParentTreeContentURI) || null
        this.trees = args.trees || {}

        this.userTimeMap = args.userTimeMap || {} ;
        this.timer = user.loggedIn && this.userTimeMap && this.userTimeMap[user.getId()] || 0
        this.timerId = null;

        this.userProficiencyMap = args.userProficiencyMap || {}
        this.proficiency = user.loggedIn && this.userProficiencyMap[user.getId()] || 0

        this.userInteractionsMap = args.userInteractionsMap || {}
        this.interactions = user.loggedIn && this.userInteractionsMap[user.getId()] || []

        this.userReviewTimeMap = args.userReviewTimeMap || {}
        this.nextReviewTime = user.loggedIn && this.userReviewTimeMap[user.getId()] || 0

        this.studiers = args.studiers || {}
        this.inStudyQueue = user.loggedIn && this.studiers[user.getId()]

        this.exercises = args.exercises || {}

        this.uri = args.uri || null
    }
    init () {
        this.uri = this.uri || this.initialParentTreeContentURI + "/" + this.getURIAddition() // this is for contentItems just created from a parent, not ones loaded from the db.
    }

    //used for creating a new fact in db. new Fact is just used for loading a fact from the db, and/or creating a local fact that never talks to the db.

    getDBRepresentation(){
        return {
            initialParentTreeId: this.initialParentTreeId,
            initialParentTreeContentURI: this.initialParentTreeContentURI,
            userTimeMap: this.userTimeMap,
            userProficiencyMap: this.userProficiencyMap,
            userInteractionsMap: this.userInteractionsMap,
            userReviewTimeMap: this.userReviewTimeMap,
            studiers: this.studiers,
            exercises: this.exercises,
            uri: this.uri,
        }
    }
    getURIAddition(){

    }
    getURIAdditionNotEncoded(){

    }
    //removes the prefix "content/
    getURIWithoutRootElement(){
        return this.uri.substring(this.uri.indexOf("/") + 1, this.uri.length)
    }
    getBreadCrumbsString(){
        let sections = this.getURIWithoutRootElement().split("/")
        console.log('sample sections in getbreadcrumbsstring are ', sections)
        // console.log('breadcrumb sections for ', this,' are', sections)
        let sectionsResult = sections.reduce((accum, val) => {
            if (val == "null" || val == "content" || val == "Everything"){ //filter out sections of the breadcrumbs we dont want // really just for the first section tho
                return accum
            }
            return accum + " > " + decodeURIComponent(val)
        })
        return sectionsResult
        // console.log('breadcrumb result is', sectionsResult)
        //
        // let breadcrumbs = this.uri.split("/").reduce((total, section) => {
        //     return total + decodeURIComponent(section) + " > "
        // },"")
        // breadcrumbs = breadcrumbs.substring(breadcrumbs.length - 3, breadcrumbs.length) //remove trailing arrow
        // return breadcrumbs
    }
    getLastNBreadcrumbsString(n) {
        let sections = this.getURIWithoutRootElement().split("/")
        console.log('sections are ', sections)
        let result = getLastNBreadcrumbsStringFromList(sections, n)
        return result
        // console.log('breadcrumb sections for ', this,' are', sections)
        // let sectionsResult = sections.reduce((accum, val) => {
        //     if (val == "null" || val == "content" || val == "Everything"){ //filter out sections of the breadcrumbs we dont want // really just for the first section tho
        //         return accum
        //     }
        //     return accum + " > " + decodeURIComponent(val)
        // })
    }
    getBreadCrumbs(){

    }

    /**
     * Used to update tree X and Y coordinates
     * @param prop
     * @param val
     */
    set(prop, val){
        if (this[prop] == val) {
            return;
        }

        var updates = {}
        updates[prop] = val
        // this.treeRef.update(updates)
        firebase.database().ref('content/' +this.id).update(updates)
        this[prop] = val
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
        //TODO : make timer for heading be the sum of the time of all the child facts
    startTimer() {
        var self = this

        if (!this.timerId) { //to prevent from two or more timers being created simultaneously on the content item
            this.timerId = setInterval(function () {
                self.timer  = self.timer || 0
                self.timer++ // = fact.timer || 0
            }, 1000)
        }

    }
    saveTimer(){
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
    addExercise(exerciseId){
        this.exercises[exerciseId] = true

        var updates = {
            exercises: this.exercises
        }

        firebase.database().ref('content/' + this.id).update(updates)
    }
    removeExercise(exerciseId){
        delete this.exercises[exerciseId] // remove from local cache
        firebase.database().ref('content/' + this.id +'/exercises/').child(exerciseId).remove() //delete from db
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
    //methods for html templates
    isProficiencyUnknown(){
        return this.proficiency == PROFICIENCIES.UNKNOWN
    }
    isProficiencyOne(){
        return this.proficiency == PROFICIENCIES.ONE
    }
    isProficiencyTwo(){
        return this.proficiency == PROFICIENCIES.TWO
    }
    isProficiencyThree(){
        return this.proficiency == PROFICIENCIES.THREE
    }
    isProficiencyFour(){
        return this.proficiency == PROFICIENCIES.FOUR
    }
    //returns exerciseId of the best exercise for the user
    //returns null if no exercise found
    getBestExerciseId(){
        const exerciseKeys = Object.keys(this.exercises);
        if (exerciseKeys.length <= 0) {
            return null
        }
        var keyIndex = Math.floor(Math.random() * exerciseKeys.length)
        const exercise = exerciseKeys[keyIndex]

        return exercise
    }
}

/**
 *
 * @param breadcrumbList - e.g. ["Everything", "Spanish%20Grammar", "Conjugating", "Indicative%20Mood", "Present%20Tense", "-ar%20verbs", "3rd%20Person%20Singular"]
 * @returns {string}
 */
export function getLastNBreadcrumbsStringFromList(breadcrumbList, n){
    if (breadcrumbList.length <= n) {
        return breadcrumbList
    }

    var breadcrumbListCopy = breadcrumbList.slice()
    const lastNBreadcrumbSections = breadcrumbListCopy.splice(breadcrumbList.length - n, breadcrumbList.length)
    console.log('lastNBreadcrumbSections are', lastNBreadcrumbSections)
    const result = convertBreadcrumbListToString(lastNBreadcrumbSections)

    return result
}

function convertBreadcrumbListToString(breadcrumbList){
    if (breadcrumbList.length <= 0) return []

    const lastItem = decodeURIComponent(breadcrumbList.splice(-1))

    let firstItems =
        breadcrumbList.reduce((accum, val) => {
            return accum + decodeURIComponent(val) + " > "
        },'')
    let result = firstItems + lastItem
    console.log("convert firstItem, lastItem, result are", firstItems, ' -- ', lastItem, ' -- ', result)

    return result
}