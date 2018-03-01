/* tslint:disable max-line-length */
// /* tslint:disable branchesMap-literal-sort-keys */
// import {error, log} from '../../core/log';
// import md5 from '../../core/md5wrapper'
// import store from '../../core/storeSource'
// import ContentItems from '../contentItems'
// import firebase from '../firebaseService.js';
// import {IContentItem} from '../interfaces';
// import { addObjToProficiencyStats, incrementProficiencyStatsCategory } from '../proficiencyStats/proficiencyStatsUtils'
// // import {IMutable, } from '../mutations/IMutable'
// import {Trees} from '../trees.js'
// import {user} from '../user'
// // import {IDatedMutation} from '../mutations/IMutation';
// // log('md5 is ', md5)
// // log('md5 of 1234 is', md5(1234))
// function syncGraphWithNode(treeId) {
//     store.commit('syncGraphWithNode', treeId)
//     // PubSub.publish('syncGraphWithNode', treeId)
// }
// function loadObject(treeObj, self) {
//     Object.keys(treeObj).forEach(key => self[key] = treeObj[key])
// }
// interface IProficiencyStats {
//     UNKNOWN: number;
//     ONE: number;
//     TWO: number;
//     THREE: number;
//     FOUR: number;
// }
//
// const blankProficiencyStats: IProficiencyStats = {
//     UNKNOWN: 0,
//     ONE: 0,
//     TWO: 0,
//     THREE: 0,
//     FOUR: 0,
// }
// const unknownProficiencyStats: IProficiencyStats = {
//     UNKNOWN: 1,
//     ONE: 0,
//     TWO: 0,
//     THREE: 0,
//     FOUR: 0,
// }
// // interface ITree {
// //
// // }
// interface ITreeData {
//     contentId;
//     parentId;
//     x: number;
//     y: number;
//     level: number;
//     children: branchesMap;
//     mutations: any[];
// }
// interface ITreeUserData {
//     numOverdue: number;
//     aggregationTimer: number;
//     proficiencyStats;
// }
// const blankUserDataObject: ITreeUserData = {
//     numOverdue: 0,
//     aggregationTimer: 0,
//     proficiencyStats: unknownProficiencyStats
// }
// const blankTreeDataObject: ITreeData = {
//     contentId: null,
//     parentId: null,
//     x: null,
//     y: null,
//     level: null,
//     children: {},
//     mutations: []
// }
// export class Tree /* implements IUndoableMutable<IDatedMutation> */   {
//     public id;
//     // public parentId;
//     public active;
//     public leaves;
//     // public children;
//     // public proficiencyStats;
//     // public numOverdue;
//     // public contentId;
//     // public aggregationTimer;
//     // public x;
//     // public y;
//     // public level;
//     // public userNumOverdueMap;
//     // public userProficiencyStatsMap;
//     // public userAggregationTimerMap;
//     // public mutations;
//     public treeDataFromDB: ITreeData;
//     public userData: ITreeUserData;
//
//     constructor({createInDB,
//                     treeDataFromDB,
//                     userData = blankUserDataObject
//     }) {
//         this.leaves = []
//
//         this.treeDataFromDB = treeDataFromDB
//         this.userData = userData
//         if (!createInDB) {
//             return
//         }
//
//         const identificationInfo = {contentId: this.treeDataFromDB.contentId, parentId : this.treeDataFromDB.parentId}
//         this.id = md5(JSON.stringify(identificationInfo))
//
//         const updates = {
//             id: this.id,
//             treeDataFromDB,
//             userData,
//         }
//         const lookupKey = 'trees/' + this.id
//         firebase.database().ref(lookupKey).update(updates)
//     }
//     public hasChildren() {
//         return this.getChildIds().length > 0
//     }
//     public getChildIds() {
//         if (!this.treeDataFromDB.children) {
//            return []
//         }
//         return Object.keys(this.treeDataFromDB.children)
//             .filter(childKey => { // this filter is necessary to remove undefined keys
//             return childKey
//         })
//     }
//     public getChildTreePromises() {
//         return this.getChildIds().sourceMap(Trees.get) // childId => {
//     }
//     public getChildTrees() {
//         return Promise.all(this.getChildTreePromises().sourceMap(async childPromise => await childPromise))
//     }
//     /**
//      * Add a child tree_OUTDATED to this tree_OUTDATED
//      * @param treeId
//      */
//     public async addChild(treeId) {
//         this._addChildLocal(treeId)
//         this._addChildDB()
//
//         this.recalculateProficiencyAggregation()
//         this.calculateAggregationTimer()
//         this.calculateNumOverdueAggregation()
//         this.updatePrimaryParentTreeContentURI()
//     }
//     private async _addChildLocal(treeId) {
//         this.treeDataFromDB.children = this.treeDataFromDB.children || {}
//         this.treeDataFromDB.children[treeId] = true
//     }
//     private async _addChildDB() {
//         const updates = {
//             children: this.treeDataFromDB.children,
//         }
//         try {
//             const lookupKey = 'trees/' + this.id + '/treeDataFromDB/'
//             await firebase.database().ref(lookupKey).update(updates)
//         } catch (err) {
//             error(' error for add firebase call', err)
//         }
//     }
//
//     public async removeAndDisconnectFromParent() {
//         const me = this
//         const parentTree = await Trees.get(this.treeDataFromDB.parentId)
//         parentTree.removeChild(me.id)
//         this.remove()
//
//     }
//     public remove() {
//         log(this.id, 'remove called!')
//         const me = this
//         ContentItems.remove(this.treeDataFromDB.contentId)
//         Trees.remove(this.id)
//         log(this.id, 'remove about to be called for', JSON.stringify(this.treeDataFromDB.children))
//         const removeChildPromises = this.treeDataFromDB.children ?
//             Object.keys(this.treeDataFromDB.children)
//             .sourceMap(Trees.get)
//             .sourceMap(async (childPromise: Promise<Tree>) => {
//                 const child: Tree = await childPromise
//                 log(this.id, 'child just received is ', child, child.id)
//                 child.remove()
//             })
//          : []
//         return Promise.all(removeChildPromises)
//     }
//
//     public removeChild(childId) {
//         if (!this.treeDataFromDB.children || !this.treeDataFromDB.children[childId]) {
//             return
//         }
//         delete this.treeDataFromDB.children[childId]
//
//         const updates = {children: this.treeDataFromDB.children}
//         const lookupKey = 'trees/' + this.id + '/treeDataFromDB/'
//         firebase.database().ref(lookupKey).update(updates)
//     }
//
//     public changeParent(newParentId) {
//         this.treeDataFromDB.parentId = newParentId
//         const updates = {parentId: newParentId}
//         const lookupKey = 'trees/' + this.id + '/treeDataFromDB/'
//         firebase.database().ref(lookupKey).update(updates)
//
//         this.updatePrimaryParentTreeContentURI()
//         this.recalculateProficiencyAggregation()
//         this.calculateAggregationTimer()
//     }
//     // async sync
//     public async updatePrimaryParentTreeContentURI() {
//         const [parentTree, contentItem] = await Promise.all(
//             [Trees.get(this.treeDataFromDB.parentId), ContentItems.get(this.treeDataFromDB.contentId)]
//         )
//         const parentTreeContentItem = await ContentItems.get(parentTree.treeDataFromDB.contentId)
//         // return ContentItems.get(parentTree.contentId).then(parentTreeContentItem => {
//         contentItem.set('primaryParentTreeContentURI', parentTreeContentItem.uri)
//         contentItem.calculateURIBasedOnParentTreeContentURI()
//
//         // update for all the children as well
//         const childUpdatePromises = this.getChildIds()
//             .sourceMap(async childId => {
//             const childTree = await Trees.get(childId)
//             return childTree.updatePrimaryParentTreeContentURI()
//         })
//         return Promise.all(childUpdatePromises)
//     }
//     public async clearChildrenInteractions() {
//         log(this.id, 'clearChildrenInteractions called')
//         // const isLeaf = await this.isLeaf()
//         if (await this.isLeaf()) {
//             log(this.id, 'clearChildrenInteractions THIS IS LEAF')
//             user.addMutation('clearInteractions', {timestamp: Date.now(), contentId: this.treeDataFromDB.contentId})
//         } else {
//             this.getChildTreePromises()
//                 .sourceMap(async treePromise => {
//                     const tree_OUTDATED = await treePromise
//                     tree_OUTDATED.clearChildrenInteractions()
//                 })
//         }
//
//     }
//     public setProficiencyStats(proficiencyStats, addChangeToDB) {
//         this.userData.proficiencyStats = proficiencyStats
//
//         if (!addChangeToDB) {
//             return
//         }
//         const updates = {
//             proficiencyStats: this.userData.proficiencyStats,
//         }
//         const lookupKey = 'trees/' + this.id + '/userData/'
//
//         firebase.database().ref(lookupKey).update(updates)
//     }
//
//     public setAggregationTimer(sampleContentUser1Timer, addChangeToDB) {
//         this.userData.aggregationTimer = sampleContentUser1Timer
//         if (!addChangeToDB) {
//             return
//         }
//         const updates = {
//             aggregationTimer: this.userData.aggregationTimer,
//         }
//         const lookupKey = 'trees/' + this.id + '/userData/'
//
//         firebase.database().ref(lookupKey).update(updates)
//     }
//     public setNumOverdue(numOverdue, addChangeToDB) {
//         this.userData.numOverdue = numOverdue
//         if (!addChangeToDB) {
//             return
//         }
//         const updates = {
//             numOverdue: this.userData.numOverdue,
//         }
//         const lookupKey = 'trees/' + this.id + '/userData/'
//
//         firebase.database().ref(lookupKey).update(updates)
//     }
//     /**
//      * Change the content of a given node ("Tree")
//      * Available content types currently header and fact
//      */
//     public changeContent(contentId) {
//         this.treeDataFromDB.contentId = contentId;
//         const updates = {
//             contentId,
//         }
//         const lookupKey = 'trees/' + this.id + '/treeDataFromDB/'
//
//         firebase.database().ref(lookupKey).update(updates)
//     }
//
//     /**
//      * Used to update tree_OUTDATED X and Y coordinates
//      * @param prop
//      * @param val
//      */
//     public set(prop, val) {
//         if (this[prop] === val) {
//             return;
//         }
//
//         const updates = {}
//         updates[prop] = val
//         // this.treeRef.update(updates)
//         const lookupKey = 'trees/' + this.id
//         firebase.database().ref(lookupKey).update(updates)
//         this[prop] = val
//     }
//     public setTreeData(prop, val) {
//         if (this.treeDataFromDB[prop] === val) {
//             return;
//         }
//
//         this.treeDataFromDB[prop] = val
//         const updates = {}
//         updates[prop] = val
//         // this.treeRef.update(updates)
//         const lookupKey = 'trees/' + this.id + '/treeDataFromDB/'
//         firebase.database().ref(lookupKey).update(updates)
//     }
//     public setLocal(prop, val) {
//         this[prop] = val
//     }
//     public addToX({recursion, deltaX}= {recursion: false, deltaX: 0}) {
//        const newX = this.treeDataFromDB.x + deltaX
//        this.setTreeData('x', newX)
//
//        syncGraphWithNode(this.id)
//        if (!recursion) {
//          return
//        }
//
//        this.getChildIds().forEach(async childId => {
//             const child = await Trees.get(childId)
//             child.addToX({recursion: true, deltaX})
//         })
//     }
//     public addToY({recursion, deltaY}= {recursion: false, deltaY: 0}) {
//         const newY = this.treeDataFromDB.y + deltaY
//         this.setTreeData('y', newY)
//
//         syncGraphWithNode(this.id)
//         if (!recursion) { return }
//         this.getChildIds().forEach(async childId => {
//             const child = await Trees.get(childId)
//             child.addToY({recursion: true, deltaY})
//         })
//     }
//
//     public async isLeaf() {
//         const content = await ContentItems.get(this.treeDataFromDB.contentId)
//         return content.isLeafType()
//     }
//     public async calculateProficiencyAggregationForLeaf() {
//         let proficiencyStats = {...blankProficiencyStats}
//         const contentItem = await ContentItems.get(this.treeDataFromDB.contentId)
//         proficiencyStats = incrementProficiencyStatsCategory(proficiencyStats, contentItem.sampleContentUser1Proficiency)
//         return proficiencyStats
//     }
//     public async calculateProficiencyAggregationForNotLeaf() {
//         let proficiencyStats = {...blankProficiencyStats}
//         if (!this.treeDataFromDB.children || !Object.keys(this.treeDataFromDB.children).length) { return proficiencyStats }
//         const children = await Promise.all(
//             Object.keys(this.treeDataFromDB.children)
//             .sourceMap(Trees.get)
//             .sourceMap(async childPromise => await childPromise),
//         )
//
//         children.forEach(child => {
//             proficiencyStats = addObjToProficiencyStats(proficiencyStats, child.treeDataFromDB.proficiencyStats)
//         })
//         return proficiencyStats
//     }
//     public async recalculateProficiencyAggregation(addChangeToDB = false) {
//         let proficiencyStats;
//         const isLeaf = await this.isLeaf()
//         if (isLeaf) {
//             proficiencyStats = await this.calculateProficiencyAggregationForLeaf()
//         } else {
//             proficiencyStats = await this.calculateProficiencyAggregationForNotLeaf()
//         }
//         this.setProficiencyStats(proficiencyStats, addChangeToDB)
//         store.commit('syncGraphWithNode', this.id)
//
//         // PubSub.publish('syncGraphWithNode', this.id)
//         if (!this.treeDataFromDB.parentId) { return }
//         const parent = await Trees.get(this.treeDataFromDB.parentId)
//         return parent.recalculateProficiencyAggregation(addChangeToDB)
//     }
//
//     public async calculateAggregationTimerForLeaf() {
//         const contentItem = await ContentItems.get(this.treeDataFromDB.contentId)
//         return contentItem.sampleContentUser1Timer
//     }
//     public async calculateAggregationTimerForNotLeaf() {
//         const me = this
//         let sampleContentUser1Timer = 0
//         if (!this.hasChildren()) {
//             return sampleContentUser1Timer
//         }
//         const children = await this.getChildTrees()
//
//         children.forEach((child: Tree ) => {
//             sampleContentUser1Timer += +child.userData.aggregationTimer
//         })
//         return sampleContentUser1Timer
//     }
//     public async calculateAggregationTimer(addChangeToDB = false) {
//         let sampleContentUser1Timer;
//         const isLeaf = await this.isLeaf()
//         if (isLeaf) {
//             sampleContentUser1Timer = await this.calculateAggregationTimerForLeaf()
//         } else {
//             sampleContentUser1Timer = await this.calculateAggregationTimerForNotLeaf()
//         }
//         this.setAggregationTimer(sampleContentUser1Timer, addChangeToDB)
//
//         if (!this.treeDataFromDB.parentId) { return }
//         const parent = await Trees.get(this.treeDataFromDB.parentId)
//         return parent.calculateAggregationTimer()
//     }
//
//     public async calculateNumOverdueAggregationLeaf() {
//         const contentItem = await ContentItems.get(this.treeDataFromDB.contentId)
//         const sampleContentUser1Overdue = contentItem.sampleContentUser1Overdue ? 1 : 0
//         return sampleContentUser1Overdue
//     }
//     public async calculateNumOverdueAggregationNotLeaf() {
//         const children = await this.getChildTrees()// await Promise.all(
//         const numOverdue = children.reduce((sum, child) => sum + (+child.treeDataFromDB.numOverdue || 0), 0)
//
//         return numOverdue
//         // TODO start storing numOverdue in db - the way we do with the other aggregations
//     }
//     public async calculateNumOverdueAggregation(addChangeToDB = false) {
//         let numOverdue;
//         const isLeaf = await this.isLeaf()
//         try {
//             if (isLeaf) {
//                 numOverdue = await this.calculateNumOverdueAggregationLeaf()
//             } else {
//                 numOverdue = await this.calculateNumOverdueAggregationNotLeaf()
//             }
//         } catch (err) {
//             error('calcNumOverdue promise err is', err)
//         }
//         this.setNumOverdue(numOverdue, addChangeToDB)
//
//         if (!this.treeDataFromDB.parentId) { return }
//         const parent = await Trees.get(this.treeDataFromDB.parentId)
//         return parent.calculateNumOverdueAggregation(addChangeToDB)
//     }
//     // returns a list of contentItems that are all on leaf nodes
//     public async getLeaves(): Promise<IContentItem[]> {
//         // log(this.id, " 1: getLeaves called ")
//         if (!this.leaves.length) {
//             // log(this.id, " 2: getLeaves. this.leaves has no length, this.leaves is ", this.leaves)
//             await this.recalculateLeaves()
//         }
//         // log(this.id, " 3: getLeaves. this.leaves after recalculateLeaves is", this.leaves)
//         return this.leaves
//     }
//     public async recalculateLeavesLeaf() {
//         let leaves = []
//         try {
//             if (this.treeDataFromDB.contentId) {
//                 leaves = [await this.getContentItem()]
//             }
//         } catch (err) {
//             error(err)
//         }
//         return leaves
//     }
//     public async recalculateLeavesNotLeaf() {
//         const leaves = []
//         await Promise.all(
//             this.getChildIds().sourceMap(async childId => {
//                 try {
//                     const child = await Trees.get(childId)
//                     leaves.push(... await child.getLeaves())
//                 } catch (err) {
//                     error(err)
//                 }
//             })
//         )
//         return leaves
//     }
//     /* TODO: FIX: this can get called multiple times
//      simultaneously if like
//     three children simultaneously call parent.recalculateLeaves()
//     That's a waste of CPU
//     */
//     public async recalculateLeaves() {
//         // log(this.id, " recalculateLeaves called")
//         let leaves = []
//         const isLeaf = await this.isLeaf()
//         if (isLeaf) {
//             leaves = await this.recalculateLeavesLeaf()
//         } else {
//             leaves = await this.recalculateLeavesNotLeaf()
//         }
//         this.leaves = leaves
//     }
//     public async sortLeavesByStudiedAndStrength() {
//         // log(this.id, " sortLeavesByStudiedAndStrength called")
//         const leaves: IContentItem[] = await this.getLeaves()
//         const studiedLeaves = leaves
//            .filter(leaf => leaf.hasInteractions)
//            .sort((a, b) => {
//                 // lowest decibels first
//                 return a.lastEstimatedStrength.value > b.lastEstimatedStrength.value ? 1
//                     : a.lastEstimatedStrength.value < b.lastEstimatedStrength.value ? -1 : 0
//            })
//         const overdueLeaves = studiedLeaves.filter(leaf => leaf.sampleContentUser1Overdue)
//         const notOverdueLeaves = studiedLeaves.filter(leaf => !leaf.sampleContentUser1Overdue)
//
//         const notStudiedLeaves = this.leaves.filter(leaf => !leaf.hasInteractions)
//         this.leaves = [...overdueLeaves, ...notStudiedLeaves, ...notOverdueLeaves]
//         this.leaves = removeDuplicatesById(this.leaves)
//         // log(this.id, " sortLeavesByStudiedAndStrength, this sortedLeaves are", this.sortedLeaves)
//         this.leaves.forEach(leaf => {
//             // log(this.id, " has a leaf ", leaf.id, " with strength of ", leaf.lastEstimatedStrength.value)
//         })
//         if (this.treeDataFromDB.parentId) {
//             const parent = await Trees.get(this.treeDataFromDB.parentId)
//             parent.sortLeavesByStudiedAndStrength()
//         }
//     }
//     public async getContentItem() {
//         if (!this.treeDataFromDB.contentId) {
//             return null
//         }
//         const contentItem = await ContentItems.get(this.treeDataFromDB.contentId)
//         return contentItem
//     }
//     public areItemsToStudy() {
//         return this.leaves.length
//     }
//     /*should only be called after sorted*/
//     public areNewOrOverdueItems() {
//         if (!this.areItemsToStudy()) {return false}
//         const firstItem: IContentItem = this.leaves[0]
//         return firstItem.isNew() || firstItem.sampleContentUser1Overdue
//     }
//     public getNextItemIdToStudy() {
//         return this.leaves[0].id
//     }
//     public setActive() {
//         this.active = true
//         this.syncGraphWithNode()
//     }
//     public setInactive() {
//         this.active = false
//         this.syncGraphWithNode()
//     }
//     public syncGraphWithNode() {
//         syncGraphWithNode(this.id)
//     }
//     // public addMutation(mutation: ITreeMutation) {
//     //    return
//     // }
//     // public _isMutationRedundant(mutation: ITreeMutation) {
//     //    switch (mutation.type) {
//     //        case TreeMutationTypes.ADD_CHILD: {
//     //            const leafId = mutation.data.leafId
//     //            const leafAlreadyExists = this.treeDataFromDB.children[leafId]
//     //            return leafAlreadyExists
//     //        }
//     //        case TreeMutationTypes.REMOVE_CHILD: {
//     //            const leafId = mutation.data.leafId
//     //            const leafExists = this.treeDataFromDB.children[leafId]
//     //            return !leafExists
//     //        }
//     //     }
//     // }
//     // public subscribeToMutations() {
//     //     return
//     // }
// }
// // treeObj  example
// /*
//  parentId: parentTreeId,
//  factId: fact.id,
//  x: parseInt(currentNewChildTree.x),
//  y: parseInt(currentNewChildTree.y),
//  children: {},
//  label: fact.question + ' ' + fact.answer,
//  size: 1,
//  color: Globals.existingColor,
//  type: 'tree_OUTDATED'
//  */
// // invoke like a constructor - new Tree(parentId, factId)
//
// function removeDuplicatesById(list) {
//     const newList = []
//     const usedIds = []
//     list.forEach(item => {
//         if (usedIds.indexOf(item.id) > -1) { return }
//         newList.push(item)
//         usedIds.push(item.id)
//     })
//     return newList
// }
