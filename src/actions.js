function addTree(parentTreeId){

}


import {Globals} from './globals.js'
function addTree(parentTreeId, fact, x,y, graph) {
    //delete current addNewNode button
    var currentNewChildTree = g.nodes(parentTreeId + Globals.newChildTreeSuffix);
    var newChildTreeX = currentNewChildTree.x;
    var newChildTreeY = currentNewChildTree.y;
    var newChildNode = g.nodes(parentTreeId + newChildTreeSuffix);
    var newTree = new Tree(fact.id, parentTree.id)
    //add new node to parent tree
    const newTree = {
        id: newTree.id,
        parentId: parentTree.id,
        x: parseInt(newChildNode.x),
        y: parseInt(newChildNode.y),
        label: fact.question + ' ' + fact.answer,
        size: 1,
        color: '#F0F',
        type: 'tree'
    }
    g.dropNode(newChildNode.id)
    //add edge between new node and parent tree
    const newEdge = {
        id: parentTreeId + "__" + newChildNode.id,
        source: parentTreeId,
        target: newTree.id,
        size: 1,
        color: Globals.existingColor,
    }
    //trigger some db method/action to fill in the parent and child properties between the two trees
    //re add a add new new tree button onto the parent tree.
}


