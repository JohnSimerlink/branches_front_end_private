import getFirebase from './firebaseService.js'
const firebase = getFirebase();
import {addTreeToGraph} from '../components/treesGraph.js'
import {Trees} from './trees'
import {Facts} from './facts'
//todo: change newTree to Trees.create()
export function newTree(question, answer, parentTreeId){
    var fact = Facts.create({question,answer})
    const tree = addTreeToGraph(parentTreeId, fact)
    //TODO add a new tree to db and UI by dispatching a new Tree REDUX action
    //TODO: ^^^ and that action should use the Trees/Tree ORMs we have rather than manually using the db api (bc we may want to swap out db from firebase to neo4j or couchdb)
    Trees.get(parentTreeId).then(parentTree => {
        parentTree.addChild(tree.id)
    })
    fact.addTree(tree.id)
}