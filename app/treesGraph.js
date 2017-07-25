import {Trees} from './trees.js'
import {newTree} from './newTree.js';
import {Tree} from './tree.js'
import {Facts} from './facts.js'
import {Globals} from './globals.js'
import {Redux} from './redux.js'
import {toggleVisibility} from "./utils"
import './login.js'
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

var toolTipsConfig = {
    node: [
        {
            show: 'hovers',
            hide: 'hovers',
            cssClass: 'sigma-tooltip',
            position: 'top',
            //autoadjust: true,
            template:
            '<div class="arrow"></div>' +
            ' <div class="sigma-tooltip-header">{{label}}</div>' +
            '  <div class="sigma-tooltip-body">' +
            '    <table>' +
            '      <tr><th>Name</th> <td>{{data.name}}</td></tr>' +
            '      <tr><th>Gender</th> <td>{{data.gender}}</td></tr>' +
            '      <tr><th>Age</th> <td>{{data.age}}</td></tr>' +
            '      <tr><th>City</th> <td>{{data.city}}</td></tr>' +
            '    </table>' +
            '  </div>' +
            '  <div class="sigma-tooltip-footer">Number of connections: {{degree}}</div>',
            renderer: function(node, template) {
                console.log("HOVER RENDER")
                // The function context is s.graph
                node.degree = this.degree(node.id);

                // Returns an HTML string:
                return Mustache.render(template, node);

                // Returns a DOM Element:
                //var el = document.createElement('div');
                //return el.innerHTML = Mustache.render(template, node);
            }
        },

        {
            show: 'rightClickNode',
            cssClass: 'sigma-tooltip',
            position: 'right',
            template:
                `
              <div class="arrow"></div>
              <div class="tree-fact" class="sigma-tooltip-header">
                <div class="tree-current-fact" style="display:block;">
                    <div class="tree-current-fact-question">{{fact.question}}</div>
                    <div class="tree-current-fact-answer">{{fact.answer}}</div>
                </div>
                <div class="tree-new-fact" style="display:none;" >
                  <input class="tree-id" value="{{id}}" type="hidden">
                  <input class="tree-new-fact-question" value="{{fact.question}}">
                  <input class="tree-new-fact-answer" value="{{fact.answer}}">
                  <button class="fact-new-save" onclick="treeCtrl.editFactOnTreeFromEvent(event)">Save</button>
                </div>
                <button class="sigma-tooltip-edit-button" onclick="treeCtrl.toggleEdit(event)" >Edit</button>
              </div>
              <div class="sigma-tooltip-body"> 
                <p>How well did you know this topic? </p>
                <p>
                  <button>Not at All (Review in < 2 min)</button>
                  <button>Somewhat (10 min)</button>
                  <button>Easy (1 day)</button>
                  <button>Perfectly (4 days)</button>
                 <!-- This intervals change/increase base on number of times user has reviewed. e.g. if use has known it perfectly the last 3 times, the next time they click perfectly, the review interval will be like 4 months . Exact algorithm TBD, but probably similar to Anki -->
                </p> 
              </div> 
              <div class="sigma-tooltip-footer">
                <div class="deleteTreeForm" class="deleteTreeForm">
                  <input type="hidden" class="treeId" value="{{id}}"> 
                  <button class="deleteTree" onclick="treeCtrl.deleteTree(event)">DELETE TREE</button> 
                </div>   
              </div>
            `,
            renderer: function(node, template) {
                console.log('right click render')
                var newChildTreeTemplate =
                    `
                <div class="arrow"></div> 
                  <div class="sigma-tooltip-header">Add a new Fact </div> 
                    <div class="sigma-tooltip-body"> 
                      <p class="newTreeForm">
                        <input type="hidden" class="parentId" value="${node.parentId}">
                        Question: <input class='newTreeQuestion' type='text'><br>
                        Answer: <input class='newTreeAnswer' type='text'><br>
                        <button class='createNewTree' onclick="treeCtrl.createNewTreeClick(event)">Create New Tree</button>
                      </p>
                    </div> 
                  </div> 
               <div class="sigma-tooltip-footer">
                  <p> Number of connections: {{degree}}</p>
               </div>
               `

                if (node.type == 'newChildTree'){
                    template = newChildTreeTemplate
                }
                node.degree = this.degree(node.id);
                var result = Mustache.render(template, node)

                return result
            }
        }],
    stage: {
        template:
        '<div class="arrow"></div>' +
        '<div class="sigma-tooltip-header"> Menu </div>'
    }
};

const treeCtrl = {
    createNewTreeClick : function(event){
        var newTreeForm = event.target.parentNode
        var question = newTreeForm.querySelector('.newTreeQuestion').value
        var answer = newTreeForm.querySelector('.newTreeAnswer').value
        var parentId = newTreeForm.querySelector('.parentId').value

        newTree(question, answer, parentId)
    },
    editFactOnTreeFromEvent : function (event) {
        const treeNewFactDom = event.target.parentNode
        var question = treeNewFactDom.querySelector('.tree-new-fact-question').value
        var answer = treeNewFactDom.querySelector('.tree-new-fact-answer').value
        var treeId = treeNewFactDom.querySelector('.tree-id').value
        //1. create new fact
        var fact=
        Facts.create(
            {
                question: question,
                answer: answer,
            }
        )
        //2.link new fact with current tree
        fact.addTree(treeId)
        Trees.get(treeId).then( tree => tree.changeFact(fact.id))

        //3.update UI source for question and fact
        var sigmaNode = s.graph.nodes().find(node => node.id == treeId)
        console.log('sigma node is currently', sigmaNode)
        sigmaNode.fact.question = fact.question
        sigmaNode.fact.answer = fact.answer
        sigmaNode.fact = fact
        s.refresh()
        console.log('sigma node is now', sigmaNode)

        //4. close the edit functionality
        const treeFactDom = treeNewFactDom.parentNode
        window.treeCtrl.toggleEditGivenTreeFactDom(treeFactDom)

        //5. ^^3 and 4 don't seem to be working. Workaround below:

        alert('Fact updated. Refresh the page to see changes')
    },
    toggleEditGivenTreeFactDom: function(treeFactDom){
        let treeCurrentFactDom = treeFactDom.querySelector('.tree-current-fact')
        let treeNewFactDom = treeFactDom.querySelector('.tree-new-fact')
        toggleVisibility(treeCurrentFactDom)
        toggleVisibility(treeNewFactDom)
    },
    toggleEdit: function(event){
        const factEditDom = event.target.parentNode
        window.treeCtrl.toggleEditGivenTreeFactDom(factEditDom)
    },
    deleteTree : function (event) {
        var deleteTreeForm = event.target.parentNode
        var treeId = deleteTreeForm.querySelector('.treeId').value
        //1.Remove Tree and subtrees from graph
        removeTreeFromGraph(treeId).then(() => s.refresh())
        //2. remove the tree's current parent from being its parent
        Trees.get(treeId).then(tree => {
            tree.unlinkFromParent()
        })
    }
}
window.treeCtrl = treeCtrl

function removeTreeFromGraph(treeId){
    s.graph.dropNode(treeId)
    s.graph.dropNode(treeId + newChildTreeSuffix)
    return Trees.get(treeId).then(tree => {
        var childPromises = tree.children? Object.keys(tree.children).map(removeTreeFromGraph) : []
        return Promise.all(childPromises).then((val) => {
            return `removed all children of ${treeId}`
        })
    })
}

var numTreesLoaded = 0;
loadTreeAndSubTrees(1).then( val => {initSigma();}/*.then(initSigma)*/)
// Instantiate sigma:
function createTreeNodeFromTreeAndFact(tree, fact){
    const node = {
        id: tree.id,
        parentId: tree.parentId,
        x: tree.x,
        y: tree.y,
        children: tree.children,
        fact: fact,
        label: getLabelFromFact(fact),
        size: 1,
        color: Globals.existingColor,
        type: 'tree'
    }
    return node;
}
function getLabelFromFact(fact) {
    return fact.question
}
function connectTreeToParent(tree, g){
    if (tree.parentId) {
        const edge = {
            id: tree.parentId + "__" + tree.id,
            source: tree.parentId,
            target: tree.id,
            size: 1,
            color: Globals.existingColor
        };
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
        .then( function onFactsGet(fact) {return onGetFact(tree,fact)})
        .then( factId => {
            return factId})

    var childTreesPromises = tree.children ? Object.keys(tree.children).map(loadTreeAndSubTrees) : []
    var promises = childTreesPromises
    promises.push(factsPromise)

    return Promise.all(promises).then( function onAllChildTreesReceived(resultsArray) {
        var factIdPrettyString = resultsArray.shift();
        var treeIdsPrettyStrings = resultsArray.join(', ')
        var treePrettyString = "( " + factIdPrettyString + " : [ " + treeIdsPrettyStrings + " ] )"
        return treePrettyString
    }) //promise should only resolve when the tree's fact and all the subtrees are loaded
}
//returns a promise whose resolved value will be a stringified representation of the tree's fact and subtrees
function loadTreeAndSubTrees(treeId){
    //todo: load nodes concurrently, without waiting to connect the nodes or add the fact's informations/labels to the nodes
    numTreesLoaded++;
    return Trees.get(treeId)
        .then(onGetTree)
        .catch( err => console.error('trees get err is', err))
}

function addShadowNodeToTree(tree){
    if (tree.children) {
    }
    const shadowNode = {
        id: tree.id + newChildTreeSuffix, //"_newChildTree",
        parentId: tree.id,
        x: parseInt(tree.x) + newNodeXOffset,
        y: parseInt(tree.y) + newNodeYOffset,
        label: '+',
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
function calculateNewChildNodeCoordinates(treeId){
    return Trees.get(treeId)
        .then( tree => {

        })
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

        s.bind('click', printNodeInfo )
        s.bind('outNode', updateTreePosition);
        s.bind('overNode', hoverOverNode)
        initialized = true;
    }
    initSigmaPlugins()
}
window.initSigma = initSigma;
function printNodeInfo(e){
   console.log(e, e.data.node)
}
function hoverOverNode(e){
    var node = e.data.node
    console.log('tooltips in hoverOverNode is', window.tooltips)

    // Instanciate the tooltips plugin with a Mustache renderer for node tooltips:

    // Manually open a tooltip on a node:
    var prefix = s.renderers[0].camera.prefix;
    console.log('prefix is', prefix)
    tooltips.open(node, toolTipsConfig.node[1], node["renderer1:x"] /*n[prefix + 'x']*/, node["renderer1:y"] /*n[prefix + 'y']*/);
}
function updateTreePosition(e){
    let x = e.data.node.x
    let y = e.data.node.y
    let treeId = e.data.node.id;

    if (!s.graph.nodes().find(node => node.id == treeId && node.type === 'tree')){
        return; //node isn't an actual node in the db - its like a shadow node or helper node
    }
    Trees.get(treeId).then( tree => {
        if (Math.abs(tree.x - x) > 20 ) {
            tree.set('x', x)
        }
        if (Math.abs(tree.y - y) > 20 ) {
            tree.set('y', y)
        }
        return tree
    }).then((tree) => {
    })
}
function logEvent(e){
    const MINIMUM_DISTANCE_TO_UPDATE = 20
    let x = e.data.node.x
    let y = e.data.node.y
    let treeId = e.data.node.id;
    Trees.get(treeId).then( tree => {
        if (Math.abs(tree.x - x) > MINIMUM_DISTANCE_TO_UPDATE ) {
           tree.set('x', x)
        }
        if (Math.abs(tree.y - y) > MINIMUM_DISTANCE_TO_UPDATE ) {
            tree.set('y', y)
        }
    })
}
function dragNode(e){
    console.log('drag Node', e,e.type, e.data.node, e.data.node.label, e.data.captor);
    let parentId = e.data.node.parentId;
    if (e.data.node.type == 'tree'){

    }
    // let parentTreeId = e.data.node.id.substring(0,e.data.node.id.indexOf("_"));
}

//returns sigma tree node
export function addTreeToGraph(parentTreeId, fact) {
    //1. delete current addNewNode button
    var currentNewChildTree = s.graph.nodes(parentTreeId + newChildTreeSuffix);
    var newChildTreeX = parseInt(currentNewChildTree.x);
    var newChildTreeY = parseInt(currentNewChildTree.y);
    var tree = new Tree(fact.id, parentTreeId, newChildTreeX, newChildTreeY)
    //2. add new node to parent tree on UI
    const newTree = {
        id: tree.id,
        parentId: parentTreeId,
        factId: fact.id,
        fact: fact,
        x: newChildTreeX,
        y: newChildTreeY,
        children: {},
        label: getLabelFromFact(fact),
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
    addShadowNodeToTree(newTree)
    //5. Re add shadow node to parent
    Trees.get(parentTreeId)
        .then(addShadowNodeToTree);

    s.refresh();
    return newTree;
}
function initSigmaPlugins() {
    // Instanciate the tooltips plugin with a Mustache renderer for node tooltips:
    var tooltips = sigma.plugins.tooltips(s, s.renderers[0], toolTipsConfig)
    window.tooltips = tooltips
}