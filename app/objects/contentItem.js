const content = {}
if (typeof window !== 'undefined') {
    window.content = content //expose to window for easy debugging
}
import user from './user'
import {calculateMillisecondsTilNextReview} from '../components/reviewAlgorithm/review'
import {PROFICIENCIES} from "../components/proficiencyEnum";
import {Trees} from './trees'
import {
    measurePreviousStrength, estimateCurrentStrength,
    calculateSecondsTilCriticalReviewTime
} from "../forgettingCurve";


export default class ContentItem {

    constructor(args) {
        this.initialParentTreeId = this.initialParentTreeId || (args && args.initialParentTreeId) || null
        this.primaryParentTreeContentURI = this.primaryParentTreeContentURI || (args && args.primaryParentTreeContentURI) || null
        this.trees = args.trees || {}

        this.userTimeMap = args.userTimeMap || {} ;
        this.timer = user.loggedIn && this.userTimeMap && this.userTimeMap[user.getId()] || 0
        this.timerId = null;

        this.userProficiencyMap = args.userProficiencyMap || {}
        this.proficiency = user.loggedIn && this.userProficiencyMap[user.getId()] || 0

        this.userInteractionsMap = args.userInteractionsMap || {}
        this.interactions = user.loggedIn && this.userInteractionsMap[user.getId()] || []
        this.hasInteractions = this.interactions.length

        this.userStrengthMap = args.userStrengthMap || {}
        this.lastRecordedStrength = this.userStrengthMap[user.getId()] || {value: 0,}

        this.userReviewTimeMap = args.userReviewTimeMap || {}
        this.nextReviewTime = user.loggedIn && this.userReviewTimeMap[user.getId()] || 0

        this.studiers = args.studiers || {}
        this.inStudyQueue = user.loggedIn && this.studiers[user.getId()]

        this.exercises = args.exercises || {}

        this.uri = args.uri || null

        this.type = args.type
    }
    init () {
        this.calculateURIBasedOnParentTreeContentURI()
        // this.uri = this.uri || this.primaryParentTreeContentURI + "/" + this.getURIAddition() // this is for contentItems just created from a parent, not ones loaded from the db.
    }

    //used for creating a new fact in db. new Fact is just used for loading a fact from the db, and/or creating a local fact that never talks to the db.

    getDBRepresentation(){
        return {
            initialParentTreeId: this.initialParentTreeId,
            primaryParentTreeContentURI: this.primaryParentTreeContentURI,
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
    getBreadcrumbsObjArray() {
        let sections = this.getURIWithoutRootElement().split("/")
        // console.log('breadcrumb sections for ', this,' are', sections)
        let breadcrumbsObjArray = sections.reduce((accum, val) => {
            if (val == "null" || val == "content" || val == "Everything"){ //filter out sections of the breadcrumbs we dont want // really just for the first section tho
                return accum
            }
            accum.push({text: decodeURIComponent(val)})
            return accum
        }, [])
        return breadcrumbsObjArray
    }
    getLastNBreadcrumbsString(n) {
        let sections = this.getURIWithoutRootElement().split("/")
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

    isLeafType(){
        return this.type === 'fact' || this.type === 'skill'
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
    calculateURIBasedOnParentTreeContentURI(){
        const uri = this.primaryParentTreeContentURI + "/" + this.getURIAddition()
        this.set('uri', uri)
    }
        //TODO : make timer for heading be the sum of the time of all the child facts
    startTimer() {
        var me = this

        if (!this.timerId) { //to prevent from two or more timers being created simultaneously on the content item
            this.timerId = setInterval(function () {
                me.timer  = me.timer || 0
                me.timer++ // = fact.timer || 0
                me.calculateAggregationTimerForTreeChain()//propagate the time increase all the way up
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

    calculateAggregationTimerForTreeChain(){
        const treePromises = this.trees ? Object.keys(this.trees).map(Trees.get)
            : [] // again with the way we've designed this only one contentItem should exist per tree and vice versa . . .but i'm keeping this for loop here for now
        const calculationPromises = treePromises.map(async treePromise => {
            const tree = await treePromise
            return tree.calculateAggregationTimer()
        })
        return Promise.all(calculationPromises)
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
    remove(){
        firebase.database().ref('content/').child(this.id).remove() //delete from db
        delete window.content[this.id]
    }
    recalculateProficiencyAggregationForTreeChain(){
        const treePromises = this.trees ? Object.keys(this.trees).map(Trees.get)
            : [] // again with the way we've designed this only one contentItem should exist per tree and vice versa . . .but i'm keeping this for loop here for now
        const calculationPromises = treePromises.map(async treePromise => {
            const tree = await treePromise
            return tree.recalculateProficiencyAggregation()
        })
        return Promise.all(calculationPromises)
    }
    saveProficiency(){
        !this.inStudyQueue && this.addToStudyQueue()// << i don't even think that is used anymore
        const timestamp = Date.now()


        //content
        this.userProficiencyMap[user.getId()] = this.proficiency

        var updates = {
            userProficiencyMap : this.userProficiencyMap
        }

        firebase.database().ref('content/' + this.id).update(updates)

        //interactions
        const mostRecentInteraction = this.interactions.length ? this.interactions[this.interactions.length - 1] : {currentInteractionStrength: 0}
        const nowMilliseconds = timestamp
        const millisecondsSinceLastInteraction = this.interactions.length ? nowMilliseconds - mostRecentInteraction.timestamp : 0
        const previousInteractionStrength = measurePreviousStrength(mostRecentInteraction.currentInteractionStrength, this.proficiency, millisecondsSinceLastInteraction / 1000) || 0
        const currentInteractionStrength = estimateCurrentStrength(previousInteractionStrength, this.proficiency, millisecondsSinceLastInteraction / 1000) || 0

        const interaction = {timestamp: nowMilliseconds, timeSpent: this.timer, millisecondsSinceLastInteraction, proficiency: this.proficiency, previousInteractionStrength, currentInteractionStrength}
        //store user interactions under content
        this.interactions.push(interaction)
        this.userInteractionsMap[user.getId()] = this.interactions

        var updates = {
            userInteractionsMap : this.userInteractionsMap
        }

        firebase.database().ref('content/' + this.id).update(updates)

        //store contentItem interaction under users
        user.addInteraction(this.id, interaction)

        //store contentItem strength and timestamp under userStrengthMap
        this.lastRecordedStrength = {value: currentInteractionStrength, timestamp}
        this.userStrengthMap[user.getId()] = this.lastRecordedStrength
        var updates = {
            userStrengthMap : this.userStrengthMap
        }
        firebase.database().ref('content/' + this.id).update(updates)
        //user review time map //<<<duplicate some of the information in the user database <<< we should really start using a graph or relational db to avoid this . . .
        const millisecondsTilNextReview = 1000 * calculateSecondsTilCriticalReviewTime(currentInteractionStrength)
        this.nextReviewTime = timestamp + millisecondsTilNextReview

        this.userReviewTimeMap[user.getId()] = this.nextReviewTime
        var updates = {
            userReviewTimeMap : this.userReviewTimeMap
        }
        firebase.database().ref('content/' + this.id).update(updates)
    }

    setProficiency(proficiency) {
        //-proficiency stored as part of this content item
        this.proficiency = proficiency
        this.saveProficiency()
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
        const exerciseKeys = Object.keys(this.exercises).filter(key => key !== 'undefined');// not sure how but some data keys are undefined
        console.log('exercise keys in get best exercise id are', exerciseKeys)
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

    return result
}