import {Trees} from '../objects/trees.js'
import ContentItem from '../objects/contentItem'
import {Tree} from '../objects/tree.js'
import {Globals} from '../core/globals.js'
import '../core/login.js'
import PubSub from 'pubsub-js'
import Vue from 'vue'
import user from '../objects/user'
var initialized = false;
var s,
    g = {
        nodes: [],
        edges: []
    };
window.g = g
window.s = s;

var newNodeXOffset = -100,
    newNodeYOffset = 20,
    newChildTreeSuffix = "__newChildTree";
var toolTipsConfig = {
    node: [
        {
            show: 'rightClickNode',
            cssClass: 'sigma-tooltip',
            position: 'right',
            template: '',
            renderer: function(node, template) {
                var nodeInEscapedJsonForm = encodeURIComponent(JSON.stringify(node))
                switch(node.type){
                    case 'tree':
                            template = '<div id="vue"><tree id="' + node.id + '"></tree></div>';
                        break;
                    case 'newChildTree':
                        template = '<div id="vue"><newtree parentid="' + node.parentId + '"></newtree></div>';
                        break;
                }
                var result = Mustache.render(template, node)

                return result
            }
        }],
    stage: {
        template:require('./rightClickMenu.html')
    }
};
var noOverlapConfig = {
    nodeMargin: 2.0,
    scaleNodes: 10,
    permittedExpansion: 1.3,
    gridSize: 50
};
loadTreeAndSubTrees(1).then( val => {initSigma();})
function loadTreeAndSubTrees(treeId){
    //todo: load nodes concurrently, without waiting to connect the nodes or add the fact's informations/labels to the nodes
    return Trees.get(treeId)
        .then(onGetTree)
        .catch( err => console.error('trees get err is', err))
}
function onGetTree(tree) {
    var contentPromise = ContentItem.get(tree.contentId)
        .then( function onContentGet(content) {return addTreeNodeToGraph(tree,content)})

    var childTreesPromises = tree.children ? Object.keys(tree.children).map(loadTreeAndSubTrees) : []
    var promises = childTreesPromises
    promises.push(contentPromise)

    return Promise.all(promises)
}

function addTreeNodeToGraph(tree,content){
    const treeUINode = createTreeNodeFromTreeAndContent(tree,content)
    g.nodes.push(treeUINode);
    addNewChildTreeToTree(treeUINode)
    connectTreeToParent(tree,g)
    return content.id
}

export function removeTreeFromGraph(treeId){
    s.graph.dropNode(treeId)
    s.graph.dropNode(treeId + newChildTreeSuffix)
    return Trees.get(treeId).then(tree => {
        var childPromises = tree.children? Object.keys(tree.children).map(removeTreeFromGraph) : []
        return Promise.all(childPromises).then(val => {
            s.refresh()
            return `removed all children of ${treeId}`
        })
    })

}

//recursively load the entire tree
// Instantiate sigma:
function createTreeNodeFromTreeAndContent(tree, content){
    const node = {
        id: tree.id,
        parentId: tree.parentId,
        x: tree.x,
        y: tree.y,
        children: tree.children,
        content: content,
        label: getLabelFromContent(content),
        size: 1,
        color: getTreeColor(tree),
        type: 'tree'
    };
    return node;
}
/**
 * Get tree colors for descending proficiency levels. Default to "existing node" color
 * @param tree
 * @returns {*}
 */
function getTreeColor(tree) {
    if (tree.userProficiencyMap && tree.userProficiencyMap[user.getId()]) {
        let treeProfLevel = tree.userProficiencyMap[user.getId()];
        if (treeProfLevel > 95) return Globals.proficiency_4;
        if (treeProfLevel > 66) return Globals.proficiency_3;
        if (treeProfLevel > 33) return Globals.proficiency_2;
    }
    return Globals.proficiency_1;
}
function getLabelFromContent(content) {
    switch (content.type){
        case "fact":
            return content.question
        case "heading":
            return content.title
    }
}
function createEdgeId(nodeOneId, nodeTwoId){
    return nodeOneId + "__" + nodeTwoId
}
function connectTreeToParent(tree, g){
    if (tree.parentId) {
        const edge = {
            id: createEdgeId(tree.parentId, tree.id),
            source: tree.parentId,
            target: tree.id,
            size: 1,
            color: Globals.existingColor
        };
        g.edges.push(edge);
    }
}
//returns a promise whose resolved value will be a stringified representation of the tree's fact and subtrees

function addNewChildTreeToTree(tree){
    if (tree.children) {
    }
    const newChildTree = {
        id: tree.id + newChildTreeSuffix, //"_newChildTree",
        parentId: tree.id,
        x: parseInt(tree.x) + newNodeXOffset + 100,
        y: parseInt(tree.y) + newNodeYOffset,
        label: '+',
        size: 1,
        color: Globals.newColor,
        type: 'newChildTree'
    }
    const shadowEdge = {
        id: createEdgeId(tree.id, newChildTree.id),
        source: tree.id,
        target: newChildTree.id,
        size: 1,
        color: Globals.newColor
    };
    if (!initialized) {
        g.nodes.push(newChildTree)
        g.edges.push(shadowEdge)
    } else {
        s.graph.addNode(newChildTree)
        s.graph.addEdge(shadowEdge)
        s.refresh()
    }
}
function initSigma(){
    if (initialized) return

    sigma.renderers.def = sigma.renderers.canvas
    s = new sigma({
        graph: g,
        container: 'graph-container'
    });
    window.s = s;
    var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
    s.refresh();

    s.bind('click', onCanvasClick)
    s.bind('outNode', updateTreePosition); // after dragging a node, a user's mouse will eventually leave the node, and we need to update the node's position on the graph
    s.bind('overNode', hoverOverNode)
    initialized = true;
    initSigmaPlugins()
}

function onCanvasClick(e){
    //console.log('canvas click!')
    PubSub.publish('canvas.clicked', true)
    //console.log(e, e.data.node)
    // var X=e['data']['node']['renderer1:x'];
    // var Y=e['data']['node']['renderer1:y'];

    console.log(e.data);
    //console.log("X %s, Y %S", X, Y);
}
function printNodeInfo(e){
    console.log(e, e.data.node)
}
function hoverOverNode(e){
    var node = e.data.node
    console.log('hover over node for node with id', node.id, 'just called')
    console.log('node about to open is', node)
    // Trees.get(node.id).then(tree => Facts.get(tree.factId).then(fact => fact.continueTimer()))
    tooltips.open(node, toolTipsConfig.node[0], node["renderer1:x"], node["renderer1:y"]);
    setTimeout(function(){
        var vm = new Vue(
            {
                el: '#vue'
            }
        )
    },0)//push this bootstrap function to the end of the callstack so that it is called after mustace does the tooltip rendering
}
function updateTreePosition(e){
    console.log("outNODE just called")
    let newX = e.data.node.x
    let newY = e.data.node.y
    let treeId = e.data.node.id;

    if (!s.graph.nodes().find(node => node.id == treeId && node.type === 'tree')){
        return; //node isn't an actual node in the db - its like a shadow node or helper node
    }
    const MINIMUM_DISTANCE_TO_UPDATE_COORDINATES = 20
    Trees.get(treeId).then( tree => {
        if (Math.abs(tree.x - newX) > MINIMUM_DISTANCE_TO_UPDATE_COORDINATES ) {
            tree.set('x', newX)
        }
        if (Math.abs(tree.y - newY) > MINIMUM_DISTANCE_TO_UPDATE_COORDINATES ) {
            tree.set('y', newY)
        }
        return tree
    })
}

//returns sigma tree node
export function addTreeToGraph(parentTreeId, content) {
    //1. delete current addNewNode button
    var currentNewChildTree = s.graph.nodes(parentTreeId + newChildTreeSuffix);
    var newChildTreeX = parseInt(currentNewChildTree.x);
    var newChildTreeY = parseInt(currentNewChildTree.y);
    var tree = new Tree(content.id, content.type, parentTreeId, newChildTreeX, newChildTreeY)
    //2. add new node to parent tree on UI
    const newTree = {
        id: tree.id,
        parentId: parentTreeId,
        contentId: content.id,
        content: content,
        x: newChildTreeX,
        y: newChildTreeY,
        children: {},
        label: getLabelFromContent(content),
        size: 1,
        color: Globals.existingColor,
        type: 'tree'
    }
    //2b. update x and y location in the db for the tree

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
    addNewChildTreeToTree(newTree)
    //5. Re add shadow node to parent
    Trees.get(parentTreeId)
        .then(addNewChildTreeToTree);

    s.refresh();
    return newTree;
}
function initSigmaPlugins() {
    // Instanciate the tooltips plugin with a Mustache renderer for node tooltips:
    var tooltips = sigma.plugins.tooltips(s, s.renderers[0], toolTipsConfig);

    //Instantiate the nooverlap algorithm
    // var listener = s.configNoverlap(noOverlapConfig);
    //s.startNoverlap();

    // Initialize the activeState plugin:
    var activeState = sigma.plugins.activeState(s);

    // Initialize the Select plugin:
    var select = sigma.plugins.select(s, activeState);
    // select.bindKeyboard(keyboard);

    //intialize the drag nodes plugin
    var dragListener = sigma.plugins.dragNodes(s, s.renderers[0],activeState);
    window.tooltips = tooltips;
    window.jump = jumpToAndOpenTreeId;

    // Initialize the lasso plugin:
    var lasso = new sigma.plugins.lasso(s, s.renderers[0], {
      'strokeStyle': 'black',
      'lineWidth': 2,
      'fillWhileDrawing': true,
      'fillStyle': 'rgba(41, 41, 41, 0.2)',
      'cursor': 'crosshair'
    });
    window.lasso = lasso
    select.bindLasso(lasso)
    // lasso.activate()

// halo on active nodes:
    function renderHalo() {
        s.renderers[0].halo({
            nodes: activeState.nodes()
        });
    }

    s.renderers[0].bind('render', function(e) {
        renderHalo();
    });

    //


    // Listen for selectedNodes event
    lasso.bind('selectedNodes', function (event) {
        setTimeout(function() {
            lasso.deactivate();
            s.refresh({ skipIdexation: true });
        }, 0);
    });
    // Listen for selectedNodes event from the lasso instance:
    // lasso.bind('selectedNodes', function (event) {
    //   console.log('event is ', event)
    //   // set all edges as "inactive" to avoid mixing active nodes and edges:
    //   activeState.dropEdges();
    //
    //   // nodes within the lasso area:
    //   var nodes = event.data;
    //
    //   // set all nodes as "inactive" if no node is selected:
    //   if (!nodes.length) activeState.dropNodes();
    //
    //   // add the selected nodes to the "active" nodes:
    //   activeState.addNodes(nodes.map(function(n) { return n.id; }));
    //
    //   setTimeout(function() {
    //     // disable the lasso tool after a selection:
    //     lasso.deactivate();
    //     // refresh the display to see the active nodes:
    //     s.refresh({ skipIdexation: true });
    //   }, 0);
    // });

    // // Enable the lasso tool right now (may be triggered anywhere in the code):
    // lasso.activate();




}


/**
 * Go to a given tree ID on the graph, centering the viewport on the tree
 */
function jumpToAndOpenTreeId(treeid) {
    //let tree = sigma.nodes[treeid];
    let goToNode = s.graph.nodes().find(function(node) { return node.id === treeid });
    focusNode(s.cameras[0], goToNode);

    // Trees.get(node.id).then(tree => Facts.get(tree.factId).then(fact => fact.continueTimer()))
    console.log('node about to open is ',goToNode)
    tooltips.open(goToNode, toolTipsConfig.node[0], goToNode["renderer1:x"], goToNode["renderer1:y"]);
}

function focusNode(camera, node) {
    if (!node) {
        console.error("Tried to go to node");
        console.error(node);
        return;
    }
    let cameraCoord = {
        x: node['read_cam0:x'],
        y: node['read_cam0:y'],
        ratio: 0.1
    };
    camera.goTo(cameraCoord);
    // sigma.misc.animation.camera(
    //     camera,
    //     {
    //         x: node['read_cammain:x'],
    //         y: node['read_cammain:y'],
    //         ratio: 0.075
    //     },
    //     {
    //         duration: 150
    //     }
    // );
}