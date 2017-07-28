//import getFirebase from './firebaseService.js'
//const firebase = getFirebase();
import {addTreeToGraph} from '../components/treesGraph.js'
import {Trees} from './trees'
import {ContentItem} from "./contentItem";

import {Fact} from './fact';
import {Heading} from './heading';


export function newTree(nodeType, parentTreeId, values){
    let newContent = {};

    switch(nodeType) {
        case 'fact':
            newContent = ContentItem.create(new Fact(values.question, values.answer, values.id));
            break;
        case 'heading':
            newContent = ContentItem.create(new Heading(values.title));
            break;
        default:
            newContent = ContentItem.create(new Fact(values.question, values.answer, values.id));
            break;
    }

    const tree = addTreeToGraph(parentTreeId, newContent);
    //TODO add a new tree to db and UI by dispatching a new Tree REDUX action
    //TODO: ^^^ and that action should use the Trees/Tree ORMs we have rather than manually using the db api (bc we may want to swap out db)
    Trees.get(parentTreeId).then(parentTree => {
        parentTree.addChild(tree.id)
    });
    newContent.addTree(tree.id)
}