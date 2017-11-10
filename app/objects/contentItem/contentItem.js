import {timeFromNow} from "../../core/filters";

const URI_WINDOW_PREFIX = 'null/Everything'
const content = {}
if (typeof window !== 'undefined') {
    window.content = content //expose to window for easy debugging
}
import {user} from '../user'
import {calculateMillisecondsTilNextReview} from '../../components/reviewAlgorithm/review'
import {PROFICIENCIES, proficiencyToColor} from "../../components/proficiencyEnum.ts";
import {Trees} from '../trees'
import {
    measurePreviousStrength, estimateCurrentStrength,
    calculateSecondsTilCriticalReviewTime
} from "../../forgettingCurve";
import store from '../../core/store'
import message from "../../message";
import UriContentMap from "../uriContentMap";
import {convertBreadcrumbListToString, getLastNBreadcrumbsStringFromList, getLastNBreadcrumbsString, getURIWithoutRootElement} from "./uriParser.ts";

const INITIAL_LAST_RECORDED_STRENGTH = {value: 0,}

function refreshGraph() {
    PubSub.publish('refreshGraph')
}

export default class ContentItem {

    constructor(args) {
        this.primaryParentTreeId = this.primaryParentTreeId || (args && args.primaryParentTreeId) || null
        this.primaryParentTreeContentURI = this.primaryParentTreeContentURI || (args && args.primaryParentTreeContentURI) || null
        this.trees = args.trees || {}

        this.userTimeMap = args.userTimeMap || {} ;
        this.timer = user.loggedIn && this.userTimeMap && this.userTimeMap[user.getId()] || 0
        this.timerId = null;

        this.userProficiencyMap = args.userProficiencyMap || {}
        this.proficiency = user.loggedIn && this.userProficiencyMap[user.getId()] || PROFICIENCIES.UNKNOWN

        this.userInteractionsMap = args.userInteractionsMap || {}
        this.interactions = user.loggedIn && this.userInteractionsMap[user.getId()] || []

        this.userStrengthMap = args.userStrengthMap || {}
        this.lastRecordedStrength = this.userStrengthMap[user.getId()] || INITIAL_LAST_RECORDED_STRENGTH

        this.userReviewTimeMap = args.userReviewTimeMap || {}
        this.nextReviewTime = user.loggedIn && this.userReviewTimeMap[user.getId()] || 0

        this.userOverdueMap = args.userOverdueMap || {}
        this.overdue = user.loggedIn && this.userOverdueMap[user.getId()] || false
        if (!this.overdue && this.hasInteractions()){
            if(this.determineIfOverdueNow()){
                this.setOverdue(true)
            } else {
                this.setOverdueTimeout()
            }
        }

        this.studiers = args.studiers || {}
        this.inStudyQueue = user.loggedIn && this.studiers[user.getId()]

        this.exercises = args.exercises || {}

        this.uri = args.uri || null

        this.type = args.type
    }
    init () {
    }

    //used for creating a new fact in db. new Fact is just used for loading a fact from the db, and/or creating a local fact that never talks to the db.

    getDBRepresentation(){
        return {
            primaryParentTreeId: this.primaryParentTreeId,
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
    getURIForWindow(){
        let uri = this.uri
        if (uri.indexOf(URI_WINDOW_PREFIX) === 0){
            uri = uri.substring(URI_WINDOW_PREFIX.length)
        }
        if(uri.indexOf("/") !== 0){
            uri = "/" + uri
        }
        return uri
    }

    getURIAddition(){

    }
    getURIAdditionNotEncoded(){

    }
    getBreadCrumbsString(){
        let sections = getURIWithoutRootElement(this.uri).split("/")
        // console.log('breadcrumb sections for ', this,' are', sections)
        let sectionsResult = sections.reduce((accum, val) => {
            if (val == "null" || val == "content" || val == "Everything"){ //filter out sections of the breadcrumbs we dont want // really just for the first section tho
                return accum
            }
            return accum + " > " + decodeURIComponent(val)
        })
        return sectionsResult
    }
    getBreadcrumbsObjArray() {
        let sections = getURIWithoutRootElement(this.uri).split("/")
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
        return getLastNBreadcrumbsString(this.uri, n)
    }

    isLeafType(){
        return this.type === 'fact' || this.type === 'skill'
    }

    determineIfOverdueNow(){
        let millisecondsTilOverdue = this.nextReviewTime - Date.now()
        return millisecondsTilOverdue < 0
        // millisecondsTilOverdue = millisecondsTilOverdue > 0 ? millisecondsTilOverdue: 0
    }

    setOverdue(overdue, updateInDB = true){
        // console.log(this.id, "setOverdue called with parameter of ", overdue)
        this.overdue = overdue

        this.userOverdueMap[user.getId()] = this.overdue

        if (!updateInDB){
            return
        }

        var updates = {
            userOverdueMap: this.userOverdueMap
        }

        firebase.database().ref('content/' + this.id).update(updates)

    }

    setOverdueTimeout(){
        this.setOverdue(false)
        let millisecondsTilOverdue = this.nextReviewTime - Date.now()
        millisecondsTilOverdue = millisecondsTilOverdue > 0 ? millisecondsTilOverdue: 0

        const me = this
        if (this.hasInteractions()){
            this.markOverdueTimeout = setTimeout(me.markOverdue.bind(me), millisecondsTilOverdue)
        }
    }

    markOverdue(){
        this.clearOverdueTimeout()
        this.setOverdue(true)
        const colorForMessage = proficiencyToColor(this.proficiency)
        message(
            {
                text: "Click to review " + getLabelFromContent(this),
                color: colorForMessage,
                duration: 10000,
                onclick: (snack) => {
                    store.commit('openReview', this.id)
                    // store.commit('openNode', this.getTreeId())
                    snack.hide()
                }
            }
        )
        const me = this
        Object.keys(this.trees).forEach(async treeId => {
            store.commit('syncGraphWithNode', treeId)
            // PubSub.publish('syncGraphWithNode', treeId)
            const tree = await Trees.get(treeId)
            tree.calculateNumOverdueAggregation()
        })
    }

    clearOverdueTimeout(){
        clearTimeout(this.markOverdueTimeout)
    }
    /**
     * Used to update tree X and Y coordinates
     * @param prop
     * @param val
     */
    set(prop, val, updateInDB){
        if (this[prop] === val) {
            return;
        }

        this[prop] = val
        try {
            var updates = {}
            updates[prop] = val
            // this.treeRef.update(updates)
            firebase.database().ref('content/' + this.id).update(updates)
        } catch (err) {
            console.error('contentItem.set error', err)
        }
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
        console.log('calculateURIBasedOnParentTreeContentURI called', this)
        const uri = this.primaryParentTreeContentURI + "/" + this.getURIAddition()
        this.set('uri', uri)
        UriContentMap.set(uri, this.id)
    }
        //TODO : make timer for heading be the sum of the time of all the child facts
    resetTimer(){
        this.timer = 0
    }
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
    recalculateProficiencyAggregationForTreeChain(addChangeToDB){
        const treePromises = this.getTreePromises()// again with the way we've designed this only one contentItem should exist per tree and vice versa . . .but i'm keeping this for loop here for now
        const calculationPromises = treePromises.map(async treePromise => {
            const tree = await treePromise
            return tree.recalculateProficiencyAggregation(addChangeToDB)
        })
        return Promise.all(calculationPromises)
    }
    recalculateNumOverdueAggregationForTreeChain(addChangeToDB){
        const treePromises = this.getTreePromises() // again with the way we've designed this only one contentItem should exist per tree and vice versa . . .but i'm keeping this for loop here for now
        const calculationPromises = treePromises.map(async treePromise => {
            const tree = await treePromise
            return tree.calculateNumOverdueAggregation(addChangeToDB)
        })
        return Promise.all(calculationPromises)
    }
    clearInteractions(addChangeToDB){
        const me = this
        delete this.studiers[user.getId()]

        this.proficiency = PROFICIENCIES.UNKNOWN
        delete this.userProficiencyMap[user.getId()]

        this.interactions = []
        delete this.userInteractionsMap[user.getId()]

        this.lastRecordedStrength = INITIAL_LAST_RECORDED_STRENGTH
        delete this.userStrengthMap[user.getId()]

        this.nextReviewTime = 0
        delete this.userReviewTimeMap[user.getId()]

        this.overdue = false
        delete this.userOverdueMap[user.getId()]

        this.timer = 0
        delete this.userTimeMap[user.getId()]

        this.calculateAggregationTimerForTreeChain()
        this.recalculateProficiencyAggregationForTreeChain(addChangeToDB)
        this.recalculateNumOverdueAggregationForTreeChain(addChangeToDB)
        this.resortTrees()
        if (!addChangeToDB) {
            return
        }

        const updates = {
            studiers: this.studiers,
            userProficiencyMap : this.userProficiencyMap,
            userInteractionsMap : this.userInteractionsMap,
            userStrengthMap : this.userStrengthMap,
            userReviewTimeMap : this.userReviewTimeMap,
            userOverdueMap : this.userOverdueMap,
            userTimeMap: this.userTimeMap,
        }

        firebase.database().ref('content/' + this.id).update(updates)
        Object.keys(this.trees).forEach(treeId => {
            store.commit('syncGraphWithNode', treeId)
            // PubSub.publish('syncGraphWithNode', treeId)
        })
    }
    async resortTrees(){
        await Promise.all(
            this.getTreePromises().map(async treePromise => {
                const tree = await treePromise
                await tree.sortLeavesByStudiedAndStrength()
            })
        )
    }
    hasInteractions() {
        return this.interactions.length
    }
    isNew(){
        return !this.hasInteractions()
    }

    getMostRecentInteraction(){
       if (!this.interactions.length){
           return null
       } else {
           return this.interactions[this.interactions.length - 1]
       }
    }
    getTwoInteractionsAgo(){
        if (!this.interactions.length >=2){
            return null
        } else {
            return this.interactions[this.interactions.length - 2]
        }
    }
    getRecentDecibelIncrease(){
        const mostRecentInteraction = this.getMostRecentInteraction()
        const twoInteractionsAgo = this.getTwoInteractionsAgo()

        var newDecibels =  mostRecentInteraction && mostRecentInteraction.currentInteractionStrength || 0
        var oldDecibels = twoInteractionsAgo && twoInteractionsAgo.currentInteractionStrength || 0
        return newDecibels - oldDecibels
    }

    async syncGraphWithNode() {
        // syncGraphWithNode(this.tree.id)
        const treeId = this.getTreeId()
        store.commit('syncGraphWithNode', treeId)
        // PubSub.publish('syncGraphWithNode', this.tree.id)

    }

    async syncTreeChainWithUI(){
        this.syncGraphWithNode()

        const treeId = this.getTreeId()
        const tree = await Trees.get(treeId)

        let parentId = tree.treeData.parentId;
        let parent
        let num = 1
        while (parentId) {
            // syncGraphWithNode(parentId)
            store.commit('syncGraphWithNode', parentId)
            // PubSub.publish('syncGraphWithNode', parentId)
            parent = await Trees.get(parentId)
            parentId = parent.treeData.parentId
            num++
        }
    }

    async addInteraction({proficiency, timestamp}, addChangeToDB){
        this.saveProficiency({proficiency, timestamp}, addChangeToDB) //  this.content.proficiency is already set I think, but not saved in db
        // console.log
        const recentDecibelIncrease = this.getRecentDecibelIncrease()
        console.log('recent decibel increase', recentDecibelIncrease)
        // console.lo
        store.commit('addPoints', recentDecibelIncrease)
        this.messageRecentDecibelIncrease()
        try {
            const proficiencyAncestorsPromise = this.recalculateProficiencyAggregationForTreeChain(addChangeToDB)
            const overdueAncestorsPromise = this.recalculateNumOverdueAggregationForTreeChain(addChangeToDB)

            const updateAncestorsPromises = [proficiencyAncestorsPromise, overdueAncestorsPromise]
            await Promise.all(updateAncestorsPromises)
            await this.syncTreeChainWithUI()
            refreshGraph()
        } catch( err) {
            console.log("contentItem.js err", err)
        }
    }

    saveProficiency({proficiency, timestamp}, addChangeToDB){
        this.proficiency = proficiency
        // !this.inStudyQueue && this.addToStudyQueue()// << i don't even think that is used anymore
        // const timestamp = Date.now()
        this.clearOverdueTimeout()

        //content
        //1. userProficiencyMap
        this.userProficiencyMap[user.getId()] = this.proficiency

        //interactions

        const mostRecentInteraction = this.hasInteractions() ? this.interactions[this.interactions.length - 1] : {currentInteractionStrength: 0, timestamp: nowMilliseconds}
        const nowMilliseconds = timestamp
        let millisecondsSinceLastInteraction = this.hasInteractions() ? nowMilliseconds - mostRecentInteraction.timestamp : 0

        // if this is the first user's interaction and they scored higher than PROFICIENCIES.ONE we can assume they have learned it before. We will simply assume that they last saw it/learned it an hour ago. (e.g. like in a lecture 1 hour ago).
        if (this.proficiency > PROFICIENCIES.ONE && !this.hasInteractions()){
            millisecondsSinceLastInteraction = 60 * 60 * 1000
        }
        const previousInteractionStrength = measurePreviousStrength(mostRecentInteraction.currentInteractionStrength, this.proficiency, millisecondsSinceLastInteraction / 1000) || 0
        const currentInteractionStrength = estimateCurrentStrength(previousInteractionStrength, this.proficiency, millisecondsSinceLastInteraction / 1000) || 0

        const interaction = {timestamp: nowMilliseconds, timeSpent: this.timer, millisecondsSinceLastInteraction, proficiency: this.proficiency, previousInteractionStrength, currentInteractionStrength}
        this.interactions.push(interaction)
        //store user interactions under content
        this.userInteractionsMap[user.getId()] = this.interactions

        //2. userInteractions

        //store contentItem interaction under users
        //3. user addInteraction
        user.addInteraction(this.id, interaction, addChangeToDB)

        //store contentItem strength and timestamp under userStrengthMap
        //4. userStrengthMap
        this.lastRecordedStrength = {value: currentInteractionStrength, timestamp}
        this.userStrengthMap[user.getId()] = this.lastRecordedStrength
        //user review time map //<<<duplicate some of the information in the user database <<< we should really start using a graph or relational db to avoid this . . .
        const millisecondsTilNextReview = 1000 * calculateSecondsTilCriticalReviewTime(currentInteractionStrength)
        this.nextReviewTime = timestamp + millisecondsTilNextReview

        //5. userReviewTimeMap
        this.userReviewTimeMap[user.getId()] = this.nextReviewTime

        this.setOverdueTimeout()

        this.resortTrees()
        // user.addMutation('itemStudied', this.id)
        // store.commit('itemStudied', this.id)

        if (!addChangeToDB) {
            return
        }
        // all updates

        var updates = {
            userProficiencyMap : this.userProficiencyMap,
            userInteractionsMap : this.userInteractionsMap,
            userStrengthMap : this.userStrengthMap,
            userReviewTimeMap : this.userReviewTimeMap
        }

        firebase.database().ref('content/' + this.id).update(updates)
        //set timeout to mark the item overdue when it becomes overdue
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
        if (exerciseKeys.length <= 0) {
            return null
        }
        var keyIndex = Math.floor(Math.random() * exerciseKeys.length)
        const exercise = exerciseKeys[keyIndex]

        return exercise
    }
    getTreeIds(){
        if (!this.trees){
            return []
        }
        return Object.keys(this.trees).filter(treeId => {
            return treeId //removes any "undefined"'s
        })
    }
    getTreeId(){
        const treeIds = this.getTreeIds()
        if (treeIds.length){
            return treeIds[0]
        } else {
            return null
        }

    }
    async getTree(){
        const treeId = this.getTreeId()
        const tree = await this.getTreeId()
        return tree
    }
    getTreePromises(){
        return this.getTreeIds().map(Trees.get)
    }

    messageRecentDecibelIncrease(){
        const decibelIncrease = this.getRecentDecibelIncrease()
        const whenToReview = timeFromNow(this.nextReviewTime)
        let text = ''
        if (whenToReview.indexOf('in' >= 0)){
            text = ' pts, review '
        } else {
            text = ' pts, review in '
        }
        const sign = decibelIncrease >= 0 ? "+" : "" // when less than 0 the JS num will already have a "-" sign
        const msg = sign + Math.round(decibelIncrease) + text + whenToReview
        // const color = getColor
        const color = proficiencyToColor(this.proficiency)
        message({text: msg, color})
    }
    getLabel(){
        return getLabelFromContent(this)
    }
}

export function getLabelFromContent(content) {
    switch (content.type){
        case "fact":
            return content.question
        case "heading":
            return content.title
        case "skill":
            return content.title
    }
}
