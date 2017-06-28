import getFirebase from './firebaseService.js';
const firebase = getFirebase();
import {Trees} from './trees.js'
import {Facts} from './facts.js'
import {Globals} from './globals.js'
var parentTreeId;
/**
 * This example shows how to use the dragNodes plugin.
 */
var i,
    s,
    N = 5,
    E = 3,
    g = {
        nodes: [],
        edges: []
    };
    var numNodes = 0;
// Generate a random graph:
Trees.getAll((trees) => {
        Object.keys(trees).forEach((treeId) => {
            const tree = trees[treeId]
            Facts.get(tree.factId, (fact) => {
                let question = fact.question;
                let answer = fact.answer;
                const node = {
                        id: treeId,
                        x: tree.x,
                        y: tree.y,
                        label: question + "  " + answer,
                        size: 1,
                        color: '#666'
                    }
                g.nodes.push(node);

                const shadowNode = {
                    id: treeId + "_newNode",
                    x: tree.x - 100,
                    y: tree.y + 100,
                    label: 'Create a new Fact',
                    size: 1,
                    color: '#F00'
                }
                g.nodes.push(shadowNode)
                g.edges.push({
                    id: node.id + "___" + shadowNode.id,
                    source: node.id,
                    target: shadowNode.id,
                    size: 1,
                    color: '#F00'
                })
                numNodes++;
                console.log("D-TREESGRAPH.JS: NumNodes is now", numNodes)
            })
        })
})

function loadTreeAndSubTrees(treeId){
    Trees.get(treeId, function(tree){
        Facts.get(tree.factId, function(fact){
            const node = {
                id: tree.id,
                x: tree.x,
                y: tree.y,
                label: fact.question + "  " + fact.answer
                size: 1,
                color: '#FFF'
            }
            g.nodes.push(node);
            const shadowNode = {
                id: treeId + "_newNode",
                x: tree.x - 100,
                y: tree.y + 100,
                label: 'Create a new Fact',
                size: 1,
                color: '#F00'
            }
            g.nodes.push(shadowNode)
            g.edges.push({
                id: node.id + "___" + shadowNode.id,
                source: node.id,
                target: shadowNode.id,
                size: 1,
                color: '#F00'
            })
        })
    })
}
Trees.get(null, function(treeId){

})
var factsRef = firebase.database().ref('trees');
factsRef.on('value', function(snapshot){
    var ftrees = snapshot.val();
    console.log("firebase trees data is" + JSON.stringify(ftrees));
    Object.keys(ftrees).forEach( (key) => {
        var tree = ftrees[key];

        factListObj.data.push(fact);
        console.log('fact list data is', factListObj.data);
        // addFactToList(fact);
        // console.log('adding fact to list', fact);
    })

}, function (errorObject) {
    console.log('The read failed: ' + errorObject.code);
});
sigma.renderers.def = sigma.renderers.canvas
// Instantiate sigma:
s = new sigma({
    graph: g,
    container: 'graph-container'
});

// Initialize the dragNodes plugin:
var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

dragListener.bind('startdrag', function(event) {
    console.log(event);
});
dragListener.bind('drag', function(event) {
    console.log(event);
});
dragListener.bind('drop', function(event) {
    console.log(event);
});
dragListener.bind('dragend', function(event) {
    console.log(event);
});
// Bind the events:
s.bind('overNode outNode clickNode doubleClickNode rightClickNode', function(e) {
    console.log('event is e', e)

    console.log(e.type, e.data.node.label, e.data.captor);
    parentTreeId = e.data.node.id.substring(0,e.data.node.id.indexOf("_"));
    console.log('parent tree id selected was', parentTreeId)
    Globals.currentTreeSelected = parentTreeId;
});
s.bind('overEdge outEdge clickEdge doubleClickEdge rightClickEdge', function(e) {
    console.log(e.type, e.data.edge, e.data.captor);
});
s.bind('clickStage', function(e) {
    console.log(e.type, e.data.captor);
});
s.bind('doubleClickStage rightClickStage', function(e) {
    console.log(e.type, e.data.captor);
});
