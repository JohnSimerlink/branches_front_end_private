import {Trees} from '../objects/trees.js'
import ContentItem from '../objects/contentItem'
import {Tree} from '../objects/tree.js'
import {Globals} from '../core/globals.js'
import '../core/login.js'
import PubSub from 'pubsub-js'
import Vue from 'vue'
import user from '../objects/user'
var initialized = false;

sigma.settings.font = 'Fredoka One'
// declare new node shapes
sigma.canvas.labels.rectangle = function(node, context, settings) {
    // declarations
    var prefix = settings('prefix') || '';
    var size = node[prefix + 'size'];
    var nodeX = node[prefix + 'x'];
    var nodeY = node[prefix + 'y'];
    var textWidth;
    // define settings
    context.fillStyle = node.textColor;
    context.lineWidth = size * 0.5;
    context.font = '400 ' + size + 'px AvenirNext';
    context.textAlign = 'center';
    context.fillText(node.label, nodeX, nodeY + size * 0.375);
    // measure text width
    textWidth = context.measureText(node.label).width
    node.labelWidth = textWidth; // important for clicks
};
sigma.canvas.nodes.rectangle = function(node, context, settings) {
    // declarations
    var prefix = settings('prefix') || '';
    var size = node[prefix + 'size'];
    var nodeX = node[prefix + 'x'];
    var nodeY = node[prefix + 'y'];
    var textWidth;
    // define settings
    context.fillStyle = node.fillColor;
    context.strokeStyle = node.color || settings('defaultNodeColor');
    context.lineWidth = size * 0.1;
    context.font = '400 ' + size + 'px AvenirNext';
    // measure text width
    textWidth = context.measureText(node.label).width;
    // draw path
    context.beginPath();
    context.rect(
        nodeX - (textWidth * 1.2) * 0.5,
        nodeY - size * 1.2 * 0.5,
        textWidth * 1.2,
        size * 1.2
    );
    context.closePath();
    context.fill();
    context.stroke();
};

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
    ],
    glyphs = [
        {
            position: positions[0],
            content: icons[Math.floor(Math.random() * icons.length)],
            fillColor: '#35ac19',
            hidden: false
        }
    ]


window.g = g
window.s = s;

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
                switch(node.tooltipType){
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
function createTreeNodeFromTreeAndContent(tree, content){
    const node = {
        id: tree.id,
        parentId: tree.parentId,
        x: tree.x,
        y: tree.y,
        children: tree.children,
        content: content,
        label: getLabelFromContent(content),
        size: 2,
        color: getTreeColor(tree),
        tooltipType: 'tree',
        // glyphs
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
    switch (content.tooltipType){
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
            size: 2,
            color: Globals.colors.proficiency_unknown
        };
        g.edges.push(edge);
    }
}
//returns a promise whose resolved value will be a stringified representation of the tree's fact and subtrees
function initSigma(){
    if (initialized) return

    sigma.renderers.def = sigma.renderers.canvas
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
    s.bind('outNode', updateTreePosition); // after dragging a node, a user's mouse will eventually leave the node, and we need to update the node's position on the graph
    s.bind('overNode', hoverOverNode)
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
    console.log('hoverOverNode event called', ...arguments)
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
function updateTreePosition(e){
    let newX = e.data.node.x
    let newY = e.data.node.y
    let treeId = e.data.node.id;

    if (!s.graph.nodes().find(node => node.id == treeId && node.tooltipType === 'tree')){
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
    var parentTree = s.graph.nodes(parentTreeId);
    var newChildTreeX = parseInt(parentTree.x) + newNodeXOffset;
    var newChildTreeY = parseInt(parentTree.y) + newNodeYOffset;
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
        size: 2,
        color: Globals.existingColor,
        tooltipType: 'tree',
        // glyphs,
    }
    //2b. update x and y location in the db for the tree

    s.graph.addNode(newTree);
    //3. add edge between new node and parent tree
    const newEdge = {
        id: parentTreeId + "__" + newTree.id,
        source: parentTreeId,
        target: newTree.id,
        size: 2,
        color: Globals.existingColor
    }
    s.graph.addEdge(newEdge)

    s.refresh();
    return newTree;
}
function initSigmaPlugins() {
    // Instanciate the tooltips plugin with a Mustache renderer for node tooltips:
    var tooltips = sigma.plugins.tooltips(s, s.renderers[0], toolTipsConfig);
    // var dragListener = sigma.plugins.dragNodes(s, s.renderers[0],activeState);
    window.tooltips = tooltips;
    window.jump = jumpToAndOpenTreeId;


    var myRenderer = s.renderers[0];

    myRenderer.glyphs();

    myRenderer.bind('render', function(e) {
        myRenderer.glyphs();
    });
    console.log('my renderenr is', myRenderer, s.renderers)
}


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