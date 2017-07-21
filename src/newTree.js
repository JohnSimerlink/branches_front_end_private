import {newFact} from './newfact.js';
import getFirebase from './firebaseService.js'
const firebase = getFirebase();
import {addTreeToGraph} from './treesGraph.js'
import {Trees} from './trees'
export function newTree(question, answer, parentTreeId){
    var fact = newFact(question, answer)

    console.log('==========data before addTreeToGraph is', parentTreeId, fact)
    const tree = addTreeToGraph(parentTreeId, fact)
    //TODO add a new tree to db and UI by dispatching a new Tree REDUX action
    //TODO: ^^^ and that action should use the Trees/Tree ORMs we have rather than manually using the db api (bc we may want to swap out db)
    Trees.get(parentTreeId).then(parentTree => {
        parentTree.addChild(tree.id)
    })
    fact.addTree(tree.id)
}