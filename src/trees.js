import {Facts} from './facts.js'
import {Tree} from './tree.js'
import {Config} from './config.js'
import getFirebase from './firebaseService.js'
const firebase = getFirebase()
console.log('trees.js imported')
const trees = {
}
const offlineTreesData = {
    //LAST UPDATED 6/28 9am
    "1":
        {
            "factId":"24",
            "treeId":"1",
            "x":"0",
            "y":"0",
            "children": ["075d07593a01ae43d7e045e7effadfb2","35d917de5c0bd13a49d6e86bb7c540c1"]
        },
    "075d07593a01ae43d7e045e7effadfb2":
        {
            "factId":"c8d26306d29ff13f0c1010ee0467d47a",
            "id":"075d07593a01ae43d7e045e7effadfb2",
            "parentId":"1",
            "treeId":"075d07593a01ae43d7e045e7effadfb2",
            "x":"300",
            "y":"300"
        },
    "35d917de5c0bd13a49d6e86bb7c540c1":
        {
            "factId":"bc62641cfd029c281b8ce6135d8991e0",
            "id":"35d917de5c0bd13a49d6e86bb7c540c1",
            "parentId":"1",
            "treeId":"35d917de5c0bd13a49d6e86bb7c540c1",
            "x":"400",
            "y":"400"
        }
};

//
// Facts.getAll((facts) => {
//    var i = 0;
//    Object.keys(facts).forEach((factId) => {
//        const tree = new Tree(factId, null)
//        tree.x = 100 * i;
//        tree.y = 100 * i;
//        trees[tree.id] = tree;
//        i++;
//    })
// })

export class Trees {
    static getAll(success){
        if (Config.offlineMode){
            success(trees)
        }
    }
    static get(treeId, success){
        let tree;
        if (Config.offlineMode){
            tree = offlineTreesData[treeId]
            success(tree)
        } else {
           firebase.database().ref('trees/' + treeId).on("value", function(snapshot){
               tree = snapshot.val()
               success(tree)
           })
        }
    }
}
