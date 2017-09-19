import user from './user'
import md5 from 'md5'
import firebase from './firebaseService.js';
const treesRef = firebase.database().ref('trees');
const trees = {};
import {Trees} from './trees.js'
import ContentItems from './contentItems'
import {PROFICIENCIES} from "../components/proficiencyEnum";
import store from "../core/store"

function syncGraphWithNode(treeId){
    PubSub.publish('syncGraphWithNode', treeId)
}
function loadObject(treeObj, self){
    Object.keys(treeObj).forEach(key => self[key] = treeObj[key])
}
const blankProficiencyStats = {
    UNKNOWN: 0,
    ONE: 0,
    TWO: 0,
    THREE: 0,
    FOUR: 0,
}
const unknownProficiencyStats = {
    UNKNOWN: 1,
    ONE: 0,
    TWO: 0,
    THREE: 0,
    FOUR: 0,
}

export class Tree {

    constructor(contentId, contentType, parentId, parentDegree, x, y) {
        this.leaves = []
        this.sortedLeaves = []
        var treeObj
        if (arguments[0] && typeof arguments[0] === 'object'){
            treeObj = arguments[0]
            loadObject(treeObj, this)
            this.proficiencyStats = this.userProficiencyStatsMap && this.userProficiencyStatsMap[user.getId()] || unknownProficiencyStats
            this.aggregationTimer = this.userAggregationTimerMap && this.userAggregationTimerMap[user.getId()] || 0
            this.numOverdue = this.userNumOverdueMap && this.userNumOverdueMap[user.getId()] || 0
            return
        }

        this.contentId = contentId
        this.contentType = contentType
        this.parentId = parentId;
        this.children = {};

        this.userProficiencyStatsMap = {}
        this.userAggregationTimerMap = {}
        this.userNumOverdueMap = {}
        this.proficiencyStats = this.userProficiencyStatsMap && this.userProficiencyStatsMap[user.getId()] || unknownProficiencyStats
        this.aggregationTimer = this.userAggregationTimerMap && this.userAggregationTimerMap[user.getId()] || 0
        this.userNumOverdueMap = this.userNumOverdueMap && this.userNumOverdueMap[user.getId()] || 0

        this.x = x
        this.y = y

        treeObj = {contentType: this.contentType, contentId: this.contentId, parentId: parentId, children: this.children}
        this.id = md5(JSON.stringify(treeObj))
        if (typeof arguments[0] === 'object'){//TODO: use a boolean to determine if the tree already exists. or use Trees.get() and Trees.create() separate methods, so we aren't getting confused by the same constructor
            return
        }
        firebase.database().ref('trees/' + this.id).update(
            {
                id: this.id,
                contentId,
                contentType,
                parentId,
                x,
                y
            }
        )
    }
    getChildKeys(){
        if (!this.children){
           return []
        }
        return Object.keys(this.children).filter(childKey => {
            return childKey
        })
    }
    /**
     * Add a child tree to this tree
     * @param treeId
     */
    async addChild(treeId) {
        // this.treeRef.child('/children').push(treeId)
        this.children = this.children || {}
        this.children[treeId] = true
        var updates = {
            children: this.children
        }
        try {
            await firebase.database().ref('trees/' +this.id).update(updates)
        } catch (err){
            console.error(' error for addChild firebase call', err)
        }
        this.updatePrimaryParentTreeContentURI()
        this.recalculateProficiencyAggregation()
        this.calculateAggregationTimer()
        this.calculateNumOverdueAggregation()
    }

    async removeAndDisconnectFromParent(){
        const me = this
        const parentTree = await Trees.get(this.parentId)
        parentTree.removeChild(me.id)
        this.remove()

    }
    remove() {
        console.log(this.id, "remove called!")
        const me = this
        ContentItems.remove(this.contentId)
        Trees.remove(this.id)
        console.log(this.id, "remove about to be called for", JSON.stringify(this.children))
        const removeChildPromises = this.children ?
            Object.keys(this.children)
            .map(Trees.get)
            .map(async childPromise => {
                const child = await childPromise
                console.log(this.id, "child just received is ", child, child.id)
                child.remove()
            })
         : []
        return Promise.all(removeChildPromises)
    }

    removeChild(childId) {
        if (!this.children || !this.children[childId]){
            return
        }
        delete this.children[childId]

        firebase.database().ref('trees/' + this.id).update({children: this.children})
    }

    changeParent(newParentId) {
        this.parentId = newParentId
        firebase.database().ref('trees/' + this.id).update({
            parentId: newParentId
        })
        this.updatePrimaryParentTreeContentURI()
        this.recalculateProficiencyAggregation()
        this.calculateAggregationTimer()
    }
    // async sync
    async updatePrimaryParentTreeContentURI(){
        const [parentTree, contentItem] = await Promise.all([Trees.get(this.parentId), ContentItems.get(this.contentId)])
        const parentTreeContentItem = await ContentItems.get(parentTree.contentId)
        // return ContentItems.get(parentTree.contentId).then(parentTreeContentItem => {
        contentItem.set('primaryParentTreeContentURI', parentTreeContentItem.uri)
        contentItem.calculateURIBasedOnParentTreeContentURI()

        //update for all the children as well
        const childUpdatePromises = this.children ? Object.keys(this.children).map(async childId => {
            const childTree = await Trees.get(childId)
            return childTree.updatePrimaryParentTreeContentURI()
        }) : []
        return Promise.all(childUpdatePromises)
    }
    changeFact(newfactid) {
        this.factId = newfactid
        firebase.database().ref('trees/' + this.id).update({
           factId: newfactid
        })
    }
    setProficiencyStats(proficiencyStats){
        this.proficiencyStats = proficiencyStats
        this.userProficiencyStatsMap = this.userProficiencyStatsMap || {}
        this.userProficiencyStatsMap[user.getId()] = this.proficiencyStats

        const updates = {
            userProficiencyStatsMap: this.userProficiencyStatsMap
        }
        firebase.database().ref('trees/' + this.id).update(updates)
    }

    setAggregationTimer(timer){
        this.aggregationTimer = timer
        this.userAggregationTimerMap = this.userAggregationTimerMap || {}
        this.userAggregationTimerMap[user.getId()] = this.aggregationTimer
        const updates = {
            userAggregationTimerMap: this.userAggregationTimerMap
        }
        firebase.database().ref('trees/' + this.id).update(updates)
    }
    setNumOverdue(numOverdue){
        this.numOverdue = numOverdue
        this.userNumOverdueMap = this.userNumOverdueMap || {}
        this.userNumOverdueMap[user.getId()] = this.numOverdue
        const updates = {
            userNumOverdueMap: this.userNumOverdueMap
        }
        firebase.database().ref('trees/' + this.id).update(updates)
    }
    /**
     * Change the content of a given node ("Tree")
     * Available content types currently header and fact
     */
    changeContent(contentId, contentType) {
        this.contentId = contentId;
        this.contentType = contentType;
        firebase.database().ref('trees/' + this.id).update({
            contentId,
            contentType
        });
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
        firebase.database().ref('trees/' +this.id).update(updates)
        this[prop] = val
    }
    addToX({recursion,deltaX}={recursion:false, deltaX: 0}){
       var newX = this.x + deltaX
       this.set('x', newX)

       syncGraphWithNode(this.id)
       if (!recursion) return

        this.children && Object.keys(this.children).forEach(async childId => {
            const child = await Trees.get(childId)
            child.addToX({recursion: true, deltaX})
        })
    }
    addToY({recursion,deltaY}={recursion:false, deltaY: 0}){
        var newY = this.y + deltaY
        this.set('y', newY)

        syncGraphWithNode(this.id)
        if (!recursion) return

        this.children && Object.keys(this.children).forEach(async childId => {
            const child = await Trees.get(childId)
            child.addToY({recursion: true, deltaY})
        })

    }

    async isLeaf(){
        const content = await ContentItems.get(this.contentId)
        return content.isLeafType()
    }
    async calculateProficiencyAggregationForLeaf(){
        let proficiencyStats = {...blankProficiencyStats}
        let contentItem = await ContentItems.get(this.contentId)
        proficiencyStats = addValToProficiencyStats(proficiencyStats, contentItem.proficiency)
        return proficiencyStats
    }
    async calculateProficiencyAggregationForNotLeaf(){
        let proficiencyStats = {...blankProficiencyStats}
        if (!this.children || !Object.keys(this.children).length) return proficiencyStats
        const children = await Promise.all(
            Object.keys(this.children)
            .map(Trees.get)
            .map(async childPromise => await childPromise)
        )

        children.forEach(child => {
            proficiencyStats = addObjToProficiencyStats(proficiencyStats, child.proficiencyStats)
        })
        return proficiencyStats
    }
    async recalculateProficiencyAggregation(){
        let proficiencyStats;
        const isLeaf = await this.isLeaf()
        if (isLeaf){
            proficiencyStats = await this.calculateProficiencyAggregationForLeaf()
        } else {
            proficiencyStats = await this.calculateProficiencyAggregationForNotLeaf()
        }
        this.setProficiencyStats(proficiencyStats)

        if (!this.parentId) return
        const parent = await Trees.get(this.parentId)
        return parent.recalculateProficiencyAggregation()
    }

    async calculateAggregationTimerForLeaf(){
        let contentItem = await ContentItems.get(this.contentId)
        return contentItem.timer
    }
    async calculateAggregationTimerForNotLeaf(){
        const me = this
        let timer = 0
        if (!this.children || !Object.keys(this.children).length) return timer
        const children = await Promise.all(
            Object.keys(this.children)
                .map(Trees.get)
                .map(async childPromise => await childPromise)
        )

        children.forEach(child => {
            timer += +child.aggregationTimer
        })
        return timer
    }
    async calculateAggregationTimer(){
        let timer;
        const isLeaf = await this.isLeaf()
        if (isLeaf){
            timer = await this.calculateAggregationTimerForLeaf()
        } else {
            timer = await this.calculateAggregationTimerForNotLeaf()
        }
        this.setAggregationTimer(timer)

        if (!this.parentId) return
        const parent = await Trees.get(this.parentId)
        return parent.calculateAggregationTimer()
    }


    async calculateNumOverdueAggregationLeaf(){
        let contentItem = await ContentItems.get(this.contentId)
        return contentItem.overdue ? 1 : 0
    }
    async calculateNumOverdueAggregationNotLeaf(){
        const me = this
        let numOverdue = 0
        if (!this.children || !Object.keys(this.children).length) return numOverdue
        const children = await Promise.all(
            this.getChildKeys()
                .map(Trees.get)
                .map(async childPromise => await childPromise)
        )

        children.forEach(child => {
            numOverdue += +child.numOverdue || 0
        })
        return numOverdue
        //TODO start storing numOverdue in db - the way we do with the other aggregations
    }
    async calculateNumOverdueAggregation(){
        let numOverdue;
        const isLeaf = await this.isLeaf()
        if (isLeaf){
            numOverdue = await this.calculateNumOverdueAggregationLeaf()
        } else {
            numOverdue = await this.calculateNumOverdueAggregationNotLeaf()
        }
        this.setNumOverdue(numOverdue)

        if (!this.parentId) return
        const parent = await Trees.get(this.parentId)
        return parent.calculateNumOverdueAggregation()

    }
    //returns a list of contentItems that are all on leaf nodes
    async getLeaves(){
        if (!this.leaves.length){
            await this.recalculateLeaves()
        }
        return this.leaves
    }
    async recalculateLeaves(){
        let leaves = []
        const isLeaf = await this.isLeaf()
        if (isLeaf){
            try {
                if (this.contentId){
                    leaves = [await this.getContentItem()]
                }
            } catch(err){
                leaves = []
            }
        } else {
            // console.log(this.id, "NOT LEAF!")
            await Promise.all(
                Object.keys(this.children).map(async childId => {
                    try{
                        const child = await Trees.get(childId)
                        // console.log('leaves before concat are', leaves)
                        leaves.push(... await child.getLeaves())
                        // console.log('leaves after concat are', leaves)
                    } catch (err){

                    }
                })
            )
        }
        // console.log('leaves being return are', leaves)
        this.leaves = leaves

    }
    async sortLeavesByStudiedAndStrength(){
        const studiedLeaves = this.leaves
           .filter(leaf => leaf.hasInteractions)
           .sort((a,b) => {
                //lowest decibels first
                return a.lastRecordedStrength.value < b.lastRecordedStrength.value ? 1: a.lastRecordedStrength.value > b.lastRecordedStrength.value ? -1 : 0
           })
        const notStudiedLeaves = this.leaves.filter(leaf => !leaf.hasInteractions)
        this.sortedLeaves = [...studiedLeaves, ...notStudiedLeaves]
        if (this.parentId){
            const parent = await Trees.get(this.parentId)
            parent.sortLeavesByStudiedAndStrength()
        }
    }
    calculateOverdueLeaves(){

    }
    async getContentItem(){
        if (!this.contentId){
            return null
        }
        const contentItem = await ContentItems.get(this.contentId)
        return contentItem
    }
    areItemsToStudy(){
        return this.sortedLeaves.length
    }
    getNextItemToStudy(){
        return this.sortedLeaves[0]

    }
}
//TODO: get typeScript so we can have a schema for treeObj
//treeObj  example
/*
 parentId: parentTreeId,
 factId: fact.id,
 x: parseInt(currentNewChildTree.x),
 y: parseInt(currentNewChildTree.y),
 children: {},
 label: fact.question + ' ' + fact.answer,
 size: 1,
 color: Globals.existingColor,
 type: 'tree'
 */
//invoke like a constructor - new Tree(parentId, factId)

function addObjToProficiencyStats(proficiencyStats, proficiencyObj){
    Object.keys(proficiencyObj).forEach(key => {
        proficiencyStats[key] += proficiencyObj[key]
    })
    return proficiencyStats
}
function addValToProficiencyStats(proficiencyStats, proficiency){
    if (proficiency <= PROFICIENCIES.UNKNOWN){
        proficiencyStats.UNKNOWN++
    }
    else if (proficiency <= PROFICIENCIES.ONE){
        proficiencyStats.ONE++
    }
    else if (proficiency <= PROFICIENCIES.TWO){
        proficiencyStats.TWO++
    }
    else if (proficiency <= PROFICIENCIES.THREE){
        proficiencyStats.THREE++
    }
    else if (proficiency <= PROFICIENCIES.FOUR){
        proficiencyStats.FOUR++
    }
    return proficiencyStats
}
