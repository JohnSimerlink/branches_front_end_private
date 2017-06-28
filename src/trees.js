import {Facts} from './facts.js'
import {Tree} from './tree.js'
const offlineDevMode = true;
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
        if (offlineDevMode){
            success(trees)
        }
    }
    static get(treeId, success){
        if (offlineDevMode){
            const tree = trees[treeId]
            success(tree)
        }
    }
}
