import {Globals} from './globals.js'
function addTree(parentTreeId, factId, x,y, graph){

    //delete current addNewNode button

    var currentNewChildTree = g.nodes(parentTreeId + Globals.newChildTreeSuffix);
    var newChildTreeX = currentNewChildTree.x;
    var newChildTreeY = currentNewChildTree.y;
    var newChildNodeId = g.nodes(treeId + newChildTreeSuffix).id
    g.dropNode(newChildNodeId)

    var newTree = new Tree(factId, parentTree.id)
    //add new node to parent tree
    const newTree = {
        id: newTree.id,
        parentId: parentTree.id,
        x: parseInt(tree.x) + newNodeXOffset,
        y: parseInt(tree.y) + newNodeYOffset,
        label: 'Create a new Fact',
        size: 1,
        color: '#F0F',
        type: 'newChildTree'
    }
    //add edge between new node and parent tree
    //trigger some db method/action to fill in the parent and child properties between the two trees
    //re add a add new new tree button onto the parent tree.

}