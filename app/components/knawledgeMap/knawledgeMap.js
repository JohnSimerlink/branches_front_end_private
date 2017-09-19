import {Trees} from '../../objects/trees.js'
import ContentItems from '../../objects/contentItems'
import {Tree} from '../../objects/tree.js'
import '../../core/login.js'
import user from '../../objects/user'
import Snack from '../../../node_modules/snack.js/dist/snack'
import Vue from 'vue'
import {proficiencyToColor} from "../proficiencyEnum";
import store from '../../core/store'
import {Globals} from '../../core/globals'
import './knawledgeMap.less'

let router
export default {
    props: ['treeId'],
    template: require('./knawledgeMap.html'),
    created () {
        this.init()
        router = this.$router
    },
    watch: {
        '$route': 'init',
    },
    methods: {
        init(){
            initKnawledgeMap.call(this, this.treeId)
        }
    }
}

var s,
    g = {
        nodes: [],
        edges: []
    }

var initialized = false;

const EDGE_TYPES = {
    SUGGESTED_CONNECTION: 9001,
    HIERARCHICAL: 9002,
}

function getTreeColor(content) {
    let proficiency = user && content.userProficiencyMap && content.userProficiencyMap[user.getId()]
    const color = proficiencyToColor(proficiency)
    return color
}
export async function removeTreeFromGraph(treeId){
    s.graph.dropNode(treeId)
    const tree = await Trees.get(treeId)
    const childPromises = tree.children? Object.keys(tree.children).map(removeTreeFromGraph) : []
    return Promise.all(childPromises).then(val => {
        s.refresh()
        return `removed all children of ${treeId}`
    })
}
PubSub.subscribe('removeTreeFromGraph', (eventName, treeId) => {
    removeTreeFromGraph(treeId)
})

function createTreeNodeFromTreeAndContent(tree, content, level){
    // var node = tree
    // node.level = level
    // node.content = content
    // node.label = getLabelFromContent(content)
    // node.size = 1
    // node.color = getTreeColor(content)
    // node.type = 'tree'

    const node = {
        ...tree,
        level,
        content,
        overdue: content.overdue,
        label: getLabelFromContent(content),
        size: getSizeFromContent(content),
        color: getTreeColor(content),
        type: 'tree',
    };
    return node;
}

export function addTreeNodeToGraph(tree,content, level){
    try {
        const treeUINode = createTreeNodeFromTreeAndContent(tree,content, level)
        if(!initialized){
            g.nodes.push(treeUINode);
            connectTreeToParent(tree, content, g)
        } else {
            s.graph.addNode(treeUINode)
            connectTreeToParent(tree, content, g)
            s.refresh()
        }
    } catch (err) {
        var snack = new Snack({
            domParent: document.querySelector('.new-exercise')
        });
        // show a snack for 4s
        snack.show(err, 4000)
    }
    return content.id
}

function getLabelFromContent(content) {
    switch (content.type){
        case "fact":
            return content.question
        case "heading":
            return content.title
        case "skill":
            return content.title
    }
}

function getSizeFromContent(content) {
    // return Globals.regularSize
    return content.overdue ? Globals.overdueSize : Globals.regularSize
}

function createEdgeId(nodeOneId, nodeTwoId){
    return nodeOneId + "__" + nodeTwoId
}

PubSub.subscribe('syncGraphWithNode', (eventName, treeId) => {
    syncGraphWithNode(treeId)
})

export function syncGraphWithNode(treeId){
    if (!s){
        PubSub.subscribe('sigma.initialized', (eventName, data) => {
            _syncGraphWithNode(treeId)
        })
    } else {
        _syncGraphWithNode(treeId)
    }
}
async function _syncGraphWithNode(treeId){
    // console.log('sync graph with node called', treeId)
    const tree = await Trees.get(treeId)
    const content = await ContentItems.get(tree.contentId)

    //update the node
    var sigmaNode = s.graph.nodes(treeId)
    sigmaNode.x = tree.x
    sigmaNode.y = tree.y
    var color = getTreeColor(content)
    sigmaNode.color = color
    sigmaNode.proficiencyStats = tree.proficiencyStats
    sigmaNode.size = getSizeFromContent(content)

    //update the edge
    var edgeId = createEdgeId(tree.parentId, treeId)
    var sigmaEdge = s.graph.edges(edgeId)
    if (sigmaEdge){
        sigmaEdge.color = color
    }

    s.refresh()

}

export function refreshGraph(){
    s.refresh()
}
PubSub.subscribe('refreshGraph',refreshGraph)

function connectTreeToParent(tree,content, g){
    if (tree.parentId) {
        const edge = {
            id: createEdgeId(tree.parentId, tree.id),
            source: tree.parentId,
            target: tree.id,
            size: 2,
            color: getTreeColor(content),
            type: EDGE_TYPES.HIERARCHICAL,
        };
        if(!initialized){
            g.edges.push(edge);
        } else {
            s.graph.addEdge(edge)
        }
    }
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
        size: getSizeFromContent(content),
        color: getTreeColor(content),
        type: 'tree',
    }

    s.graph.addNode(newTree);
    //3. add edge between new node and parent tree
    const newEdge = {
        id: createEdgeId(parentTreeId, newTree.id),
        source: parentTreeId,
        target: newTree.id,
        size: 2,
        color: getTreeColor(content),
        type: EDGE_TYPES.HIERARCHICAL,
    }
    s.graph.addEdge(newEdge)

    s.refresh();
    return newTree;
}

export function goToFromMap(path){
    router.push(path)
}
PubSub.subscribe('goToFromMap', (eventName, path) => {
    goToFromMap(path)
})
export function cameraToGraphPosition(x,y){
    // console.log('cameraToGraphPosition called',x,y)
    const graphPosition = s.camera.graphPosition(x,y)
    // console.log('cameraToGraphPosition called. result is', graphPosition)
    return graphPosition
}
export function graphToCameraPosition(x,y){
    // console.log('cameraToGraphPosition called',x,y)
    const cameraPosition = s.camera.cameraPosition(x,y)
    // console.log('cameraToGraphPosition called. result is', cameraPosition)
    return cameraPosition
}
export function getCamera(){
    return s.camera
}
export function getTreeUINode(nodeId){
    return s.graph.nodes(nodeId)
}
function initKnawledgeMap(treeIdToJumpTo){
    var me = this;// bound/called



    if (typeof sigma !== 'undefined') {
        sigma.settings.font = 'Fredoka One'
    }


    var toolTipsConfig = {
        node: [
            {
                show: 'rightClickNode',
                cssClass: 'sigma-tooltip',
                position: 'center',
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

    if (typeof PubSub !== 'undefined') {
        PubSub.subscribe('login', async () => {
            await loadTreeAndSubTrees(1, 1)
            try {
                initSigma()
            } catch (err) {
                console.error('initSigma Error', err)
                alert ('The app isn\'t working!! Let me (John) know ASAP via text/call at 513-787-0992')
            }
        })
    }
    async function loadTreeAndSubTrees(treeId, level){
        //todo: load nodes concurrently, without waiting to connect the nodes or add the fact's informations/labels to the nodes
        const tree = await Trees.get(treeId)
        return onGetTree(tree, level)
    }

    async function onGetTree(tree, level) {
        // var contentPromise = ContentItems.get(tree.contentId)
        try {
            const content = await ContentItems.get(tree.contentId)
            addTreeNodeToGraph(tree, content, level)
        } catch( err) {
            console.error("CONTENTITEMS.get Err is", err)
        }
        // .then( function onContentGet(content) {return addTreeNodeToGraph(tree,content, level)})
        var childTreesPromises = tree.children ? Object.keys(tree.children).map(child => {
            return loadTreeAndSubTrees(child, level + 1)
        }): []

        return Promise.all([...childTreesPromises])
    }



//recursively load the entire tree
// Instantiate sigma:
    /**
     * Get tree colors for descending proficiency levels. Default to "existing node" color
     * @param tree
     * @returns {*}
     */
//returns a promise whose resolved value will be a stringified representation of the tree's fact and subtrees

    function initSigma(){
        if (initialized) return

        sigma.renderers.def = sigma.renderers.canvas
        sigma.canvas.labels.def = sigma.canvas.labels.prioritizable
        try {
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
        } catch (err){
            console.error('error in init KnawledgeMap is ', err)
            // const nodes = {}
            // var nodesArr = g.nodes.map(node => {
            //    nodes[node.id] = true
            //    return node.id
            // } )
            // const sources = {}
            // var sourcesArr = g.edges.map(edge => {
            //     sources[edge.source] = true
            //     return edge.source
            // })
            // const targets = {}
            // var targetsArr = g.edges.map(edge => {
            //     targets[edge.target] = true
            //     return edge.target
            // })
            // var invalidSources = sourcesArr.filter( s => !nodes[s])
            // var invalidTargets = targetsArr.filter( t => !nodes[t])
            // console.error("the following targets are invalid", invalidTargets)
            // console.error("the following sources are invalid", invalidSources)
            // console.log("invalid targets instanceof Array", invalidTargets instanceof Array, invalidTargets.map)
            // const invalidTargetPromises = invalidTargets.map(target =>{
            //     return Trees.get(target)
            // })
            // (async () => {
            //     console.log('async iife called')
            //     const targetTrees = await Promise.all(invalidTargetPromises)
            //     targetTrees.forEach(tree => {
            //         console.log('invalid target tree is ', tree, tree.id, tree.parentId)
            //     })
            // })()

        }

        window.s = s;
        var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
        s.refresh();

        initialized = true;
        initSigmaPlugins()
        s.bind('coordinatesUpdated', function(){
        })
        PubSub.subscribe('canvas.coordinatesUpdated', function(eventName, coordinates){
            user.setCamera(coordinates)
        })
        PubSub.subscribe('canvas.dragStart', (eventName, data) => {
            var canvas = document.querySelector('#graph-container')
            canvas.style.cursor = 'grabbing'
        })
        PubSub.subscribe('canvas.dragStop', (eventName, data) => {
            // console.log('dragStop', eventName, data)
            var canvas = document.querySelector('#graph-container')
            canvas.style.cursor = 'grab'
        })
        PubSub.subscribe('canvas.startDraggingNode', (eventName, node) => {
        })
        PubSub.subscribe('canvas.stopDraggingNode', (eventName, node) => {
            console.log('stopDraggingNode', eventName, node)
            updateTreePosition({newX: node.x, newY: node.y, treeId: node.id})
        })
        PubSub.subscribe('canvas.nodeMouseUp', function(eventName,data) {
            var node = data
            console.log('nodeMouseUp',eventName, data)
            // console.log('nodeMouseUp', eventName, data)
            if (window.awaitingDisconnectConfirmation || window.awaitingEdgeConnection){
                return
            }
            switch(node.content.type){
                case 'fact':
                    openTooltip(node)
                    break;
                case 'heading':
                    openTooltip(node)
                    break;
                case 'skill':
                    console.log('node mouse up on skill!!!',node)
                    openTooltip(node)
                    break;
                default:
                    // console.log()
                    // me.$router.push({name: 'study', params: {leafId: node.id}})
                    // console.log('knawledgeMap.js: leaf Id that we are going to study is --- ', node.id)
                    break;
            }
        })
        PubSub.subscribe('canvas.differentNodeClicked', function(eventName, data){
            PubSub.publish('canvas.closeTooltip', data)
        })
        PubSub.subscribe('canvas.cameraChange', function(eventName, data){
            console.log('camera change',eventName, data)
        })
        PubSub.subscribe('canvas.stageClicked', function(eventName, data){
            PubSub.publish('canvas.closeTooltip', data)
            if(window.edgeIdBeingChanged){
                s.graph.edges(window.edgeIdBeingChanged).state = 'normal'
            }
            if(window.awaitingDisconnectConfirmationNodeId){
                s.graph.nodes(window.awaitingDisconnectConfirmationNodeId).state = 'normal'
            }
            if(window.awaitingEdgeConnectionNodeId){
                s.graph.nodes(window.awaitingEdgeConnectionNodeId).state = 'normal'
            }
            window.edgeIdBeingChanged = null
            window.awaitingDisconnectConfirmation = false
            window.awaitingEdgeConnection = false
            window.awaitingDisconnectConfirmationNodeId = null
            window.awaitingEdgeConnectionNodeId = null
        })
        PubSub.subscribe('canvas.overNode', function(eventName, data){
            var canvas = document.querySelector('#graph-container')
            canvas.style.cursor = 'pointer'
        })
        PubSub.subscribe('canvas.outNode', function(eventName, data){
            var canvas = document.querySelector('#graph-container')
            if (!canvas || !canvas.style) return // maybe the user just clicked on the node which navigated the user to another route where the canvas is no longer present
            canvas.style.cursor = 'grab'
        })
        PubSub.subscribe('canvas.clickEdge', (eventName, eventData) => {
            const edge = eventData.edge
            if (edge.type == EDGE_TYPES.SUGGESTED_CONNECTION){
                click_SUGGESTED_CONNECTION(edge)
                return
            }
            const target = s.graph.nodes(edge.target)
            if (window.awaitingDisconnectConfirmation && window.awaitingDisconnectConfirmationNodeId !== target.id){
                return
            }
            if (window.awaitingEdgeConnection && window.awaitingEdgeConnectionNodeId !== target.id){
                return
            }
            switch (edge.state) {
                case 'pre-severed':
                    target.state = 'awaitingEdgeConnection'
                    edge.state = 'severed'
                    window.awaitingEdgeConnection = true
                    window.awaitingEdgeConnectionNodeId = target.id
                    window.awaitingDisconnectConfirmationNodeId = null
                    window.awaitingDisconnectConfirmation = false
                    // s.graph.dropEdge(edge.id)

                    const parentlessNode = target
                    showPossibleEdges(parentlessNode)

                    break
                default:
                    window.edgeIdBeingChanged =edge.id
                    edge.state = 'pre-severed'
                    window.awaitingDisconnectConfirmationNodeId = target.id
                    window.awaitingDisconnectConfirmation = true
                    break;
            }
            s.refresh()
        })
        PubSub.publish('sigma.initialized')
    }
    async function click_SUGGESTED_CONNECTION(edge){
        const childBeingAdoptedId = edge.target
        const newParentId = edge.source

        Trees.adoptChild(newParentId,childBeingAdoptedId)
        handleAdoptionProcessUIUpdate(childBeingAdoptedId, newParentId, edge)
    }

    function handleAdoptionProcessUIUpdate(childBeingAdoptedId, newParentId, edge){
        const childBeingAdoptedUINode = s.graph.nodes(childBeingAdoptedId)
        childBeingAdoptedUINode.state = 'normal'

        const permanentEdge = {
            id : createEdgeId(newParentId,childBeingAdoptedId),
            source: newParentId,
            target: childBeingAdoptedId,
            type : EDGE_TYPES.HIERARCHICAL,
            color: edge.color,
            size: edge.size,
        }
        s.graph.addEdge(permanentEdge)
        window.awaitingEdgeConnectionNodeId = null
        window.awaitingEdgeConnection = false
        removeSuggestedEdges()
        const originalEdge = s.graph.edges(window.edgeIdBeingChanged)
        originalEdge && s.graph.dropEdge(originalEdge.id)
        s.refresh()
        window.suggestedConnectionClicked = true
        // PubSub.publish('canvas.parentReconnect.reconnected')

    }

    function removeEdgeToParent(node){
        var parentId = node.parentId
        var edgeId = createEdgeId(parentId, node.id)
        s.graph.dropEdge(edgeId)
    }
    if (typeof window !== 'undefined'){
        window.haloSizeScalingFactor = 1.00
        window.scalingOffset = 20
    }
    setInterval(() => {
        if (typeof window == 'undefined'){
            return
        }
        if (!window.awaitingEdgeConnection && !window.awaitingDisconnectConfirmation){
            return
        }
        switch(window.scalingOffset){
            case -20:
                window.scalingOffset = -10
                break;
            case -10:
                window.scalingOffset = 0
                break;
            case 0:
                window.scalingOffset = 10
                break;
            case 10:
                window.scalingOffset = 20
                break;
            case 20:
                window.scalingOffset = 30
                break;
            case 30:
                window.scalingOffset = 21
                break;
            case 21:
                window.scalingOffset = 11
                break;
            case 11:
                window.scalingOffset = 1
                break;
            case 1:
                window.scalingOffset = -9
                break;
            case -9:
                window.scalingOffset = -20
                break;
        }
        window.haloSizeScalingFactor = 1 + window.scalingOffset / 1000
        window.haloEdgeSizeScalingFactor = 1 + 4 * window.scalingOffset / 1000
        // s && s.refresh() << comment out for performance reasons
    }, 100)

    function showPossibleEdges(parentlessNode){
        var nodesOnScreen = s.graph.nodes().filter(node => node.onScreen) //>>>>> seems to be returning nothing >>// s.camera.quadtree.area(s.camera.getRectangle(s.width, s.height))
        var headingsOnScreen = nodesOnScreen.filter(node => node.content.type == 'heading')// node.content.type == 'heading' && node['renderer1:x'] > 0 && node['renderer1:y'] > 0)

        headingsOnScreen
            .forEach(node => {
                const edge = {
                    id: 'SUGGESTED_CONNECTION_' + node.id + "__" + parentlessNode.id,
                    source: node.id,
                    target: parentlessNode.id,
                    size: 2,
                    color: parentlessNode.color,
                    type: EDGE_TYPES.SUGGESTED_CONNECTION
                }
                s.graph.addEdge(edge)
                s.refresh()

            })
        // var parentLessNode

    }
    function removeSuggestedEdges(){
        const edgeIdsToRemove = s.graph.edges().filter(e => e.type === EDGE_TYPES.SUGGESTED_CONNECTION).map(e => e.id) //map(e => e.id).forEach(s.graph.dropEdge)
        edgeIdsToRemove.forEach(id => {
            s.graph.dropEdge(id)
        })
        // edgeIdsToRemove.forEach(s.graph.dropEdge.bind(s))
    }
    if (typeof window !== 'undefined'){
        window.printNodesOnScreen = function() {
            var nodesOnScreen = s.camera.quadtree.area(s.camera.getRectangle(s.width, s.height))
            console.log('nodes on screen is', nodesOnScreen)
        }
    }

    function printNodeInfo(e){
        console.log(e, e.data.node)
    }
    function openTooltip(node){
        tooltips.open(node, toolTipsConfig.node[0], node["renderer1:x"], node["renderer1:y"]);
        setTimeout(function(){
            var vm = new Vue(
                {
                    el: '#vue',
                    store,
                }
            )
        },0)//push this bootstrap function to the end of the callstack so that it is called after mustace does the tooltip rendering

    }
    function hoverOverNode(e){
        // PubSub.publish('canvas.closeTooltip') // close any existing tooltips, so as to stop their timers from counting
        // var node = e.data.node
    }
    async function updateTreePosition(data){
        console.log("update tree Position called")
        let {newX, newY, treeId} = data
        // let newX = e.data.node.x
        // let newY = e.data.node.y
        // let treeId = e.data.node.id;

        if (!s.graph.nodes().find(node => node.id == treeId && node.type === 'tree')){
            return; //node isn't an actual node in the db - its like a shadow node or helper node
        }
        const MINIMUM_DISTANCE_TO_UPDATE_COORDINATES = .1
        const tree = await Trees.get(treeId)
        let deltaX = newX - tree.x
        if (Math.abs(deltaX) > MINIMUM_DISTANCE_TO_UPDATE_COORDINATES ) {
            tree.addToX({recursion: true, deltaX})
        }
        let deltaY = newY - tree.y
        if (Math.abs(deltaY) > MINIMUM_DISTANCE_TO_UPDATE_COORDINATES ) {
            tree.addToY({recursion: true, deltaY})
        }
        return tree
    }


    function initSigmaPlugins() {
        // Instantiate the tooltips plugin with a Mustache renderer for node tooltips:
        var tooltips = sigma.plugins.tooltips(s, s.renderers[0], toolTipsConfig);
        // var dragListener = sigma.plugins.dragNodes(s, s.renderers[0],activeState);
        window.tooltips = tooltips;
        window.jump = jumpToAndOpenTreeId;
        // jumpToAndOpenTreeId(treeIdToJumpTo || DataKeys.TREE_IDS.EVERYDAY_WORDS)
        s.camera.goTo(user.camera)
        console.log('camera going to', user.camera)
        var myRenderer = s.renderers[0];

    }

    /**
     * Go to a given tree ID on the graph, centering the viewport on the tree
     */
    function jumpToAndOpenTreeId(treeid) {
        //let tree = sigma.nodes[treeid];
        let node = s.graph.nodes(treeid)
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
            ratio: 0.05
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



}
