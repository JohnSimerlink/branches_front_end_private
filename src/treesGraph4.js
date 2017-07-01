import {Trees} from './trees.js'
import {Facts} from './facts.js'
import {Globals} from './globals.js'
import {Redux} from './redux.js'
var s,
    g = {
        nodes: [],
        edges: []
    };

var newNodeXOffset = -100,
    newNodeYOffset = 100,
    newChildTreeSuffix = "__newChildTree";

// Generate a random graph:

var numTreesLoaded = 0;
loadTreeAndSubTrees(1)
// Instantiate sigma:
function loadTreeAndSubTrees(treeId){
    console.log('loadTreeAndSubTrees just called')
    numTreesLoaded++;
    console.log('1num trees loaded is ', numTreesLoaded)
    Trees.get(treeId, function(tree){
        console.log("TREESGRAPH2.JS: Trees.get callback tree is", tree)
        Facts.get(tree.factId, function(fact){
            console.log("TREESGRAPH2.JS: Facts.get callback is this. fact is", fact)
            const node = {
                id: tree.treeId,
                parentId: tree.parentId,
                x: tree.x,
                y: tree.y,
                label: fact.question + "  " + fact.answer,
                size: 1,
                color: '#0FF',
                type: 'tree'
            }
            console.log("TREESGRAPH2.JS: node is", node)
            g.nodes.push(node);
            const shadowNode = {
                id: treeId + newChildTreeSuffix, //"_newChildTree",
                parentId: treeId,
                x: parseInt(tree.x) + newNodeXOffset,
                y: parseInt(tree.y) + newNodeYOffset,
                label: 'Create a new Fact',
                size: 1,
                color: '#F0F',
                type: 'newChildTree'
            }
            console.log("TREESGRAPH2.js nodess is ", g.nodes)
            g.nodes.push(shadowNode)
            g.edges.push({
                id: node.id + "__" + shadowNode.id,
                source: node.id,
                target: shadowNode.id,
                size: 1,
                color: '#F0F'
            })
            console.log("TREESGRAPH2.js nodess is ", g.nodes)
            if (tree.parentId) {
                g.edges.push({
                    id: tree.parentId + "__" + tree.id,
                    source: tree.parentId,
                    target: tree.id,
                    size: 1,
                    color: '#FF0'
                })
            }
            if (numTreesLoaded > 2){
                console.log('num treesloaded is ', numTreesLoaded)
                initSigma()
            }
        })
        tree.children && tree.children.forEach((childId) => {
            loadTreeAndSubTrees(childId)
        })
    })

}

var initialized = false;
function initSigma(){
    if (!initialized){
        sigma.renderers.def = sigma.renderers.canvas
        s = new sigma({
            graph: g,
            container: 'graph-container'
        });
        var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
        s.refresh();

        s.bind('clickNode', function(e) {
            console.log('event is e', e)
            console.log(e.type, e.data.node.label, e.data.captor);
            let parentId = e.data.node.parentId;
            if (e.data.node.type == 'tree'){

            }
            // let parentTreeId = e.data.node.id.substring(0,e.data.node.id.indexOf("_"));
            console.log('parent tree id selected was', parentId)
            document.querySelector("#parentTreeId").value = parentId
            Globals.currentTreeSelected = parentId;
            console.log('g nodes is', g.nodes)
        });
        initialized = true;
    }
}

function newTree(parentTree, fact){
    //delete current addNewNode button
    var currentNewChildTree = g.nodes(treeId + newChildTreeSuffix);
    var newChildTreeX = currentNewChildTree.x;
    var newChildTreeY = currentNewChildTree.y;
    var newChildNodeId = g.nodes(treeId + newChildTreeSuffix).id
    g.dropNode(newChildNodeId)

    var newTree = new Tree(fact.id,parentTree.id)
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
    //re add a add new new tree button onto the parent tree.
}

// function getNewChildTreeNode(treeId){
//         return g.nodes(treeId + newChildTreeSuffix})
// }
