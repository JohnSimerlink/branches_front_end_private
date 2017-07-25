import {Facts} from './facts.js'
import {Tree} from './tree.js'
import {Config} from '../core/config.js'
import getFirebase from './firebaseService.js'
const firebase = getFirebase()
const trees = {
}
export class Trees {
    static getAll(success){
    }
    //returns promise
    //TODO: make resolve "null" or something if fact not found
    static get(treeId){
        if (!treeId) {
           throw "Trees.get(treeId) error!. treeId empty"
        }
        return new Promise( function getTreePromise (resolve, reject) {
            let treeObj;

            //trees[] serves as local cash for trees downloaded from db //TODO: this cache should become obselete when we switch to Couchdb+pouchdb
            if (trees[treeId]){
                resolve(trees[treeId])
            } else {
                firebase.database().ref('trees/' + treeId).on("value", function onFirebaseTreeGet(snapshot){
                    treeObj = snapshot.val()
                    var tree = new Tree(treeObj)
                    trees[tree.id] = tree
                    resolve(tree)
                })
            }
        })
    }
}
