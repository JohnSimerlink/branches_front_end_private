import {Trees} from './trees.js'
import {Tree} from './tree.js'
import {Facts} from './facts.js'
import {Globals} from './globals.js'
import {Redux} from './redux.js'
var initialized = false;
var s,
    g = {
        nodes: [],
        edges: []
    };
window.g = g
window.s = s;

var newNodeXOffset = -100,
    newNodeYOffset = 100,
    newChildTreeSuffix = "__newChildTree";


var numTreesLoaded = 0;
loadTreeAndSubTrees(1).then( val => {console.log(`loadTree has allegedly resolved. resolve val is ${val}`); initSigma()}/*.then(initSigma)*/)
// Instantiate sigma:
function createTreeNodeFromTreeAndFact(tree, fact){
    const node = {
        id: tree.id,
        parentId: tree.parentId,
        x: tree.x,
        y: tree.y,
        children: tree.children,
        label: fact.question + "  " + fact.answer,
        size: 1,
        color: Globals.existingColor,
        type: 'tree'
    }
    return node;
}
function connectTreeToParent(tree, g){
    console.log(`Connect tree ${tree.id} to parent ${tree.parentId} called`)
    if (tree.parentId) {
        console.log('Connect tree to parent called - tree has parentId')
        const edge = {
            id: tree.parentId + "__" + tree.id,
            source: tree.parentId,
            target: tree.id,
            size: 1,
            color: Globals.existingColor
        };
        console.log('L55:TREESGRAPH.JS Edge before push is', edge)
        g.edges.push(edge);
    }
}
function onGetFact(tree,fact){
    const node = createTreeNodeFromTreeAndFact(tree,fact)
    g.nodes.push(node);
    addShadowNodeToTree(node)
    tree.parentId && connectTreeToParent(tree,g)
    return fact.id
}
function onGetTree(tree) {
    var factsPromise = Facts.get(tree.factId)
        .then( fact => onGetFact(tree,fact))
        .then( factId => {console.log('onGetTree fact id is', factId); return factId})
        .catch( err => console.log(`facts get err for treeid of  ${tree.id} with factid of ${tree.factId} is `, err))

    var childTreesPromises = tree.children ? tree.children.map(loadTreeAndSubTrees) : []
    var promises = childTreesPromises
    promises.push(factsPromise)

    return Promise.all(promises).then((resultsArray) => {
        console.log('promise results array is', resultsArray)
        var factIdPrettyString = resultsArray.shift();
        var treeIdsPrettyStrings = resultsArray.join(', ')
        console.log('tree with id', tree.id,' and children of', tree.children,' has finished loading')
        var treePrettyString = "( " + factIdPrettyString + " : [ " + treeIdsPrettyStrings + " ] )"
        console.log('its pretty string is', treePrettyString)
        return treePrettyString
    }) //promise should only resolve when the tree's fact and all the subtrees are loaded
}
//returns a promise whose resolved value will be a stringified representation of the tree's fact and subtrees
function loadTreeAndSubTrees(treeId){
    //todo: load nodes concurrently, without waiting to connect the nodes or add the fact's informations/labels to the nodes
    numTreesLoaded++;
    return Trees.get(treeId)
        .then(onGetTree)
        .catch( err => console.log('trees get err is', err))
}

function addShadowNodeToTree(tree){
    if (tree.children) {
    }
    const shadowNode = {
        id: tree.id + newChildTreeSuffix, //"_newChildTree",
        parentId: tree.id,
        x: parseInt(tree.x) + newNodeXOffset,
        y: parseInt(tree.y) + newNodeYOffset,
        label: 'Create a new Fact',
        size: 1,
        color: Globals.newColor,
        type: 'newChildTree'
    }
    const shadowEdge = {
        id: tree.id + "__" + shadowNode.id,
        source: tree.id,
        target: shadowNode.id,
        size: 1,
        color: Globals.newColor
    };
    if (!initialized) {
        g.nodes.push(shadowNode)
        g.edges.push(shadowEdge)
    } else {
       s.graph.addNode(shadowNode)
       s.graph.addEdge(shadowEdge)
    }
    if (initialized){
        s.refresh()
    }
}
function initSigma(){
    if (!initialized){
        sigma.renderers.def = sigma.renderers.canvas
        s = new sigma({
            graph: g,
            container: 'graph-container'
        });
        window.s = s;
        var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
        s.refresh();

        s.bind('clickNode', clickNode);
        initialized = true;
    }
}
window.initSigma = initSigma;
function clickNode(e){
    console.log(e.type, e.data.node, e.data.node.label, e.data.captor);
    let parentId = e.data.node.parentId;
    if (e.data.node.type == 'tree'){

    }
    // let parentTreeId = e.data.node.id.substring(0,e.data.node.id.indexOf("_"));
    document.querySelector("#parentTreeId").value = parentId
    Globals.currentTreeSelected = parentId;
}

//returns sigma tree node
export function addTreeToGraph(parentTreeId, fact) {
    //1. delete current addNewNode button
    var currentNewChildTree = s.graph.nodes(parentTreeId + newChildTreeSuffix);
    var newChildTreeX = currentNewChildTree.x;
    var newChildTreeY = currentNewChildTree.y;
    var tree = new Tree(fact.id, parentTreeId)
    //2. add new node to parent tree
    const newTree = {
        id: tree.id,
        parentId: parentTreeId,
        x: parseInt(currentNewChildTree.x),
        y: parseInt(currentNewChildTree.y),
        children: tree.children,
        label: fact.question + ' ' + fact.answer,
        size: 1,
        color: Globals.existingColor,
        type: 'tree'
    }

    s.graph.dropNode(currentNewChildTree.id)
    s.graph.addNode(newTree);
    //3. add edge between new node and parent tree
    const newEdge = {
        id: parentTreeId + "__" + newTree.id,
        source: parentTreeId,
        target: newTree.id,
        size: 1,
        color: Globals.existingColor
    }
    s.graph.addEdge(newEdge)
    //4. add shadow node
    addShadowNodeToTree(newTree)
    //5. Re add shadow node to parent
    Trees.get(parentTreeId)
        .then(addShadowNodeToTree);

    s.refresh();
    return newTree;
}
