import {Trees} from '../objects/trees.js'
import ContentItems from '../objects/contentItems'
import {Tree} from '../objects/tree.js'
import {Globals} from '../core/globals.js'
import '../core/login.js'

import Vue from 'vue'
import user from '../objects/user'
import * as utils from '../core/utils';

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


var newNodeXOffset = -2,
    newNodeYOffset = 2;
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
    // stage: {
    //     template:require('./rightClickMenu.html')
    // }
};

PubSub.subscribe('login', () => {
    loadTreeAndSubTrees(1,1).then( val => {initSigma();})
})
function loadTreeAndSubTrees(treeId, level){
    //todo: load nodes concurrently, without waiting to connect the nodes or add the fact's informations/labels to the nodes
    return Trees.get(treeId)
        .then(tree => {
            return onGetTree(tree, level)
        })
        .catch( err => console.error('trees get err is', err))
}

function onGetTree(tree, level) {
    var contentPromise = ContentItems.get(tree.contentId)
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
    connectTreeToParent(tree, content, g)
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
        color: getTreeColor(content),
        type: 'tree',
    };
    return node;
}
/**
 * Get tree colors for descending proficiency levels. Default to "existing node" color
 * @param tree
 * @returns {*}
 */
function getTreeColor(content) {
    let proficiency = user && content.userProficiencyMap && content.userProficiencyMap[user.getId()]
    return proficiency >= 0 ? proficiencyToColor(proficiency) : Globals.colors.proficiency_unknown
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
            return content.question;
        case "heading":
            return content.title;
        case "skill":
            return content.title;
    }
}
function createEdgeId(nodeOneId, nodeTwoId){
    return nodeOneId + "__" + nodeTwoId
}
function connectTreeToParent(tree,content, g){
    if (tree.parentId) {
        const edge = {
            id: createEdgeId(tree.parentId, tree.id),
            source: tree.parentId,
            target: tree.id,
            size: 5,
            color: getTreeColor(content)
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

    initialized = true;
    initSigmaPlugins()
    PubSub.subscribe('canvas.dragStart', (eventName, data) => {
        var canvas = document.querySelector('#graph-container')
        canvas.style.cursor = 'grabbing'
    })
    PubSub.subscribe('canvas.dragStop', (eventName, data) => {
        var canvas = document.querySelector('#graph-container')
        canvas.style.cursor = 'grab'
    })
    PubSub.subscribe('canvas.startDraggingNode', (eventName, node) => {
        // console.log('CANVAS.startDraggingNode subscribe called',eventName, node, node.id, node.x, node.y)
    })
    PubSub.subscribe('canvas.stopDraggingNode', (eventName, node) => {
        // console.log("canvas.stopDraggingNode subscribe called",eventName, node, node.id, node.x, node.y)
        updateTreePosition({newX: node.x, newY: node.y, treeId: node.id})
    })
    PubSub.subscribe('canvas.nodeMouseUp', function(eventName,data) {
        var node = data;
        (utils.isMobile.any()) ? mobileOverNode(node) : openTooltip(node);
    });
    PubSub.subscribe('canvas.differentNodeClicked', function(eventName, data){
        PubSub.publish('canvas.closeTooltip', data)
        mobileOutNode();
    })
    PubSub.subscribe('canvas.stageClicked', function(eventName, data){
        PubSub.publish('canvas.closeTooltip', data);
        mobileOutNode();
    })
    PubSub.subscribe('canvas.overNode', function(eventName, data){
        var canvas = document.querySelector('#graph-container')
        canvas.style.cursor = 'pointer'
    })
    PubSub.subscribe('canvas.outNode', function(eventName, data){
        var canvas = document.querySelector('#graph-container');
        canvas.style.cursor = '-webkit-grab'
    })
}
function printNodeInfo(e){
    console.log(e, e.data.node)
}

function mobileOutNode() {
    let ele = document.getElementById('mobileAnswerTray');
    ele.style.display = 'none';
}

function mobileOverNode(node) {
    //TODO append dom instead of modifying visibility of node
    let ele = document.getElementById('mobileAnswerTray');
    ele.setAttribute('treeid', node.id);
    ele.style.display = 'flex';
    //PubSub.publish('nodeSelect', node.id);
}

function hoverOverNode(e) {
    var node = e.data.node
    console.log('hover over node for node with id', node.id, 'just called')
    console.log('node about to open is', node)
    // Trees.get(node.id).then(tree => Facts.get(tree.factId).then(fact => fact.continueTimer()))
}
function openTooltip(node){
    console.log("tooltip time");
    tooltips.open(node, toolTipsConfig.node[0], node["renderer1:x"], node["renderer1:y"]);
    setTimeout(function(){
        var vm = new Vue(
            {
                el: '#vue'
            }
        )
    },0)//push this bootstrap function to the end of the callstack so that it is called after mustace does the tooltip rendering

}
function hoverOverNode(e){
    // PubSub.publish('canvas.closeTooltip') // close any existing tooltips, so as to stop their timers from counting
    // var node = e.data.node
}
export function syncGraphWithNode(treeId){
    Trees.get(treeId).then(tree => {
        ContentItems.get(tree.contentId).then(content => {
            //update the node
            var sigmaNode = s.graph.nodes(treeId)
            // console.log('sigmaNode X/Y initial =', sigmaNode, sigmaNode.x, sigmaNode.y)
            sigmaNode.x = tree.x
            sigmaNode.y = tree.y
            var color = getTreeColor(content)
            sigmaNode.color = color

            //update the edge
            var edgeId = createEdgeId(tree.parentId, treeId)
            var sigmaEdge = s.graph.edges(edgeId)
            sigmaEdge.color = color

            // console.log('sigmaNode X/Y after =', sigmaNode, sigmaNode.x, sigmaNode.y)
            s.refresh()
        })
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
    const MINIMUM_DISTANCE_TO_UPDATE_COORDINATES = .1
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
        color: getTreeColor(content),
        type: 'tree',
    }
    //2b. update x and y location in the db for the tree

    s.graph.addNode(newTree);
    //3. add edge between new node and parent tree
    const newEdge = {
        id: createEdgeId(parentTreeId, newTree.id),
        source: parentTreeId,
        target: newTree.id,
        size: 5,
        color: getTreeColor(content)
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