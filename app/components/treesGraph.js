import {Trees} from '../objects/trees.js'
import ContentItem from '../objects/contentItem'
import {Tree} from '../objects/tree.js'
import {Globals} from '../core/globals.js'
import {Config} from '../core/config'
import '../core/login.js'
import PubSub from 'pubsub-js'
import TreeComponent from './tree/treecomponent'
import NewTreeComponent from './newTree/newtreecomponent'
import Vue from 'vue'
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
                        if (Config.framework == 'vue') {
                            template = '<div id="vue"><tree id="' + node.id + '"></tree></div>'
                        }
                        break;
                    case 'newChildTree':
                        template = '<div id="vue"><newtree parentid="' + node.parentId + '"></newtree></div>'
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
        color: Globals.existingColor,
        type: 'tree'
    }
    return node;
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

        s.bind('click', onCanvasClick)
        s.bind('outNode', updateTreePosition); // after dragging a node, a user's mouse will eventually leave the node, and we need to update the node's position on the graph
        s.bind('overNode', hoverOverNode)
        initialized = true;
    }
    initSigmaPlugins()
}
function onCanvasClick(e){
    console.log('canvas click!')
    PubSub.publish('canvas.clicked', true)
    console.log(e, e.data.node)
}
function printNodeInfo(e){
   console.log(e, e.data.node)
}
function hoverOverNode(e){
    var node = e.data.node
    console.log('hover over node for node with id', node.id, 'just called')
    // Trees.get(node.id).then(tree => Facts.get(tree.factId).then(fact => fact.continueTimer()))
    tooltips.open(node, toolTipsConfig.node[0], node["renderer1:x"], node["renderer1:y"]);
    setTimeout(function(){
        var treeNodeDom = document.querySelector('.tree')
        if (Config.framework == 'angular1'){
            angular.bootstrap(treeNodeDom, ['branches'])
        } else {
            Vue.component('tree', TreeComponent)
            Vue.component('newtree', NewTreeComponent)
            // {
            //     template: require('./tree/tree.html'), // '<div> {{movie}} this is the tree template</div>',
            //     props: ['movie']
            //     // render: h => h(TreeVue)
            // })
            var vm = new Vue(
                {
                    el: '#vue'
                }
            )
        }
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
    var listener = s.configNoverlap(noOverlapConfig);
    s.startNoverlap();

    window.tooltips = tooltips
}
