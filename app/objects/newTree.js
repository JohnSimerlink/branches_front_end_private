import merge from 'lodash.merge'
import {addTreeToGraph} from '../components/knawledgeMap/knawledgeMap'
import {Trees} from './trees'

import ContentItems from "./contentItems";

import {Fact} from './fact';
import {Heading} from './heading';
import {Skill} from './skill';
import {PROFICIENCIES} from "../components/proficiencyEnum";


export function newTree(nodeType, parentTreeId,initialParentTreeContentURI, values){
    let newContent = {};
    values = merge(values, {initialParentTreeId: parentTreeId, initialParentTreeContentURI})
    switch(nodeType) {
        case 'fact':
            newContent = ContentItems.create(new Fact(values));
            break;
        case 'heading':
            newContent = ContentItems.create(new Heading(values));
            break;
        case 'skill':
            newContent = ContentItems.create(new Skill(values));
            break;
        default:
            newContent = ContentItems.create(new Fact(values));
            break;
    }

    console.log('new content just created is', newContent)
    newContent.setProficiency(PROFICIENCIES.ONE)
    const tree = addTreeToGraph(parentTreeId, newContent);
    console.log('new Tree created is', tree)
    //TODO add a new tree to db and UI by dispatching a new Tree REDUX action
    //TODO: ^^^ and that action should use the Trees/Tree ORMs we have rather than manually using the db api (bc we may want to swap out db)
    Trees.get(parentTreeId).then(parentTree => {
        parentTree.addChild(tree.id)
    });
    newContent.addTree(tree.id)
}
