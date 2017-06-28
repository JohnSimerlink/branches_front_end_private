import {Facts} from './facts.js'
import {Tree} from './tree.js'
import {Config} from './config.js'
import getFirebase from './firebaseService.js'
const firebase = getFirebase()
console.log('trees.js imported')
const trees = {
}
Facts.getAll((facts) => {
   var i = 0;
   Object.keys(facts).forEach((factId) => {
       const tree = new Tree(factId, null)
       tree.x = 100 * i;
       tree.y = 100 * i;
       trees[tree.id] = tree;
       i++;
   })
})

export class Trees {
    static getAll(success){
        if (Config.offlineMode){
            success(trees)
        }
    }
    static get(treeId, success){
        if (Config.offlineMode){
            const tree = trees[treeId]
            success(tree)
        } else {
            console.log('TREES.JS; trees .get called')
           firebase.database().ref('trees/' + treeId).on("value", function(snapshot){
               console.log('TREES.JS; snapshot from trees.get is', snapshot.val())
               success(snapshot.val())
           })
        }
    }
}
