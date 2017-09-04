import user from './user'
import md5 from 'md5'
import firebase from './firebaseService.js';
const treesRef = firebase.database().ref('trees');
const trees = {};
import {Trees} from './trees.js'
import ContentItems from './contentItems'
import {syncGraphWithNode}  from '../components/knawledgeMap/knawledgeMap'
import timers from './timers'
import {PROFICIENCIES} from "../components/proficiencyEnum";

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
        var treeObj
        if (arguments[0] && typeof arguments[0] === 'object'){
            treeObj = arguments[0]
            loadObject(treeObj, this)
            this.proficiencyStats = this.userProficiencyStatsMap && this.userProficiencyStatsMap[user.getId()] || unknownProficiencyStats
            return
        }

        this.contentId = contentId
        this.contentType = contentType
        this.parentId = parentId;
        this.children = {};
        this.userProficiencyStatsMap = {}
        this.proficiencyStats = this.userProficiencyStatsMap && this.userProficiencyStatsMap[user.getId()] || unknownProficiencyStats

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
    /**
     * Add a child tree to this tree
     * @param treeId
     */
    addChild(treeId) {
        // this.treeRef.child('/children').push(treeId)
        var children = this.children || {}
        children[treeId] = true
        var updates = {
            children
        }
        firebase.database().ref('trees/' +this.id).update(updates)
    }

    async removeAndDisconnectFromParent(){
        const me = this
        const parentTree = await Trees.get(this.parentId)
        parentTree.removeChild(me.id)
        this.remove()

    }
    remove() {
        console.log(this.id, ": tree . remove called")
        const me = this
        ContentItems.remove(this.contentId)
        Trees.remove(this.id)
        const removeChildPromises = this.children ?
            Object.keys(this.children)
            .map(Trees.get)
            .map(async childPromise => {
                const child = await childPromise
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
        console.log(this.id, "changeParent: this parent id is", this.parentId)
        this.parentId = newParentId
        firebase.database().ref('trees/' + this.id).update({
            parentId: newParentId
        })
        console.log(this.id, "changeParent: this parent id is NOW", this.parentId)
        this.updatePrimaryParentTreeContentURI()

    }
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
        console.log(this.id, ': set Proficiency Stats called', proficiencyStats)
        this.proficiencyStats = proficiencyStats
        this.userProficiencyStatsMap = this.userProficiencyStatsMap || {}
        this.userProficiencyStatsMap[user.getId()] = this.proficiencyStats

        const updates = {
            userProficiencyStatsMap: this.userProficiencyStatsMap
        }
        firebase.database().ref('trees/' + this.id).update(updates)
        console.log(this.id, ': set Proficiency Stats called')
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

        // console.log('addToX called on', this, ...arguments)
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

        // console.log('addToY called on', this, ...arguments)
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
        console.log(this.id, ':LEAF! proficiencyStats in calculateProficiencyAggergation for leaf are ', proficiencyStats, blankProficiencyStats)
        let contentItem = await ContentItems.get(this.contentId)
        proficiencyStats = addValToProficiencyStats(proficiencyStats, contentItem.proficiency)
        return proficiencyStats
    }
    async calculateProficiencyAggregationForNotLeaf(){
        let proficiencyStats = {...blankProficiencyStats}
        console.log(this.id,this,'NOT LEAF!: proficiency stats right before addObjToProficiencyStats is', JSON.stringify(proficiencyStats), JSON.stringify(blankProficiencyStats),this)
        if (!this.children || !Object.keys(this.children).length) return proficiencyStats
        const children = await Promise.all(
            Object.keys(this.children)
            .map(Trees.get)
            .map(async childPromise => await childPromise)
        )

        children.forEach(child => {
            console.log(this.id,'NOT LEAF! child is ', child.id, ', child proficiencyStats are', JSON.stringify(child.proficiencyStats))
            console.log(this.id,'NOT LEAF! child is ', child.id, ', proficiency stats right before addObjToProficiencyStats is',JSON.stringify( proficiencyStats))
            proficiencyStats = addObjToProficiencyStats(proficiencyStats, child.proficiencyStats)
            console.log(this.id,'NOT LEAF! child is ', child.id, ', proficiency stats right after addObjToProficiencyStats is', JSON.stringify(proficiencyStats))
        })
        return proficiencyStats
    }
    async recalculateProficiencyAggregation(){
        console.log(this.id, "recalculateProficiencyAggregation called")
        let proficiencyStats;
        const isLeaf = await this.isLeaf()
        if (isLeaf){
            proficiencyStats = await this.calculateProficiencyAggregationForLeaf()
        } else {
            proficiencyStats = await this.calculateProficiencyAggregationForNotLeaf()
        }
        this.setProficiencyStats(proficiencyStats)
        console.log(this.id, "stats are", proficiencyStats)

        if (!this.parentId) return
        const parent = await Trees.get(this.parentId)
        return parent.recalculateProficiencyAggregation()
    }
    //
    // async recalculateProficiencyAggregation(){
    //     console.log(this.id,'recalculateProficiencyAggregation called for', this)
    //     const me = this
    //     let proficiencyStats = blankProficiencyStats
    //     const contentItem = await ContentItems.get(this.contentId)
    //     console.log(me.id, 'ContentItems.get called for', this, ' result is', contentItem)
    //
    //     if (contentItem.hasIndividualProficiency()){
    //         console.log(me.id, 'ContentItem has individual proficiency')
    //         let proficiency = contentItem.proficiency;
    //         proficiencyStats = addValToProficiencyStats(proficiencyStats,proficiency)
    //         this.setProficiencyStats(proficiencyStats)
    //     } else {
    //         if (!me.children){ //this shouldn't ever happen tho
    //             this.setProficiencyStats(proficiencyStats)
    //             return
    //         }
    //         // Promise.all(Object.keys(me.children).map(Trees.get))
    //         //     .then(childTrees => childTrees.forEach(tree => {
    //         //
    //         //     }))
    //         Promise.all(Object.keys(me.children).map(Trees.get).map())
    //         // console.log(me.id, 'ContentItem DOES NOT haveindividual proficiency')
    //     // if (me.children){
    //     //     console.log(me.id, 'ContentItem HAS children')
    //     //     let addStatsFromChildrenPromises = Object.keys(me.children).map(childId => {
    //     //         console.log(me.id, 'trees get getting called for child ', childId)
    //     //         return Trees.get(childId).then(childTree => {
    //     //             let recalculateChildProficiencyAggregationPromise = new Promise((resolve, reject) => {
    //     //                 resolve("resolved")
    //     //             })
    //     //             // if (!childTree.proficiencyStats || !Object.keys(childTree.proficiencyStats).length){
    //     //                 recalculateChildProficiencyAggregationPromise = childTree.recalculateProficiencyAggregation()
    //     //                 console.log(me.id, 'recalculateProficiency getting called for child ', childId)
    //     //             // }
    //     //             return recalculateChildProficiencyAggregationPromise.then(() => {
    //     //                 addObjToProficiencyStats(proficiencyStats, childTree.proficiencyStats)
    //     //                 console.log(me.id, 'addObjToProficiencyStats getting called for child ', childId, proficiencyStats, childTree.proficiencyStats)
    //     //             })
    //     //         })
    //     //     })
    //     //     return Promise.all(addStatsFromChildrenPromises).then(() => {
    //     //         me.setProficiencyStats(proficiencyStats)
    //     //         me.set('proficiencyStats', proficiencyStats)
    //     //         return Trees.get(me.parentId).then(parent => {
    //     //             return parent.recalculateProficiencyAggregation()
    //     //         })
    //     //     })
    //     // }
    //     // else {
    //     //     console.log(me.id, 'ContentItem DOES NOT haveindividual proficiency')
    //     // }
    //     }
    //     // contentItem.proficiency
    //
    // }
    //
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
    console.log('args in addObjToProficiencyStats', proficiencyStats, proficiencyObj)
    Object.keys(proficiencyObj).forEach(key => {
        proficiencyStats[key] += proficiencyObj[key]
    })
    return proficiencyStats
}
function addValToProficiencyStats(proficiencyStats, proficiency){
    console.log('addVal to proficiencyStats called', proficiencyStats,proficiency)
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
    console.log('addVal to proficiencyStats finished', proficiencyStats,proficiency)
    return proficiencyStats
}
