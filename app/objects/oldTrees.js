import {Tree} from './tree/tree.ts'
import firebase from './firebaseService.js'
import LocalForage from 'localforage'

const trees = {
} // cache
if (typeof window !== 'undefined'){
    window.trees = trees //expose to window for console debugging
}
function processTreeData(treeData){
    console.log('processTreeData called')
    try {
        var tree = new Tree({treeData, userData, createInDB: false})
        trees[tree.id] = tree // add to cache
        console.log('')
        resolve(tree)
    } catch (err){
        console.error(err)
    }
}
export class Trees {
    static getAll(success){
    }
    //returns promise
    static get(treeId){
        console.log('Trees.get called', treeId)
        if (!treeId) {
            throw "Trees.get(treeId) error!. treeId empty"
        }
        return new Promise( async function getTreePromise (resolve, reject) {
            //trees serves as local cash for trees downloaded from db //TODO: this cache should become obselete when we switch to Couchdb+pouchdb
            console.log('Trees.get new Promise called', treeId)
            if (trees[treeId]){
                resolve(trees[treeId])
                return
            }
            const treeDataLookupKey = 'trees/' + treeId + '/treeDataFromDB'
            // const contentData = await LocalForage.getItem(lookupKey)
            // if (window.fullCache && contentData){
            //     processTreeData(contentData, resolve)
            //     return
            // }
            firebase.database().ref(treeDataLookupKey).once("value", function onFirebaseTreeGet(snapshot){
                console.log('Trees.get treeDataLookupKey result', treeId, snapshot.val())
                try {
                    let treeData = snapshot.val();
                    const userDataLookupKey = 'trees/' + treeId + '/userData'
                    firebase.database().ref(userDataLookupKey).once('value', function onFirebaseUserDataGet(snapshot){
                        console.log('Trees.get userDataLookupKey result', treeId, snapshot.val())
                        try {
                            const userData = snapshot.val()
                            processTreeData(treeData, userData, resolve)
                        } catch (err) {
                            console.error("error: ", err)
                        }
                    })
                } catch (err){
                    console.error(err)
                }
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
        const oldParentPromise = Trees.get(child.treeDataFromDB.parentId)
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
