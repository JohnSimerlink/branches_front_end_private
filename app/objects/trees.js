import {Tree} from './tree/tree.ts'
import firebase from './firebaseService.js'
import LocalForage from 'localforage'
import {log, error} from '../core/log'

const trees = {
} // cache
if (typeof window !== 'undefined'){
    window.trees = trees //expose to window for console debugging
}
const inProgressTreePromises = {}
function processTreeData(treeData, userData, resolve){
    console.log('trees.js', treeData.id, ' processTreeData called')
    try {
        var tree = new Tree({treeData, userData, createInDB: false})
        trees[tree.id] = tree // add to cache
        console.log('trees.js', treeData.id, ' processTreeData ', tree)
        resolve(tree)
    } catch (err){
        console.error(err)
    }
}
export class Trees {
    static getAll(success){
    }
    //returns promise
    static get(treeId, userId){
        log('Trees.get called', treeId, userId)
        if (!treeId) {
           throw "Trees.get(treeId) error!. treeId empty"
        }
        if (inProgressTreePromises[treeId]){
            return inProgressTreePromises[treeId]
        } else {
            inProgressTreePromises[treeId] = new Promise( async function getTreePromise (resolve, reject) {
                //trees serves as local cash for trees downloaded from db //TODO: this cache should become obselete when we switch to Couchdb+pouchdb
                if (trees[treeId]) {
                    resolve(trees[treeId])
                    return
                }
                const treeDataLookupKey = 'trees/' + treeId + '/treeData'
                // const contentData = await LocalForage.getItem(lookupKey)
                // if (window.fullCache && contentData){
                //     processTreeData(contentData, resolve)
                //     return
                // }
                firebase.database().ref(treeDataLookupKey).once("value", function onFirebaseTreeGet(snapshot){
                    log('Trees.get treeDataLookupKey result', treeId, snapshot.val())
                    if (!userId) {

                    }
                    try {
                        let treeData = snapshot.val();
                        const userDataLookupKey = 'trees/' + treeId + '/usersData/' + userId
                        firebase.database().ref(userDataLookupKey).once('value', function onFirebaseUserDataGet(snapshot){
                            log('Trees.get userDataLookupKey result', treeId, userId, '==>', snapshot.val())
                            try {
                                const userData = snapshot.val()
                                processTreeData(treeData, userData, resolve)
                            } catch (err) {
                                error("error: ", err)
                            }
                        })
                    } catch (err){
                        error(err)
                    }
                })
            })
            return inProgressTreePromises[treeId]
        }
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
        const oldParentPromise = Trees.get(child.treeData.parentId)
        child.changeParent(newParentId)
        const oldParent = await oldParentPromise
        oldParent.removeChild(child.id)
    }
    static async _handleNewParent(newParentId,childId){
        const newParent = await Trees.get(newParentId)
        newParent.add(childId)
    }
}
if (typeof window !== 'undefined'){
    window.Trees = Trees
}
