import merge from 'lodash.merge'
import {
    addTreeNodeToGraph, getCamera, cameraToGraphPosition, graphToCameraPosition, getTreeUINode,
    connectTreeToParent
} from '../components/knawledgeMap/knawledgeMap'
import {Trees} from './trees'

import ContentItems from "./contentItems";

import {Fact} from './fact';
import {Heading} from './heading';
import {Skill} from './skill';
import {PROFICIENCIES} from "../components/proficiencyEnum.ts";
import {Tree} from "./tree/tree";


export const newNodeXOffset = -25
export const newNodeYOffset = -25

export async function newTree(type, parentTreeId,primaryParentTreeContentURI, values){
    let newContent = {};
    values = merge(values, {primaryParentTreeId: parentTreeId, primaryParentTreeContentURI})
    switch(type) {
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
    // newContent.setProficiency(PROFICIENCIES.ONE)

    const parentTreeUINode = getTreeUINode(parentTreeId)
    let level = 5 // eventually get the laevel from the property on the parent tree - but right now that is not stored in db

    // const cameraScaleFactor = 1/ getCamera().ratio
    let xOffset = newNodeXOffset * getCamera().ratio
    let yOffset = newNodeXOffset * getCamera().ratio

    const {x: parentTreeCameraX, y: parentTreeCameraY} = graphToCameraPosition(parentTreeUINode.x, parentTreeUINode.y)
    let newChildTreeCameraX = parentTreeCameraX + xOffset
    let newChildTreeCameraY = parentTreeCameraY + yOffset
    var newChildTreeGraphPosition = cameraToGraphPosition(newChildTreeCameraX, newChildTreeCameraY)
    const {x: newChildTreeX, y: newChildTreeY} = newChildTreeGraphPosition

    var tree = new Tree({contentId: newContent.id, parentId: parentTreeId,x: newChildTreeX, y: newChildTreeY})

    newContent.addTree(tree.id)
    addTreeNodeToGraph(tree,newContent)
    connectTreeToParent(tree, newContent)
    try {
        const parentTreePromise = Trees.get(parentTreeId)
        const parentTree = await parentTreePromise
        parentTree.addChild(tree.id)
        tree.set('level', parentTree.level + 1)
    } catch (err) {
        console.error('parent tree couldn\'t be added because of ', err)
    }
}
