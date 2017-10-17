import {user} from './user'
import md5 from 'md5'
import firebase from './firebaseService.js';
const treesRef = firebase.database().ref('trees');
const trees = {};
import {Trees} from './trees.js'
import ContentItems from './contentItems'
import {PROFICIENCIES} from "../components/proficiencyEnum";
import store from "../core/store"

function syncGraphWithNode(treeId){
    store.commit('syncGraphWithNode', treeId)
    // PubSub.publish('syncGraphWithNode', treeId)
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

        const updates = {
            id: this.id,
            contentId,
            contentType,
            parentId,
            x,
            y
        }
        const lookupKey = 'trees/' + this.id
        firebase.database().ref(lookupKey).update(updates)

    }
    getChildIds(){
        if (!this.children){
           return []
        }
        return Object.keys(this.children).filter(childKey => { // this filter is necessary to remove undefined keys
            return childKey
        })
    }
    getChildTreePromises(){
        return this.getChildIds().map(Trees.get) //childId => {
    }
    getChildTrees(){
        return Promise.all(this.getChildTreePromises().map(async childPromise => await childPromise))
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

            const lookupKey = 'trees/' + this.id
            await firebase.database().ref(lookupKey).update(updates)
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

        const updates = {children: this.children}
        const lookupKey = 'trees/' + this.id
        firebase.database().ref(lookupKey).update(updates)
    }

    changeParent(newParentId) {
        this.parentId = newParentId
        const updates = {parentId: newParentId}
        const lookupKey = 'trees/' + this.id
        firebase.database().ref(lookupKey).update(updates)

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
    changeFact(newFactId) {
        this.factId = newFactId
        firebase.database().ref('trees/' + this.id).update({
           factId: newFactId
        })
    }
    async clearChildrenInteractions(){
        console.log(this.id, "clearChildrenInteractions called")
        // const isLeaf = await this.isLeaf()
        if(await this.isLeaf()){
            console.log(this.id, "clearChildrenInteractions THIS IS LEAF")
            user.addMutation('clearInteractions', {timestamp: Date.now(), contentId: this.contentId})
        } else {
            this.getChildTreePromises()
                .map(async treePromise => {
                    const tree = await treePromise
                    tree.clearChildrenInteractions()
                })
        }

    }
    setProficiencyStats(proficiencyStats, addChangeToDB){
        this.proficiencyStats = proficiencyStats
        this.userProficiencyStatsMap = this.userProficiencyStatsMap || {}
        this.userProficiencyStatsMap[user.getId()] = this.proficiencyStats

        if (!addChangeToDB){
            return
        }
        const updates = {
            userProficiencyStatsMap: this.userProficiencyStatsMap
        }
        const lookupKey = 'trees/' + this.id
        
        firebase.database().ref(lookupKey).update(updates)
    }

    setAggregationTimer(timer,addChangeToDB){
        this.aggregationTimer = timer
        this.userAggregationTimerMap = this.userAggregationTimerMap || {}
        this.userAggregationTimerMap[user.getId()] = this.aggregationTimer
        if (!addChangeToDB){
            return
        }
        const updates = {
            userAggregationTimerMap: this.userAggregationTimerMap
        }
        const lookupKey = 'trees/' + this.id
        
        firebase.database().ref(lookupKey).update(updates)
    }
    setNumOverdue(numOverdue, addChangeToDB){
        this.numOverdue = numOverdue
        this.userNumOverdueMap = this.userNumOverdueMap || {}
        this.userNumOverdueMap[user.getId()] = this.numOverdue
        if (!addChangeToDB){
            return
        }
        const updates = {
            userNumOverdueMap: this.userNumOverdueMap
        }
        const lookupKey = 'trees/' + this.id
        
        firebase.database().ref(lookupKey).update(updates)
    }
    /**
     * Change the content of a given node ("Tree")
     * Available content types currently header and fact
     */
    changeContent(contentId, contentType) {
        this.contentId = contentId;
        this.contentType = contentType;
        const updates = {
            contentId,
            contentType
        }
        const lookupKey = 'trees/' + this.id
        
        firebase.database().ref(lookupKey).update(updates)
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
        const lookupKey = 'trees/' + this.id
        firebase.database().ref(lookupKey).update(updates)
        this[prop] = val
    }
    setLocal(prop, val){
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
    async recalculateProficiencyAggregation(addChangeToDB){
        let proficiencyStats;
        const isLeaf = await this.isLeaf()
        if (isLeaf){
            proficiencyStats = await this.calculateProficiencyAggregationForLeaf()
        } else {
            proficiencyStats = await this.calculateProficiencyAggregationForNotLeaf()
        }
        this.setProficiencyStats(proficiencyStats,addChangeToDB)
        store.commit('syncGraphWithNode', this.id)

        // PubSub.publish('syncGraphWithNode', this.id)
        if (!this.parentId) return
        const parent = await Trees.get(this.parentId)
        return parent.recalculateProficiencyAggregation(addChangeToDB)
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
    async calculateAggregationTimer(addChangeToDB){
        let timer;
        const isLeaf = await this.isLeaf()
        if (isLeaf){
            timer = await this.calculateAggregationTimerForLeaf()
        } else {
            timer = await this.calculateAggregationTimerForNotLeaf()
        }
        this.setAggregationTimer(timer,addChangeToDB)

        if (!this.parentId) return
        const parent = await Trees.get(this.parentId)
        return parent.calculateAggregationTimer()
    }


    async calculateNumOverdueAggregationLeaf(){
        let contentItem = await ContentItems.get(this.contentId)
        const overdue = contentItem.overdue ? 1 : 0
        return overdue
    }
    async calculateNumOverdueAggregationNotLeaf(){
        const children = await this.getChildTrees()// await Promise.all(
        let numOverdue = children.reduce((sum, child) => sum + (+child.numOverdue || 0), 0)

        return numOverdue
        //TODO start storing numOverdue in db - the way we do with the other aggregations
    }
    async calculateNumOverdueAggregation(addChangeToDB){
        let numOverdue;
        const isLeaf = await this.isLeaf()
        try {
            if (isLeaf){
                numOverdue = await this.calculateNumOverdueAggregationLeaf()
            } else {
                numOverdue = await this.calculateNumOverdueAggregationNotLeaf()
            }
        } catch (err){
            console.error('calcNumOverdue promise err is', err)
        }
        this.setNumOverdue(numOverdue, addChangeToDB)

        if (!this.parentId) return
        const parent = await Trees.get(this.parentId)
        return parent.calculateNumOverdueAggregation(addChangeToDB)

    }
    //returns a list of contentItems that are all on leaf nodes
    async getLeaves(){
        // console.log(this.id, " 1: getLeaves called ")
        if (!this.leaves.length){
            // console.log(this.id, " 2: getLeaves. this.leaves has no length, this.leaves is ", this.leaves)
            await this.recalculateLeaves()
        }
        // console.log(this.id, " 3: getLeaves. this.leaves after recalculateLeaves is", this.leaves)
        return this.leaves
    }
    async recalculateLeavesLeaf(){
        let leaves = []
        try {
            if (this.contentId){
                leaves = [await this.getContentItem()]
            }
        } catch(err){
            console.error(err)
        }
        return leaves
    }
    async recalculateLeavesNotLeaf(){
        let leaves = []
        await Promise.all(
            this.getChildIds().map(async childId => {
                try{
                    const child = await Trees.get(childId)
                    leaves.push(... await child.getLeaves())
                } catch (err){

                }
            })
        )
        return leaves
    }
    //TODO: FIX: this can get called multiple times simultaneously if like three children simultaneously call parent.recalculateLeaves()
    async recalculateLeaves(){
        // console.log(this.id, " recalculateLeaves called")
        let leaves = []
        const isLeaf = await this.isLeaf()
        if (isLeaf){
            leaves = await this.recalculateLeavesLeaf()
        } else {
            leaves = await this.recalculateLeavesNotLeaf()
        }
        this.leaves = leaves
    }
    async sortLeavesByStudiedAndStrength(){
        // console.log(this.id, " sortLeavesByStudiedAndStrength called")
        const leaves = await this.getLeaves()
        const studiedLeaves = leaves
           .filter(leaf => leaf.hasInteractions)
           .sort((a,b) => {
                //lowest decibels first
                return a.lastRecordedStrength.value > b.lastRecordedStrength.value ? 1: a.lastRecordedStrength.value < b.lastRecordedStrength.value ? -1 : 0
           })
        const overdueLeaves = studiedLeaves.filter(leaf => leaf.overdue)
        const notOverdueLeaves = studiedLeaves.filter(leaf => !leaf.overdue)

        const notStudiedLeaves = this.leaves.filter(leaf => !leaf.hasInteractions)
        this.leaves = [...overdueLeaves, ...notStudiedLeaves, ...notOverdueLeaves]
        this.leaves = removeDuplicatesById(this.leaves)
        // console.log(this.id, " sortLeavesByStudiedAndStrength, this sortedLeaves are", this.sortedLeaves)
        this.leaves.forEach(leaf => {
            // console.log(this.id, " has a leaf ", leaf.id, " with strength of ", leaf.lastRecordedStrength.value)
        })
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
        return this.leaves.length
    }
    /*should only be called after sorted*/
    areNewOrOverdueItems(){
        if (!this.areItemsToStudy()) {return false}
        const firstItem = this.leaves[0]
        return firstItem.isNew() || firstItem.overdue
    }
    getNextItemIdToStudy(){
        return this.leaves[0].id
    }
    setActive(){
        this.active = true
        this.syncGraphWithNode()
    }
    setInactive(){
        this.active = false
        this.syncGraphWithNode()
    }
    syncGraphWithNode(){
        syncGraphWithNode(this.id)
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
function removeDuplicatesById(list){
    const newList = []
    const usedIds = []
    list.forEach(item => {
        if (usedIds.indexOf(item.id) > -1) return
        newList.push(item)
        usedIds.push(item.id)
    })
    return newList
}
