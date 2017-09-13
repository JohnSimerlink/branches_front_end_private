import merge from 'lodash.merge'
import {addTreeNodeToGraph, getCamera, cameraToGraphPosition, graphToCameraPosition, getTreeUINode} from '../components/knawledgeMap/knawledgeMap'
import {Trees} from './trees'

import ContentItems from "./contentItems";

import {Fact} from './fact';
import {Heading} from './heading';
import {Skill} from './skill';
import {PROFICIENCIES} from "../components/proficiencyEnum";
import {Tree} from "./tree";


export const newNodeXOffset = -25
export const newNodeYOffset = -25

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

    const parentTreeUINode = getTreeUINode(parentTreeId)
    let level = 5 // eventually get the laevel from the property on the parent tree - but right now that is not stored in db
    // console.log('newTree.js parentTree UI Node', parentTreeUINode, parentTreeUINode['renderer1:x'],parentTreeUINode['renderer1:y'], cameraToGraphPosition(parentTreeUINode['renderer1:x'],parentTreeUINode['renderer1:y']), cameraToGraphPosition(parentTreeUINode['read_cam0:x'],parentTreeUINode['read_cam0:y']))


    // const cameraScaleFactor = 1/ getCamera().ratio
    let xOffset = newNodeXOffset * getCamera().ratio
    let yOffset = newNodeXOffset * getCamera().ratio

    const {x: parentTreeCameraX, y: parentTreeCameraY} = graphToCameraPosition(parentTreeUINode.x, parentTreeUINode.y)
    let newChildTreeCameraX = parentTreeCameraX + xOffset
    let newChildTreeCameraY = parentTreeCameraY + yOffset
    var newChildTreeGraphPosition = cameraToGraphPosition(newChildTreeCameraX, newChildTreeCameraY)
    const {x: newChildTreeX, y: newChildTreeY} = newChildTreeGraphPosition

    console.log('1: ParentTree Position is', parentTreeUINode.x, parentTreeUINode.y)
    console.log('2: ParentTree camera Position is', parentTreeCameraX, parentTreeCameraY)
    console.log('3: ChildTree camera Position is', newChildTreeCameraX, newChildTreeCameraY)
    console.log("4: ChildTree Position is", newChildTreeGraphPosition.x,newChildTreeGraphPosition.y)
    console.log("5: zoom is", getCamera().ratio)


    var tree = new Tree(newContent.id, newContent.type, parentTreeId, parentTreeUINode.degree + 1, newChildTreeX, newChildTreeY)

    newContent.addTree(tree.id)
    addTreeNodeToGraph(tree,newContent, level)
    try {
        const parentTreePromise = Trees.get(parentTreeId)
        const parentTree = await parentTreePromise
        parentTree.addChild(tree.id)
    } catch (err) {
        console.error('parent tree couldn\'t be added because of ', err)
    }
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
