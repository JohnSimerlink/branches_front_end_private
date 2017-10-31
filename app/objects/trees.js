import {Tree} from './tree/tree.ts'
import firebase from './firebaseService.js'
import LocalForage from 'localforage'

const trees = {
} // cache
if (typeof window !== 'undefined'){
    window.trees = trees //expose to window for console debugging
}
function processTreeData(treeData, resolve){
    var tree = new Tree(treeData)
    trees[tree.id] = tree // add to cache
    resolve(tree)
}
export class Trees {
    static getAll(success){
    }
    //returns promise
    static get(treeId){
        if (!treeId) {
           throw "Trees.get(treeId) error!. treeId empty"
        }
        return new Promise( function getTreePromise (resolve, reject) {
            //trees serves as local cash for trees downloaded from db //TODO: this cache should become obselete when we switch to Couchdb+pouchdb
            if (trees[treeId]){
                resolve(trees[treeId])
                return
            }
            const lookupKey = 'trees/' + treeId
            LocalForage.getItem(lookupKey).then( contentData => {
                if (window.fullCache && contentData){
                    processTreeData(contentData, resolve)
                    return
                }
                firebase.database().ref(lookupKey).once("value", function onFirebaseTreeGet(snapshot){
                    let treeData = snapshot.val();
                    processTreeData(treeData, resolve)
                })
            })
        })
    }
    static remove(id){
        delete trees[id];
        firebase.database().ref('trees/').child(id).remove() //.once("value", function(snapshot){
    }
    static async adoptChild(newParentId, childId){
        const task1 = Trees._handleChildAndOldParent(newParentId, childId),
            task2 = Trees._handleNewParent(newParentId, childId)
        [await task1, await task2]
    }
    static async _handleChildAndOldParent(newParentId,childId){
        const child = await Trees.get(childId)
        const oldParentPromise = Trees.get(child.parentId)
        child.changeParent(newParentId)
        const oldParent = await oldParentPromise
        oldParent.removeChild(child.id)
    }
    static async _handleNewParent(newParentId,childId){
        const newParent = await Trees.get(newParentId)
        newParent.addChild(childId)
    }
}
if (typeof window !== 'undefined'){
    window.Trees = Trees
}
