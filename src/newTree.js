import {newFact} from './newfact.js';
import getFirebase from './firebaseService.js'
const firebase = getFirebase();
import {addTreeToGraph} from './treesGraph.js'
export function newTree(question, answer, parentId){
    var fact = newFact(question, answer)
    var parentTreeId = parentId

    console.log('==========data before addTreeToGraph is', parentTreeId, fact)
    const tree = addTreeToGraph(parentTreeId, fact)
    //TODO add a new tree to db and UI by dispatching a new Tree REDUX action
    //TODO: ^^^ and that action should use the Trees/Tree ORMs we have rather than manually using the db api (bc we may want to swap out db)
    var updates = {};
    updates['/trees/' + tree.id] = tree;
    firebase.database().ref().update(updates)
    var parentNodeChildrenRef = firebase.database().ref('/trees/' + parentTreeId + '/children');
    var updates = {  }
    updates[tree.id] = true
    parentNodeChildrenRef.update(updates);
}