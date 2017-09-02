import {Tree} from './tree.js'
import firebase from './firebaseService.js'

const trees = {
} // cache
if (typeof window !== 'undefined'){
    window.trees = trees //expose to window for console debugging
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
            } else {
                firebase.database().ref('trees/' + treeId).once("value", function onFirebaseTreeGet(snapshot){
                    let treeData = snapshot.val();
                    var tree = new Tree(treeData)
                    trees[tree.id] = tree // add to cache
                    resolve(tree)
                })
            }
        })
    }
}
