import merge from 'lodash.merge'
import {addTreeNodeToGraph, addTreeToGraph} from '../components/knawledgeMap/knawledgeMap'
import {Trees} from './trees'

import ContentItems from "./contentItems";

import {Fact} from './fact';
import {Heading} from './heading';
import {Skill} from './skill';
import {PROFICIENCIES} from "../components/proficiencyEnum";
import {Tree} from "./tree";

export const newNodeXOffset = -2
export const newNodeYOffset = -2

export async function newTree(nodeType, parentTreeId,primaryParentTreeContentURI, values){
    let newContent = {};
    values = merge(values, {initialParentTreeId: parentTreeId, primaryParentTreeContentURI})
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
    newContent.setProficiency(PROFICIENCIES.ONE)

    const parentTree = await Trees.get(parentTreeId)
    let level = 5 // eventually get the laevel from the property on the parent tree - but right now that is not stored in db
    var newChildTreeX = parseInt(parentTree.x) + newNodeXOffset;
    var newChildTreeY = parseInt(parentTree.y) + newNodeYOffset;
    var tree = new Tree(newContent.id, newContent.type, parentTreeId, parentTree.degree + 1, newChildTreeX, newChildTreeY)
    parentTree.addChild(tree.id)
    newContent.addTree(tree.id)
    addTreeNodeToGraph(tree,newContent, level)
    //
    //
    // console.log('new content just created is', newContent)
    // const tree = addTreeToGraph(parentTreeId, newContent);
    // console.log('new Tree created is', tree)
    // //TODO add a new tree to db and UI by dispatching a new Tree REDUX action
    // //TODO: ^^^ and that action should use the Trees/Tree ORMs we have rather than manually using the db api (bc we may want to swap out db)
    // Trees.get(parentTreeId).then(parentTree => {
    // });
}
