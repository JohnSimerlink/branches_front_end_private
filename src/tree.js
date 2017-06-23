import md5 from 'md5'
import getFirebase from './firebaseService.js';
const firebase = getFirebase();
const treesRef = firebase.database().ref('trees');
const devOfflineMode = true;
const trees = {};
export class OnlineTree {
  constructor(fact_id){
    let parent_id = null;
    let children = [];
    const treeObj = {fact_id, parent_id, children}
    const tree_id = md5(treeObj)
    if (devOfflineMode) {
        // trees[tree_id]
      trees.push({fact_id,parent_id, children})
    }
    this.treeRef = treesRef.push({
        fact_id,
        parent_id,
        children,
    })
  }
  addChild(tree_id){
    this.treeRef.child('children').push(tree_id)
  }
  removeChild(tree_id){

  }
  changeParent(new_parent_id){
    this.treeRef.update({
      parent_id: new_parent_id
    })
  }
}
export class Tree {
  constructor (factId, parentId){
    this.factId = factId;
    this.parentId = parentId;
    this.children = [];
    this.id = md5(JSON.stringify({factId:factId, parentId:parentId, children: this.children})) // id mechanism for trees may very well change
  }
}
/*
facts can have dependencies

trees can have dependencies

trees can have children

*/