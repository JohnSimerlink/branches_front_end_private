import md5 from 'md5'
import getFirebase from './firebaseService.js';
const firebase = getFirebase();
const treesRef = firebase.database().ref('trees');
export class Tree {
  constructor(fact_id){
    let parent_id = null;
    let children = [];
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
/*
facts can have dependencies

trees can have dependencies

trees can have children

*/