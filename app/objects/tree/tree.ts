// /* tslint:disable object-literal-sort-keys */
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
//     children: object;
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
//     public treeData: ITreeData;
//     public userData: ITreeUserData;
//
//     constructor({createInDB,
//                     treeData,
//                     userData = blankUserDataObject
//     }) {
//         this.leaves = []
//
//         this.treeData = treeData
//         this.userData = userData
//         if (!createInDB) {
//             return
//         }
//
//         const identificationInfo = {contentId: this.treeData.contentId, parentId : this.treeData.parentId}
//         this.id = md5(JSON.stringify(identificationInfo))
//
//         const updates = {
//             id: this.id,
//             treeData,
//             userData,
//         }
//         const lookupKey = 'trees/' + this.id
//         firebase.database().ref(lookupKey).update(updates)
//     }
//     public hasChildren() {
//         return this.getChildIds().length > 0
//     }
//     public getChildIds() {
//         if (!this.treeData.children) {
//            return []
//         }
//         return Object.keys(this.treeData.children)
//             .filter(childKey => { // this filter is necessary to remove undefined keys
//             return childKey
//         })
//     }
//     public getChildTreePromises() {
//         return this.getChildIds().map(Trees.get) // childId => {
//     }
//     public getChildTrees() {
//         return Promise.all(this.getChildTreePromises().map(async childPromise => await childPromise))
//     }
//     /**
//      * Add a child tree to this tree
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
//         this.treeData.children = this.treeData.children || {}
//         this.treeData.children[treeId] = true
//     }
//     private async _addChildDB() {
//         const updates = {
//             children: this.treeData.children,
//         }
//         try {
//             const lookupKey = 'trees/' + this.id + '/treeData/'
//             await firebase.database().ref(lookupKey).update(updates)
//         } catch (err) {
//             error(' error for add firebase call', err)
//         }
//     }
//
//     public async removeAndDisconnectFromParent() {
//         const me = this
//         const parentTree = await Trees.get(this.treeData.parentId)
//         parentTree.removeChild(me.id)
//         this.remove()
//
//     }
//     public remove() {
//         log(this.id, 'remove called!')
//         const me = this
//         ContentItems.remove(this.treeData.contentId)
//         Trees.remove(this.id)
//         log(this.id, 'remove about to be called for', JSON.stringify(this.treeData.children))
//         const removeChildPromises = this.treeData.children ?
//             Object.keys(this.treeData.children)
//             .map(Trees.get)
//             .map(async (childPromise: Promise<Tree>) => {
//                 const child: Tree = await childPromise
//                 log(this.id, 'child just received is ', child, child.id)
//                 child.remove()
//             })
//          : []
//         return Promise.all(removeChildPromises)
//     }
//
//     public removeChild(childId) {
//         if (!this.treeData.children || !this.treeData.children[childId]) {
//             return
//         }
//         delete this.treeData.children[childId]
//
//         const updates = {children: this.treeData.children}
//         const lookupKey = 'trees/' + this.id + '/treeData/'
//         firebase.database().ref(lookupKey).update(updates)
//     }
//
//     public changeParent(newParentId) {
//         this.treeData.parentId = newParentId
//         const updates = {parentId: newParentId}
//         const lookupKey = 'trees/' + this.id + '/treeData/'
//         firebase.database().ref(lookupKey).update(updates)
//
//         this.updatePrimaryParentTreeContentURI()
//         this.recalculateProficiencyAggregation()
//         this.calculateAggregationTimer()
//     }
//     // async sync
//     public async updatePrimaryParentTreeContentURI() {
//         const [parentTree, contentItem] = await Promise.all(
//             [Trees.get(this.treeData.parentId), ContentItems.get(this.treeData.contentId)]
//         )
//         const parentTreeContentItem = await ContentItems.get(parentTree.treeData.contentId)
//         // return ContentItems.get(parentTree.contentId).then(parentTreeContentItem => {
//         contentItem.set('primaryParentTreeContentURI', parentTreeContentItem.uri)
//         contentItem.calculateURIBasedOnParentTreeContentURI()
//
//         // update for all the children as well
//         const childUpdatePromises = this.getChildIds()
//             .map(async childId => {
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
//             user.addMutation('clearInteractions', {timestamp: Date.now(), contentId: this.treeData.contentId})
//         } else {
//             this.getChildTreePromises()
//                 .map(async treePromise => {
//                     const tree = await treePromise
//                     tree.clearChildrenInteractions()
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
//     public setAggregationTimer(timer, addChangeToDB) {
//         this.userData.aggregationTimer = timer
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
//         this.treeData.contentId = contentId;
//         const updates = {
//             contentId,
//         }
//         const lookupKey = 'trees/' + this.id + '/treeData/'
//
//         firebase.database().ref(lookupKey).update(updates)
//     }
//
//     /**
//      * Used to update tree X and Y coordinates
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
//         if (this.treeData[prop] === val) {
//             return;
//         }
//
//         this.treeData[prop] = val
//         const updates = {}
//         updates[prop] = val
//         // this.treeRef.update(updates)
//         const lookupKey = 'trees/' + this.id + '/treeData/'
//         firebase.database().ref(lookupKey).update(updates)
//     }
//     public setLocal(prop, val) {
//         this[prop] = val
//     }
//     public addToX({recursion, deltaX}= {recursion: false, deltaX: 0}) {
//        const newX = this.treeData.x + deltaX
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
//         const newY = this.treeData.y + deltaY
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
//         const content = await ContentItems.get(this.treeData.contentId)
//         return content.isLeafType()
//     }
//     public async calculateProficiencyAggregationForLeaf() {
//         let proficiencyStats = {...blankProficiencyStats}
//         const contentItem = await ContentItems.get(this.treeData.contentId)
//         proficiencyStats = incrementProficiencyStatsCategory(proficiencyStats, contentItem.proficiency)
//         return proficiencyStats
//     }
//     public async calculateProficiencyAggregationForNotLeaf() {
//         let proficiencyStats = {...blankProficiencyStats}
//         if (!this.treeData.children || !Object.keys(this.treeData.children).length) { return proficiencyStats }
//         const children = await Promise.all(
//             Object.keys(this.treeData.children)
//             .map(Trees.get)
//             .map(async childPromise => await childPromise),
//         )
//
//         children.forEach(child => {
//             proficiencyStats = addObjToProficiencyStats(proficiencyStats, child.treeData.proficiencyStats)
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
//         if (!this.treeData.parentId) { return }
//         const parent = await Trees.get(this.treeData.parentId)
//         return parent.recalculateProficiencyAggregation(addChangeToDB)
//     }
//
//     public async calculateAggregationTimerForLeaf() {
//         const contentItem = await ContentItems.get(this.treeData.contentId)
//         return contentItem.timer
//     }
//     public async calculateAggregationTimerForNotLeaf() {
//         const me = this
//         let timer = 0
//         if (!this.hasChildren()) {
//             return timer
//         }
//         const children = await this.getChildTrees()
//
//         children.forEach((child: Tree ) => {
//             timer += +child.userData.aggregationTimer
//         })
//         return timer
//     }
//     public async calculateAggregationTimer(addChangeToDB = false) {
//         let timer;
//         const isLeaf = await this.isLeaf()
//         if (isLeaf) {
//             timer = await this.calculateAggregationTimerForLeaf()
//         } else {
//             timer = await this.calculateAggregationTimerForNotLeaf()
//         }
//         this.setAggregationTimer(timer, addChangeToDB)
//
//         if (!this.treeData.parentId) { return }
//         const parent = await Trees.get(this.treeData.parentId)
//         return parent.calculateAggregationTimer()
//     }
//
//     public async calculateNumOverdueAggregationLeaf() {
//         const contentItem = await ContentItems.get(this.treeData.contentId)
//         const overdue = contentItem.overdue ? 1 : 0
//         return overdue
//     }
//     public async calculateNumOverdueAggregationNotLeaf() {
//         const children = await this.getChildTrees()// await Promise.all(
//         const numOverdue = children.reduce((sum, child) => sum + (+child.treeData.numOverdue || 0), 0)
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
//         if (!this.treeData.parentId) { return }
//         const parent = await Trees.get(this.treeData.parentId)
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
//             if (this.treeData.contentId) {
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
//             this.getChildIds().map(async childId => {
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
//                 return a.lastRecordedStrength.value > b.lastRecordedStrength.value ? 1
//                     : a.lastRecordedStrength.value < b.lastRecordedStrength.value ? -1 : 0
//            })
//         const overdueLeaves = studiedLeaves.filter(leaf => leaf.overdue)
//         const notOverdueLeaves = studiedLeaves.filter(leaf => !leaf.overdue)
//
//         const notStudiedLeaves = this.leaves.filter(leaf => !leaf.hasInteractions)
//         this.leaves = [...overdueLeaves, ...notStudiedLeaves, ...notOverdueLeaves]
//         this.leaves = removeDuplicatesById(this.leaves)
//         // log(this.id, " sortLeavesByStudiedAndStrength, this sortedLeaves are", this.sortedLeaves)
//         this.leaves.forEach(leaf => {
//             // log(this.id, " has a leaf ", leaf.id, " with strength of ", leaf.lastRecordedStrength.value)
//         })
//         if (this.treeData.parentId) {
//             const parent = await Trees.get(this.treeData.parentId)
//             parent.sortLeavesByStudiedAndStrength()
//         }
//     }
//     public async getContentItem() {
//         if (!this.treeData.contentId) {
//             return null
//         }
//         const contentItem = await ContentItems.get(this.treeData.contentId)
//         return contentItem
//     }
//     public areItemsToStudy() {
//         return this.leaves.length
//     }
//     /*should only be called after sorted*/
//     public areNewOrOverdueItems() {
//         if (!this.areItemsToStudy()) {return false}
//         const firstItem: IContentItem = this.leaves[0]
//         return firstItem.isNew() || firstItem.overdue
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
//     //            const leafAlreadyExists = this.treeData.children[leafId]
//     //            return leafAlreadyExists
//     //        }
//     //        case TreeMutationTypes.REMOVE_CHILD: {
//     //            const leafId = mutation.data.leafId
//     //            const leafExists = this.treeData.children[leafId]
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
//  type: 'tree'
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
