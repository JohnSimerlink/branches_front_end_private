import {Trees} from '../../objects/trees.js'
import ContentItems from '../../objects/contentItems'
import {getLabelFromContent} from "../../objects/contentItem";
import {Tree} from '../../objects/tree.js'
import '../../core/login.js'
import {user} from '../../objects/user'
import Snack from '../../../node_modules/snack.js/dist/snack'
import Vue from 'vue'
import {proficiencyToColor} from "../proficiencyEnum";
import store from '../../core/store'
import {Globals} from '../../core/globals'
import './knawledgeMap.less'
import LocalForage from 'localforage'
import {isMobile} from '../../core/utils';
import clonedeep from 'lodash.clonedeep'
import UriContentMap from '../../objects/uriContentMap'
import {stripTrailingSlash} from '../../objects/uriContentMap'

let router;

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
                    // case 'newChildTree':
                    //     template = '<div id="vue"><newtree parentid="' + node.parentId + '"></newtree></div>';
                    //     break;
                }
                var result = template // Mustache.render(template, node)

                return result
            }
        }],
    // stage: {
    //     template:require('./rightClickMenu.html')
    // }
};

export default {
    props: ['treeId','contentUri', 'path1','path2', 'path3', 'path4', 'path5' ],
    template: require('./knawledgeMap.html'),
    async created () {
        this.init()
        router = this.$router
        // if ()
    },
    computed: {
        hoverOverItemId(){ // can't be done in watch because sometimes state.hoverOverItemId changes to itself, which watch wont pick up
            const hoverOverItemId = this.$store.state.hoverOverItemId
            return hoverOverItemId
        },
        itemHovered(){
            return this.$store.state.itemHovered
        },
        openNodeId(){
            return this.$store.state.openNodeId
        },
        nodeIdToSync(){
            return this.$store.state.nodeIdToSync
        },
        browserIsMobile() {
            return this.$store.state.mobile;
        },
    },
    watch: {
        '$route': 'init',
        //     console.log('new content id to jump to is ', newContentItem, oldContentItem)
        //     const treeId = newContentItem.getTreeId()
        //     jumpToTreeId(treeId)
        // },
        async hoverOverItemId(newContentItemId, oldContentItemId){
            const newContentItem = await ContentItems.get(newContentItemId)
            // const newContentItemId = this.$store.state.hoverOverItemId
            const treeId = await newContentItem.getTreeId()
            // const tree = await Trees.get(treeId)
            // tree.setActive()
        },
        async itemHovered(){
            const newContentItemId = this.$store.state.hoverOverItemId
            // console.log('hoverOverItemId called', this.$store.state.hoverOverItemId, newContentItemId)
            const newContentItem = await ContentItems.get(newContentItemId)
            console.log('newCOntentItem in hoverOverItemId is', newContentItem)
            if (!newContentItem){ return }
            // console.log('new content to jump to is ', newContentItemId, newContentItem, oldContentItemId)
            const treeId = newContentItem.getTreeId()
            jumpToTreeId(treeId)
            const tree = await Trees.get(treeId)
            tree.setActive()

        },
        openNodeId(newNodeId, oldNodeId){
            console.log('knawledgeMap openNodeId knawledgeMap.js! newNodeId, oldNodeId', newNodeId, oldNodeId)
            if (!newNodeId && oldNodeId){
                closeTooltip(oldNodeId)
                return
            }
            if (window.awaitingDisconnectConfirmation || window.awaitingEdgeConnection){
                return
            }
            openTooltipFromId(newNodeId)
        },
        nodeIdToSync(newNodeId, oldNodeId){
            newNodeId && syncGraphWithNode(newNodeId)
        }
    },
    methods: {
        init(){
            console.log('3.9. knawledgeMap.js init called', calculateLoadTimeSoFar(Date.now()))
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
    if(!content) return
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
            domParent: document.querySelector('body')
        });
        // show a snack for 4s
        snack.show("Add Tree Error:" + err, 4000)
    }
    return content.id
}


function getSizeFromContent(content) {
    // return Globals.regularSize
    return /*content.overdue ? Globals.overdueSize : */ Globals.regularSize
}

function createEdgeId(nodeOneId, nodeTwoId){
    return nodeOneId + "__" + nodeTwoId
}
//
// PubSub.subscribe('syncGraphWithNode', (eventName, treeId) => {
//     syncGraphWithNode(treeId)
// })

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
    const tree = await Trees.get(treeId)
    const content = await ContentItems.get(tree.contentId)

    //update the node
    var sigmaNode = s.graph.nodes(treeId)
    if (sigmaNode){
        sigmaNode.x = tree.x
        sigmaNode.y = tree.y
        sigmaNode.active = tree.active
        var color = getTreeColor(content)
        sigmaNode.color = color
        sigmaNode.proficiencyStats = tree.proficiencyStats
        sigmaNode.overdue = content.overdue
        sigmaNode.size = getSizeFromContent(content)

        sigmaNode.label = getLabelFromContent(content)
    }

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

function jumpToTreeId(treeId){

    if (!s){
        PubSub.subscribe('sigma.initialized', (eventName, data) => {
            _jumpToTreeId(treeId)
        })
    } else {
        _jumpToTreeId(treeId)
    }

}
function _jumpToTreeId(treeId){
    console.log("jumping to tree id", treeId)
    let node = s.graph.nodes(treeId)
    focusNode(s.cameras[0], node);
}
/**
 * Go to a given tree ID on the graph, centering the viewport on the tree
 */
function jumpToAndOpenTreeId(treeId) {
    if (!s){
        PubSub.subscribe('sigma.initialized', (eventName, data) => {
            _jumpToAndOpenTreeId(treeId)
        })
    } else {
        _jumpToAndOpenTreeId(treeId)
    }
}

function _jumpToAndOpenTreeId(treeId){
    jumpToTreeId(treeId)
    let node = s.graph.nodes(treeId)
    openTooltip(node)
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
        ratio: 0.20
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

function openTooltipFromId(nodeId){
    const node = s.graph.nodes(nodeId)
    openTooltip(node)
}
window.openTooltipFromId = openTooltipFromId
function openTooltip(node){

    //Make copy of singleton's config by value to avoid mutation
    let configClone = clonedeep(toolTipsConfig);

    if (!!isMobile.any()) {
        configClone.node[0].cssClass = configClone.node[0].cssClass + ' mobileAnswerTray';
    }

    tooltips.open(node, configClone.node[0], node["renderer1:x"], node["renderer1:y"]);
    setTimeout(function(){
        var vm = new Vue(
            {
                el: '#vue',
                store,
            }
        )
    },0)//push this bootstrap function to the end of the callstack so that it is called after mustace does the tooltip rendering

}
window.openTooltip = openTooltip
function closeTooltip(nodeId){
    const node = s.graph.nodes(nodeId)
    tooltips.close(node);
}
window.closeTooltip = closeTooltip

function getCenterPoint(x,y){
    return s.camera.graphPosition(window.xCenter, window.yCenter) || null
}

async function setURLFromTreeId(treeId){
    const tree = await Trees.get(treeId)
    const contentItem = await tree.getContentItem()
    const uri = contentItem.getURIForWindow()
    console.log(uri, tree.x, tree.y)
    const coordinates = {x: tree.x, y: tree.y, ratio: s.camera.ratio, angle: s.camera.angle}
    store.commit('updateURIAndJump', {uri, coordinates, timestamp: Date.now()})
    // jumpTo
    // window.location.pathname = uri
}

window.setURLFromTreeId = setURLFromTreeId
window.addEventListener('popstate', function(event) {
    console.log('WINDOW POPSTATE CALLED')
}, false);


function initKnawledgeMap(treeIdToJumpTo){
    console.log("2: knawledgeMap.js initKnawledgeMap" + Date.now(), calculateLoadTimeSoFar(Date.now()))
    var me = this;// bound/called

    if (typeof sigma !== 'undefined') {
        sigma.settings.font = 'Fredoka One'
    }

    // if (window.cachedUserId){
    //     loadDataAndInit()
    // } else {
        if (typeof PubSub !== 'undefined') {
            // PubSub.subscribe('userId', async () => {
            PubSub.subscribe('dataLoaded', async () => {
                console.log("3: knawledgeMap.js PubSub.subscribe('userId'')" + Date.now(), " ", calculateLoadTimeSoFar(Date.now()))
                LocalForage.getItem('g').then(async gFromLocalForage => {
                    // console.log("result of LocalForage is ", gFromLocalForage, JSON.stringify(gFromLocalForage), g, JSON.stringify(g))
                    if (window.fullCache && gFromLocalForage){
                        g = gFromLocalForage
                    }
                    else {
                        LocalForage.setItem('g', g)
                        console.log("LOAD DATA AND INIT ABOUT TO BE CALLED")
                        loadDataAndInit()
                    }
                })
            })
        // }
    }

    async function loadDataAndInit(){

        let contentId
        let uri = window.location.pathname
        uri = stripTrailingSlash(uri)
        if (uri){
            contentId = await UriContentMap.get(uri)
        }
        console.log('KNAWLEDGE map', window.location.pathname, contentId,)
        if (contentId){
            // store.commit('enterExploringMode')
            store.commit('hoverOverItemId', contentId)
            const contentItemId = contentId
            const contentItem = await ContentItems.get(contentItemId)
            const treeId = contentItem.getTreeId()
            const tree = await Trees.get(treeId)
            const parentTreeId = tree.parentId
            store.commit('setCurrentStudyingTree', parentTreeId)
            // store.commit('enterStudyingMode')
        } else {
            const currentStudyingCategoryTreeId = user.getCurrentStudyingCategoryTreeId() // this.$store.getters.currentStudyingCategoryTreeId
            console.log("currentStudyingCategoryTreeId is", currentStudyingCategoryTreeId)
            store.commit('setCurrentStudyingTree', currentStudyingCategoryTreeId)
            // store.commit('enterStudyingMode')
        }

        console.log("4.0: knawledgeMap.js loadTreeAndSubTrees about to be loaded" + Date.now(), calculateLoadTimeSoFar(Date.now()))
        await loadTreeAndSubTrees(1, 1)
        console.log("4.1: knawledgeMap.js loadTreeAndSubTrees just loaded" + Date.now(), calculateLoadTimeSoFar(Date.now()))

        try {
            initSigma()
            window.endTime = Date.now()
            console.log("5: knawledgeMap.js initSigma finished" + window.endTime, calculateLoadTimeSoFar(window.endTime))
        } catch (err) {
            console.error('initSigma Error', err)
            alert ('The app isn\'t working!! Let me (John) know ASAP via text/call at 513-787-0992')
        }

    }
    async function loadTreeAndSubTrees(treeId, level){
        // console.log(level, "A", treeId, Date.now())
        //todo: load nodes concurrently, without waiting to connect the nodes or add the fact's informations/labels to the nodes
        const tree = await Trees.get(treeId)
        // console.log(level, "B", treeId, Date.now())
        const getTreeResult = onGetTree(tree, level)
        // console.log(level, "C", treeId, Date.now())
        return getTreeResult
    }

    async function onGetTree(tree, level) {
        // var contentPromise = ContentItems.get(tree.contentId)
        try {
            const content = await ContentItems.get(tree.contentId)
            // console.log(level, tree.id, "onGetTree 1 ", Date.now())

            addTreeNodeToGraph(tree, content, level)
            // console.log(level, tree.id, "onGetTree 2 ", Date.now())
        } catch( err) {
            console.error("CONTENTITEMS.get Err is", err)
        }
        // .then( function onContentGet(content) {return addTreeNodeToGraph(tree,content, level)})
        // console.log(level, tree.id, "onGetTree 3 ", Date.now())
        var childTreesPromises = tree.children ? Object.keys(tree.children).map(child => {
            return loadTreeAndSubTrees(child, level + 1)
        }): []

        // console.log(level, tree.id, "onGetTree 4 ", Date.now())

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
            PubSub.subscribe('mostCenteredNodeId', (eventName, treeId) => {
                console.log("mostCenteredNodeId is", treeId)
                setURLFromTreeId(treeId)
            })
        } catch (err){
            console.error('error in init KnawledgeMap is ', err)
            const nodes = {}
            var nodesArr = g.nodes.map(node => {
               nodes[node.id] = true
               return node.id
            } )
            window.nodesArr = nodesArr
            const sources = {}
            var sourcesArr = g.edges.map(edge => {
                sources[edge.source] = true
                return edge.source
            })
            const targets = {}
            var targetsArr = g.edges.map(edge => {
                targets[edge.target] = true
                return edge.target
            })
            var invalidSources = sourcesArr.filter( s => !nodes[s])
            var invalidTargets = targetsArr.filter( t => !nodes[t])
            console.error("the following targets are invalid", invalidTargets)
            console.error("the following sources are invalid", invalidSources)
            console.log("invalid targets instanceof Array", invalidTargets instanceof Array, invalidTargets.map)
            const invalidTargetPromises = invalidTargets.map(target =>{
                return Trees.get(target)
            })
            (async () => {
                console.log('async iife called')
                const targetTrees = await Promise.all(invalidTargetPromises)
                targetTrees.forEach(tree => {
                    console.log('invalid target tree is ', tree, tree.id, tree.parentId)
                })
            })()
        }

        window.s = s;
        window.g = g
        var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
        s.refresh();

        initialized = true;
        initSigmaPlugins();

        store.commit('mobile', !!isMobile.any());
        window.addEventListener('resize', function(){
            store.commit('mobile', !!isMobile.any());
        }, true);
        s.bind('coordinatesUpdated', function(){
        });
        s.bind('clickNode', function(event) {
            const nodeId = event && event.data && event.data.node && event.data.node.id
            console.log("node clicked s.bind",nodeId)
            store.commit('clickNode', nodeId)
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
            canvas.style.cursor = '-webkit-grab'
        })
        PubSub.subscribe('canvas.startDraggingNode', (eventName, node) => {
        })
        PubSub.subscribe('canvas.stopDraggingNode', (eventName, node) => {
            updateTreePosition({newX: node.x, newY: node.y, treeId: node.id})
        })
        PubSub.subscribe('canvas.nodeMouseUp', function(eventName,data) {
            // var node = data
            // console.log('nodeMouseUp',eventName, data)
            // // console.log('nodeMouseUp', eventName, data)
            // if (window.awaitingDisconnectConfirmation || window.awaitingEdgeConnection){
            //     return
            // }
            // switch(node.content.type){
            //     case 'fact':
            //         console.log("node mouse up on fact")
            //         openTooltip(node)
            //         break;
            //     case 'heading':
            //         openTooltip(node)
            //         break;
            //     case 'skill':
            //         console.log('node mouse up on skill!!!',node)
            //         openTooltip(node)
            //         break;
            //     default:
            //         // console.log()
            //         // me.$router.push({name: 'study', params: {leafId: node.id}})
            //         // console.log('knawledgeMap.js: leaf Id that we are going to study is --- ', node.id)
            //         break;
            // }
        })
        PubSub.subscribe('canvas.differentNodeClicked', function(eventName, data){
            // console.log("canvas.differentNodeClicked subscribe", eventName, data)
            // PubSub.publish('canvas.closeTooltip', data)
            // const nodeToOpen = s.graph.nodes(data.newNode)
            // openTooltip(nodeToOpen)
        })
        PubSub.subscribe('canvas.cameraChange', function(eventName, data){
            console.log('camera change',eventName, data)
        })
        PubSub.subscribe('canvas.stageClicked', function(eventName, data){
            store.commit('clickStage')
            PubSub.publish('canvas.closeTooltip')
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
            canvas.style.cursor = '-webkit-grab'
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
        // PubSub.subscribe('canvas.closeTooltip', (eventName, data) => {
        //     if (!data) return
        //     const treeId = data.oldNode || data
        //     window.closeTooltip(treeId)
        // })
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
    function hoverOverNode(e){
        // PubSub.publish('canvas.closeTooltip') // close any existing tooltips, so as to stop their timers from counting
        // var node = e.data.node
    }

    async function updateTreePosition(data){
        console.log("update tree Position called");
        let {newX, newY, treeId} = data;

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
        var myRenderer = s.renderers[0];

    }



}
