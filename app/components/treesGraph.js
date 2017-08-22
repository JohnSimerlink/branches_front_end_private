import {Trees} from '../objects/trees.js'
import ContentItem from '../objects/contentItem'
import {Tree} from '../objects/tree.js'
import {Globals} from '../core/globals.js'
import '../core/login.js'

import Vue from 'vue'
import user from '../objects/user'
var initialized = false;
var s,
    g = {
        nodes: [],
        edges: []
    },

    positions = [
        'top-right',
        'top-left',
        'bottom-left',
        'bottom-right'
    ],
    icons = [
        "\uF11b",
        "\uF11c",
        "\uF11d",
        "\uF128",
        "\uF129",
        "\uF130",
        "\uF131",
        "\uF132"
    ]


window.g = g
window.s = s;
sigma.settings.font = 'Fredoka One'

var newNodeXOffset = -500,
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
loadTreeAndSubTrees(1,1).then( val => {initSigma();})
function loadTreeAndSubTrees(treeId, level){
    //todo: load nodes concurrently, without waiting to connect the nodes or add the fact's informations/labels to the nodes
    return Trees.get(treeId)
        .then(tree => {
            return onGetTree(tree, level)
        })
        .catch( err => console.error('trees get err is', err))
}

function onGetTree(tree, level) {
    var contentPromise = ContentItem.get(tree.contentId)
        .then( function onContentGet(content) {return addTreeNodeToGraph(tree,content, level)})

    var childTreesPromises = tree.children ? Object.keys(tree.children).map((child) => {
        return loadTreeAndSubTrees(child, level + 1)
        }): []
    //     loadTreeAndSubTrees
    // }) : []
    var promises = childTreesPromises
    promises.push(contentPromise)

    return Promise.all(promises)
}

function addTreeNodeToGraph(tree,content, level){
    const treeUINode = createTreeNodeFromTreeAndContent(tree,content, level)

    g.nodes.push(treeUINode);
    connectTreeToParent(tree,g)
    return content.id
}

export function removeTreeFromGraph(treeId){
    s.graph.dropNode(treeId)
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
function createTreeNodeFromTreeAndContent(tree, content, level){
    const node = {
        id: tree.id,
        parentId: tree.parentId,
        level,
        x: tree.x,
        y: tree.y,
        children: tree.children,
        content: content,
        label: getLabelFromContent(content),
        size: 1,
        color: getTreeColor(tree),
        type: 'tree',
    };
    return node;
}
/**
 * Get tree colors for descending proficiency levels. Default to "existing node" color
 * @param tree
 * @returns {*}
 */
function getTreeColor(tree) {
    let proficiency = tree.userProficiencyMap && tree.userProficiencyMap[user.getId()]
    if (proficiency >= 0) return proficiencyToColor(proficiency)
    return Globals.colors.proficiency_unknown
}
export function proficiencyToColor(proficiency){
    if (proficiency >= 95) return Globals.colors.proficiency_4;
    if (proficiency >= 66) return Globals.colors.proficiency_3;
    if (proficiency >= 33) return Globals.colors.proficiency_2;
    return Globals.colors.proficiency_1;
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
            color: Globals.colors.proficiency_unknown
        };
        g.edges.push(edge);
    }
}
//returns a promise whose resolved value will be a stringified representation of the tree's fact and subtrees

function initSigma(){
    if (initialized) return

    sigma.renderers.def = sigma.renderers.canvas
    sigma.canvas.labels.def = sigma.canvas.labels.prioritizable
    s = new sigma({
        graph: g,
        container: 'graph-container',
        glyphScale: 0.7,
        glyphFillColor: '#666',
        glyphTextColor: 'white',
        glyphStrokeColor: 'transparent',
        glyphFont: 'FontAwesome',
        glyphFontStyle: 'normal',
        glyphTextThreshold: 6,
        glyphThreshold: 3

    });
    window.s = s;
    var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
    s.refresh();

    s.bind('mousedown', function(){
        console.log('mousedown')
    })
    s.bind('click', onCanvasClick)
    // s.bind('outNode', updateTreePosition); // after dragging a node, a user's mouse will eventually leave the node, and we need to update the node's position on the graph
    PubSub.subscribe('canvas.startDraggingNode', (eventName, node) => {
        // console.log('CANVAS.startDraggingNode subscribe called',eventName, node, node.id, node.x, node.y)
    })
    PubSub.subscribe('canvas.stopDraggingNode', (eventName, node) => {
        // console.log("canvas.stopDraggingNode subscribe called",eventName, node, node.id, node.x, node.y)
        updateTreePosition({newX: node.x, newY: node.y, treeId: node.id})
    })
    s.bind('overNode', hoverOverNode)
    s.bind('dragEnd', function(){
        console.log('dragend called!')
    })
    s.bind('drop', function(){
        console.log('drop called!')
    })
    s.bind('dragstart', function(){
        console.log('drag start called!')
    })
    initialized = true;
    initSigmaPlugins()
}

function onCanvasClick(e){
    PubSub.publish('canvas.clicked', true)
    console.log(e, e.data.x,e.data.y,e.data.clientX,e.data.clientY)
    // var X=e['data']['node']['renderer1:x'];
    // var Y=e['data']['node']['renderer1:y'];

    //console.log("X %s, Y %S", X, Y);
}
PubSub.subscribe('canvas.clicked', function() {
    PubSub.publish('canvas.closeTooltip')
})
function printNodeInfo(e){
    console.log(e, e.data.node)
}
function hoverOverNode(e){
    // console.log('hoverOverNode event called', ...arguments)
    PubSub.publish('canvas.closeTooltip') // close any existing tooltips, so as to stop their timers from counting
    var node = e.data.node
    tooltips.open(node, toolTipsConfig.node[0], node["renderer1:x"], node["renderer1:y"]);
    setTimeout(function(){
        var vm = new Vue(
            {
                el: '#vue'
            }
        )
    },0)//push this bootstrap function to the end of the callstack so that it is called after mustace does the tooltip rendering
}
export function syncGraphWithNode(treeId){
    Trees.get(treeId).then(tree => {
        var sigmaNode = s.graph.nodes(treeId)
        // console.log('sigmaNode X/Y initial =', sigmaNode, sigmaNode.x, sigmaNode.y)
        sigmaNode.x = tree.x
        sigmaNode.y = tree.y
        // console.log('sigmaNode X/Y after =', sigmaNode, sigmaNode.x, sigmaNode.y)
        s.refresh()
    })
}
function updateTreePosition(data){
    let {newX, newY, treeId} = data
    // console.log('update tree position called!', newX, newY, treeId, data)
    // let newX = e.data.node.x
    // let newY = e.data.node.y
    // let treeId = e.data.node.id;

    if (!s.graph.nodes().find(node => node.id == treeId && node.type === 'tree')){
        return; //node isn't an actual node in the db - its like a shadow node or helper node
    }
    const MINIMUM_DISTANCE_TO_UPDATE_COORDINATES = 20
    Trees.get(treeId).then( tree => {
        let deltaX = newX - tree.x
        if (Math.abs(deltaX) > MINIMUM_DISTANCE_TO_UPDATE_COORDINATES ) {
            tree.addToX({recursion: true, deltaX})
        }
        let deltaY = newY - tree.y
        if (Math.abs(deltaY) > MINIMUM_DISTANCE_TO_UPDATE_COORDINATES ) {
            tree.addToY({recursion: true, deltaY})
        }
        return tree
    })
}


//returns sigma tree node
export function addTreeToGraph(parentTreeId, content) {
    //1. delete current addNewNode button
    var parentTree = s.graph.nodes(parentTreeId);
    var newChildTreeX = parseInt(parentTree.x) + newNodeXOffset;
    var newChildTreeY = parseInt(parentTree.y) + newNodeYOffset;
    var tree = new Tree(content.id, content.type, parentTreeId, parentTree.degree + 1, newChildTreeX, newChildTreeY)
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
        type: 'tree',
    }
    //2b. update x and y location in the db for the tree

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

    s.refresh();
    return newTree;
}
function initSigmaPlugins() {
    // Instantiate the tooltips plugin with a Mustache renderer for node tooltips:
    var tooltips = sigma.plugins.tooltips(s, s.renderers[0], toolTipsConfig);
    // var dragListener = sigma.plugins.dragNodes(s, s.renderers[0],activeState);
    window.tooltips = tooltips;
    window.jump = jumpToAndOpenTreeId;
    jumpToAndOpenTreeId('d739bbe3d09aa564f92d69e1ef3093f5')

    var myRenderer = s.renderers[0];

    // console.log('my renderenr is', myRenderer, s.renderers)
}

PubSub.subscribe('canvas.zoom', function(a,b,c,d){
    console.log('canvas zoom called in treesGraph js')
})
/**
 * Go to a given tree ID on the graph, centering the viewport on the tree
 */
function jumpToAndOpenTreeId(treeid) {
    //let tree = sigma.nodes[treeid];
    let node = s.graph.nodes().find(function(node) { return node.id === treeid });
    focusNode(s.cameras[0], node);

    console.log('node about to open is ',node)
    tooltips.open(node, toolTipsConfig.node[0], node["renderer1:x"], node["renderer1:y"]);
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