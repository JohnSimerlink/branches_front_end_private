import md5 from 'md5'
import getFirebase from './firebaseService.js';
const firebase = getFirebase();
const treesRef = firebase.database().ref('trees');
//singleton
var singletonInitialized = false;
class Trees {
  constructor(){
    if (singletonInitialized){
      throw new Error("Error! Can only initialize Trees singleton once");
    }else {
      singletonInitialized = true;
    }
    this.gottenFirst20 = false;
  }
  //todo make return promise
  get(treeId){

  }
  //todo make return promise
  getAll(treeId){

  }
}
const Trees = {
  gottenFirst20: false,
  // first20Trees
  //todo make return a promise instead
  getAll: function() {
    const first20Trees = treesRef.limitToLast(20);

  }
}

var factsRef = firebase.database().ref('facts').limitToLast(20);
  factsRef.on('value', function(snapshot){
    var ffacts = snapshot.val();
    // console.log("firebase data is" + JSON.stringify(ffacts));
    Object.keys(ffacts).forEach( (key) => {
      var fact = ffacts[key];
      factListObj.data.push(fact);
      // console.log('fact list data is', factListObj.data);
      // addFactToList(fact);
      // console.log('adding fact to list', fact);
    })
    
  }, function (errorObject) {
    // console.log('The read failed: ' + errorObject.code);
  });






export Trees;
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