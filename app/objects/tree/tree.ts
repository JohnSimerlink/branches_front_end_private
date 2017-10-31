/* tslint:disable object-literal-sort-keys */
import md5 from 'md5'
import {error, log} from '../../core/log';
import store from '../../core/store'
import {IContentItem} from '../contentItem/IContentItem';
import ContentItems from '../contentItems'
import firebase from '../firebaseService.js';
import {IMutable, ITreeMutation, TreeMutationTypes} from '../mutations/IMutable'
import {Trees} from '../trees.js'
import {user} from '../user'
import {ITree} from './ITree';
import { addObjToProficiencyStats, incrementProficiencyStatsCategory } from './proficiencyStats'

function syncGraphWithNode(treeId) {
    store.commit('syncGraphWithNode', treeId)
    // PubSub.publish('syncGraphWithNode', treeId)
}
function loadObject(treeObj, self) {
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
// interface ITree {
//
// }
export class Tree implements IMutable<ITreeMutation> {
    public id;
    public parentId;
    public active;
    public leaves;
    public children;
    public proficiencyStats;
    public numOverdue;
    public contentId;
    public aggregationTimer;
    public x;
    public y;
    public userNumOverdueMap;
    public userProficiencyStatsMap;
    public userAggregationTimerMap;
    public contentType;
    public mutations;

    constructor(contentId, contentType, parentId, parentDegree, x, y) {
        this.leaves = []
        let treeObj
        if (arguments[0] && typeof arguments[0] === 'object') {
            treeObj = arguments[0]
            loadObject(treeObj, this)
            this.proficiencyStats = this.userProficiencyStatsMap
                && this.userProficiencyStatsMap[user.getId()] || unknownProficiencyStats
            this.aggregationTimer = this.userAggregationTimerMap && this.userAggregationTimerMap[user.getId()] || 0
            this.numOverdue = this.userNumOverdueMap && this.userNumOverdueMap[user.getId()] || 0
            return
        }

        this.contentId = contentId
        this.contentType = contentType
        this.parentId = parentId;
        this.children = {};
        this.mutations = []

        this.userProficiencyStatsMap = {}
        this.userAggregationTimerMap = {}
        this.userNumOverdueMap = {}
        this.proficiencyStats = this.userProficiencyStatsMap
            && this.userProficiencyStatsMap[user.getId()] || unknownProficiencyStats
        this.aggregationTimer = this.userAggregationTimerMap && this.userAggregationTimerMap[user.getId()] || 0
        this.userNumOverdueMap = this.userNumOverdueMap && this.userNumOverdueMap[user.getId()] || 0

        this.x = x
        this.y = y

        treeObj = {contentType: this.contentType, contentId: this.contentId, parentId, children: this.children}
        this.id = md5(JSON.stringify(treeObj))
        if (typeof arguments[0] === 'object') {
            /*
         TODO: use a boolean to determine if the tree already exists.
         or use Trees.get() and Trees.create() separate methods,
          so we aren't getting confused by the same constructor
        */
            return
        }

        const updates = {
            id: this.id,
            contentId,
            contentType,
            parentId,
            x,
            y,
        }
        const lookupKey = 'trees/' + this.id
        firebase.database().ref(lookupKey).update(updates)
    }
    public getChildIds() {
        if (!this.children) {
           return []
        }
        return Object.keys(this.children).filter(childKey => { // this filter is necessary to remove undefined keys
            return childKey
        })
    }
    public getChildTreePromises() {
        return this.getChildIds().map(Trees.get) // childId => {
    }
    public getChildTrees() {
        return Promise.all(this.getChildTreePromises().map(async childPromise => await childPromise))
    }
    /**
     * Add a child tree to this tree
     * @param treeId
     */
    public async addChild(treeId) {
        // this.treeRef.child('/children').push(treeId)
        this.children = this.children || {}
        this.children[treeId] = true
        const updates = {
            children: this.children,
        }
        try {
            const lookupKey = 'trees/' + this.id
            await firebase.database().ref(lookupKey).update(updates)
        } catch (err) {
            error(' error for addChild firebase call', err)
        }
        this.updatePrimaryParentTreeContentURI()
        this.recalculateProficiencyAggregation()
        this.calculateAggregationTimer()
        this.calculateNumOverdueAggregation()
    }

    public async removeAndDisconnectFromParent() {
        const me = this
        const parentTree = await Trees.get(this.parentId)
        parentTree.removeChild(me.id)
        this.remove()

    }
    public remove() {
        log(this.id, 'remove called!')
        const me = this
        ContentItems.remove(this.contentId)
        Trees.remove(this.id)
        log(this.id, 'remove about to be called for', JSON.stringify(this.children))
        const removeChildPromises = this.children ?
            Object.keys(this.children)
            .map(Trees.get)
            .map(async (childPromise: Promise<Tree>) => {
                const child: Tree = await childPromise
                log(this.id, 'child just received is ', child, child.id)
                child.remove()
            })
         : []
        return Promise.all(removeChildPromises)
    }

    public removeChild(childId) {
        if (!this.children || !this.children[childId]) {
            return
        }
        delete this.children[childId]

        const updates = {children: this.children}
        const lookupKey = 'trees/' + this.id
        firebase.database().ref(lookupKey).update(updates)
    }

    public changeParent(newParentId) {
        this.parentId = newParentId
        const updates = {parentId: newParentId}
        const lookupKey = 'trees/' + this.id
        firebase.database().ref(lookupKey).update(updates)

        this.updatePrimaryParentTreeContentURI()
        this.recalculateProficiencyAggregation()
        this.calculateAggregationTimer()
    }
    // async sync
    public async updatePrimaryParentTreeContentURI() {
        const [parentTree, contentItem] = await Promise.all(
            [Trees.get(this.parentId), ContentItems.get(this.contentId)]
        )
        const parentTreeContentItem = await ContentItems.get(parentTree.contentId)
        // return ContentItems.get(parentTree.contentId).then(parentTreeContentItem => {
        contentItem.set('primaryParentTreeContentURI', parentTreeContentItem.uri)
        contentItem.calculateURIBasedOnParentTreeContentURI()

        // update for all the children as well
        const childUpdatePromises = this.children ? Object.keys(this.children).map(async childId => {
            const childTree = await Trees.get(childId)
            return childTree.updatePrimaryParentTreeContentURI()
        }) : []
        return Promise.all(childUpdatePromises)
    }
    public async clearChildrenInteractions() {
        log(this.id, 'clearChildrenInteractions called')
        // const isLeaf = await this.isLeaf()
        if (await this.isLeaf()) {
            log(this.id, 'clearChildrenInteractions THIS IS LEAF')
            user.addMutation('clearInteractions', {timestamp: Date.now(), contentId: this.contentId})
        } else {
            this.getChildTreePromises()
                .map(async treePromise => {
                    const tree = await treePromise
                    tree.clearChildrenInteractions()
                })
        }

    }
    public setProficiencyStats(proficiencyStats, addChangeToDB) {
        this.proficiencyStats = proficiencyStats
        this.userProficiencyStatsMap = this.userProficiencyStatsMap || {}
        this.userProficiencyStatsMap[user.getId()] = this.proficiencyStats

        if (!addChangeToDB) {
            return
        }
        const updates = {
            userProficiencyStatsMap: this.userProficiencyStatsMap,
        }
        const lookupKey = 'trees/' + this.id

        firebase.database().ref(lookupKey).update(updates)
    }

    public setAggregationTimer(timer, addChangeToDB) {
        this.aggregationTimer = timer
        this.userAggregationTimerMap = this.userAggregationTimerMap || {}
        this.userAggregationTimerMap[user.getId()] = this.aggregationTimer
        if (!addChangeToDB) {
            return
        }
        const updates = {
            userAggregationTimerMap: this.userAggregationTimerMap,
        }
        const lookupKey = 'trees/' + this.id

        firebase.database().ref(lookupKey).update(updates)
    }
    public setNumOverdue(numOverdue, addChangeToDB) {
        this.numOverdue = numOverdue
        this.userNumOverdueMap = this.userNumOverdueMap || {}
        this.userNumOverdueMap[user.getId()] = this.numOverdue
        if (!addChangeToDB) {
            return
        }
        const updates = {
            userNumOverdueMap: this.userNumOverdueMap,
        }
        const lookupKey = 'trees/' + this.id

        firebase.database().ref(lookupKey).update(updates)
    }
    /**
     * Change the content of a given node ("Tree")
     * Available content types currently header and fact
     */
    public changeContent(contentId, contentType) {
        this.contentId = contentId;
        this.contentType = contentType;
        const updates = {
            contentId,
            contentType,
        }
        const lookupKey = 'trees/' + this.id

        firebase.database().ref(lookupKey).update(updates)
    }

    /**
     * Used to update tree X and Y coordinates
     * @param prop
     * @param val
     */
    public set(prop, val) {
        if (this[prop] === val) {
            return;
        }

        const updates = {}
        updates[prop] = val
        // this.treeRef.update(updates)
        const lookupKey = 'trees/' + this.id
        firebase.database().ref(lookupKey).update(updates)
        this[prop] = val
    }
    public setLocal(prop, val) {
        this[prop] = val
    }
    public addToX({recursion, deltaX}= {recursion: false, deltaX: 0}) {
       const newX = this.x + deltaX
       this.set('x', newX)

       syncGraphWithNode(this.id)
       if (!recursion) {
         return
       }

       this.getChildIds().forEach(async childId => {
            const child = await Trees.get(childId)
            child.addToX({recursion: true, deltaX})
        })
    }
    public addToY({recursion, deltaY}= {recursion: false, deltaY: 0}) {
        const newY = this.y + deltaY
        this.set('y', newY)

        syncGraphWithNode(this.id)
        if (!recursion) { return }
        this.getChildIds().forEach(async childId => {
            const child = await Trees.get(childId)
            child.addToY({recursion: true, deltaY})
        })
    }

    public async isLeaf() {
        const content = await ContentItems.get(this.contentId)
        return content.isLeafType()
    }
    public async calculateProficiencyAggregationForLeaf() {
        let proficiencyStats = {...blankProficiencyStats}
        const contentItem = await ContentItems.get(this.contentId)
        proficiencyStats = incrementProficiencyStatsCategory(proficiencyStats, contentItem.proficiency)
        return proficiencyStats
    }
    public async calculateProficiencyAggregationForNotLeaf() {
        let proficiencyStats = {...blankProficiencyStats}
        if (!this.children || !Object.keys(this.children).length) { return proficiencyStats }
        const children = await Promise.all(
            Object.keys(this.children)
            .map(Trees.get)
            .map(async childPromise => await childPromise),
        )

        children.forEach(child => {
            proficiencyStats = addObjToProficiencyStats(proficiencyStats, child.proficiencyStats)
        })
        return proficiencyStats
    }
    public async recalculateProficiencyAggregation(addChangeToDB = false) {
        let proficiencyStats;
        const isLeaf = await this.isLeaf()
        if (isLeaf) {
            proficiencyStats = await this.calculateProficiencyAggregationForLeaf()
        } else {
            proficiencyStats = await this.calculateProficiencyAggregationForNotLeaf()
        }
        this.setProficiencyStats(proficiencyStats, addChangeToDB)
        store.commit('syncGraphWithNode', this.id)

        // PubSub.publish('syncGraphWithNode', this.id)
        if (!this.parentId) { return }
        const parent = await Trees.get(this.parentId)
        return parent.recalculateProficiencyAggregation(addChangeToDB)
    }

    public async calculateAggregationTimerForLeaf() {
        const contentItem = await ContentItems.get(this.contentId)
        return contentItem.timer
    }
    public async calculateAggregationTimerForNotLeaf() {
        const me = this
        let timer = 0
        if (!this.children || !Object.keys(this.children).length) { return timer }
        const children = await Promise.all(
            Object.keys(this.children)
                .map(Trees.get)
                .map(async childPromise => await childPromise),
        )

        children.forEach((child: Tree ) => {
            timer += +child.aggregationTimer
        })
        return timer
    }
    public async calculateAggregationTimer(addChangeToDB = false) {
        let timer;
        const isLeaf = await this.isLeaf()
        if (isLeaf) {
            timer = await this.calculateAggregationTimerForLeaf()
        } else {
            timer = await this.calculateAggregationTimerForNotLeaf()
        }
        this.setAggregationTimer(timer, addChangeToDB)

        if (!this.parentId) { return }
        const parent = await Trees.get(this.parentId)
        return parent.calculateAggregationTimer()
    }

    public async calculateNumOverdueAggregationLeaf() {
        const contentItem = await ContentItems.get(this.contentId)
        const overdue = contentItem.overdue ? 1 : 0
        return overdue
    }
    public async calculateNumOverdueAggregationNotLeaf() {
        const children = await this.getChildTrees()// await Promise.all(
        const numOverdue = children.reduce((sum, child) => sum + (+child.numOverdue || 0), 0)

        return numOverdue
        // TODO start storing numOverdue in db - the way we do with the other aggregations
    }
    public async calculateNumOverdueAggregation(addChangeToDB = false) {
        let numOverdue;
        const isLeaf = await this.isLeaf()
        try {
            if (isLeaf) {
                numOverdue = await this.calculateNumOverdueAggregationLeaf()
            } else {
                numOverdue = await this.calculateNumOverdueAggregationNotLeaf()
            }
        } catch (err) {
            error('calcNumOverdue promise err is', err)
        }
        this.setNumOverdue(numOverdue, addChangeToDB)

        if (!this.parentId) { return }
        const parent = await Trees.get(this.parentId)
        return parent.calculateNumOverdueAggregation(addChangeToDB)

    }
    // returns a list of contentItems that are all on leaf nodes
    public async getLeaves(): Promise<IContentItem[]> {
        // log(this.id, " 1: getLeaves called ")
        if (!this.leaves.length) {
            // log(this.id, " 2: getLeaves. this.leaves has no length, this.leaves is ", this.leaves)
            await this.recalculateLeaves()
        }
        // log(this.id, " 3: getLeaves. this.leaves after recalculateLeaves is", this.leaves)
        return this.leaves
    }
    public async recalculateLeavesLeaf() {
        let leaves = []
        try {
            if (this.contentId) {
                leaves = [await this.getContentItem()]
            }
        } catch (err) {
            error(err)
        }
        return leaves
    }
    public async recalculateLeavesNotLeaf() {
        const leaves = []
        await Promise.all(
            this.getChildIds().map(async childId => {
                try {
                    const child = await Trees.get(childId)
                    leaves.push(... await child.getLeaves())
                } catch (err) {
                    error(err)
                }
            }),
        )
        return leaves
    }
    /* TODO: FIX: this can get called multiple times
     simultaneously if like
    three children simultaneously call parent.recalculateLeaves()
    */
    public async recalculateLeaves() {
        // log(this.id, " recalculateLeaves called")
        let leaves = []
        const isLeaf = await this.isLeaf()
        if (isLeaf) {
            leaves = await this.recalculateLeavesLeaf()
        } else {
            leaves = await this.recalculateLeavesNotLeaf()
        }
        this.leaves = leaves
    }
    public async sortLeavesByStudiedAndStrength() {
        // log(this.id, " sortLeavesByStudiedAndStrength called")
        const leaves = await this.getLeaves()
        const studiedLeaves = leaves
           .filter(leaf => leaf.hasInteractions)
           .sort((a, b) => {
                // lowest decibels first
                return a.lastRecordedStrength.value > b.lastRecordedStrength.value ? 1
                    : a.lastRecordedStrength.value < b.lastRecordedStrength.value ? -1 : 0
           })
        const overdueLeaves = studiedLeaves.filter(leaf => leaf.overdue)
        const notOverdueLeaves = studiedLeaves.filter(leaf => !leaf.overdue)

        const notStudiedLeaves = this.leaves.filter(leaf => !leaf.hasInteractions)
        this.leaves = [...overdueLeaves, ...notStudiedLeaves, ...notOverdueLeaves]
        this.leaves = removeDuplicatesById(this.leaves)
        // log(this.id, " sortLeavesByStudiedAndStrength, this sortedLeaves are", this.sortedLeaves)
        this.leaves.forEach(leaf => {
            // log(this.id, " has a leaf ", leaf.id, " with strength of ", leaf.lastRecordedStrength.value)
        })
        if (this.parentId) {
            const parent = await Trees.get(this.parentId)
            parent.sortLeavesByStudiedAndStrength()
        }
    }
    public async getContentItem() {
        if (!this.contentId) {
            return null
        }
        const contentItem = await ContentItems.get(this.contentId)
        return contentItem
    }
    public areItemsToStudy() {
        return this.leaves.length
    }
    /*should only be called after sorted*/
    public areNewOrOverdueItems() {
        if (!this.areItemsToStudy()) {return false}
        const firstItem = this.leaves[0]
        return firstItem.isNew() || firstItem.overdue
    }
    public getNextItemIdToStudy() {
        return this.leaves[0].id
    }
    public setActive() {
        this.active = true
        this.syncGraphWithNode()
    }
    public setInactive() {
        this.active = false
        this.syncGraphWithNode()
    }
    public syncGraphWithNode() {
        syncGraphWithNode(this.id)
    }
    public addMutation(mutation: ITreeMutation) {
       return
    }
    public _isMutationRedundant(mutation: ITreeMutation) {
       switch (mutation.type) {
           case TreeMutationTypes.ADD_LEAF: {
               const leafId = mutation.data.leafId
               const leafAlreadyExists = this.children[leafId]
               return leafAlreadyExists
           }
           case TreeMutationTypes.REMOVE_LEAF: {
               const leafId = mutation.data.leafId
               const leafExists = this.children[leafId]
               return !leafExists
           }
        }
    }
    public subscribeToMutations() {
        return
    }
}
// TODO: get typeScript so we can have a schema for treeObj
// treeObj  example
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
// invoke like a constructor - new Tree(parentId, factId)

function removeDuplicatesById(list) {
    const newList = []
    const usedIds = []
    list.forEach(item => {
        if (usedIds.indexOf(item.id) > -1) { return }
        newList.push(item)
        usedIds.push(item.id)
    })
    return newList
}
