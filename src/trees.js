import {Facts} from './facts.js'
import {Tree} from './tree.js'
import {Config} from './config.js'
import getFirebase from './firebaseService.js'
const firebase = getFirebase()
const trees = {
}
const offlineTreesData = {
    //LAST UPDATED 6/28 9am
    "1":
        {
            "factId":"24",
            "id": "1",
            "x":"0",
            "y":"0",
            "children": {
                "075d07593a01ae43d7e045e7effadfb2": true,
                "35d917de5c0bd13a49d6e86bb7c540c1": true
            }
        },
    "075d07593a01ae43d7e045e7effadfb2":
        {
            "factId":"c8d26306d29ff13f0c1010ee0467d47a",
            "id":"075d07593a01ae43d7e045e7effadfb2",
            "parentId":"1",
            "x":"300",
            "y":"300"
        },
    "35d917de5c0bd13a49d6e86bb7c540c1": // the more you learn the more you earn
        {
            "factId":"bc62641cfd029c281b8ce6135d8991e0",
            "id":"35d917de5c0bd13a49d6e86bb7c540c1",
            "parentId":"1",
            "x":"500",
            "y":"400"
        }
};
export class OnlineTrees {
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
export class OfflineTrees {
    static getAll(success){
    }
    //returns promise
    //TODO: make resolve "null" or something if fact not found
    static get(treeId){
        return new Promise((resolve, reject) => {
            let treeObj;

            treeObj = offlineTreesData[treeId]
            var tree = new Tree(treeObj)
            resolve(tree)
        })
    }
}
export class Trees {
    static getAll() {
        return Config.offlineMode ? OfflineTrees.getAll(...arguments) : OnlineTrees.getAll(...arguments)
    }
    static get() {
        return Config.offlineMode ? OfflineTrees.get(...arguments) : OnlineTrees.get(...arguments)
    }
}