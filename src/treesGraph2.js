import getFirebase from './firebaseService.js';
const firebase = getFirebase();
import {Trees} from './trees.js'
import {Facts} from './facts.js'
import {Config} from './config.js'
import {Globals} from './globals.js'
var parentTreeId;
var i,
    s,
    N = 5,
    E = 3,
    g = {
        nodes: [],
        edges: []
    };
    var numNodes = 0;
sigma.renderers.def = sigma.renderers.canvas
// Instantiate sigma:
s = new sigma({
    graph: g,
    container: 'graph-container'
});
// Generate a random graph:
if (Config.offlineMode){
    Trees.getAll((trees) => {
        Object.keys(trees).forEach((treeId) => {
            const tree = trees[treeId]
            Facts.get(tree.factId, (fact) => {
                console.log("TREESGRAPH2.JS facts.get callback: fact", fact)
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
} else {
    loadTreeAndSubTrees(1);
}

function loadTreeAndSubTrees(treeId){
    console.log('loadTreeAndSubTrees just called')
    Trees.get(treeId, function(tree){
        console.log("TREESGRAPH2.JS: Trees.get callback tree is", tree)
        Facts.get(tree.factId, function(fact){
            console.log("TREESGRAPH2.JS: Facts.get callback is this. fact is", fact)
            const node = {
                id: tree.treeId,
                x: tree.x,
                y: tree.y,
                label: fact.question + "  " + fact.answer,
                size: 1,
                color: '#0FF'
            }
            console.log("TREESGRAPH2.JS: node is", node)
            g.nodes.push(node);
            const shadowNode = {
                id: treeId + "_newNode",
                x: parseInt(tree.x) - 100,
                y: parseInt(tree.y) + 100,
                label: 'Create a new Fact',
                size: 1,
                color: '#F0F'
            }
            s.refresh();
            console.log("TREESGRAPH2.js nodess is ", g.nodes)
            g.nodes.push(shadowNode)
            g.edges.push({
                id: node.id + "___" + shadowNode.id,
                source: node.id,
                target: shadowNode.id,
                size: 1,
                color: '#F0F'
            })
            console.log("TREESGRAPH2.js nodess is ", g.nodes)
            s.refresh();

        })
    })
}
if (Config.offlineMode){
    var factsRef = firebase.database().ref('trees');
    factsRef.on('value', function(snapshot){
        var ftrees = snapshot.val();
        console.log("firebase trees data is" + JSON.stringify(ftrees));
        Object.keys(ftrees).forEach( (key) => {
            var tree = ftrees[key];
            var treeListObj = {data:[]};
            treeListObj.data.push(tree);
            // console.log('fact list data is', factListObj.data);
            // addFactToList(fact);
            // console.log('adding fact to list', fact);
        })

    }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code);
    });
}

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
s.bind('clickNode', function(e) {
    console.log('event is e', e)
    console.log(e.type, e.data.node.label, e.data.captor);
    parentTreeId = e.data.node.id.substring(0,e.data.node.id.indexOf("_"));
    console.log('parent tree id selected was', parentTreeId)
    document.querySelector("#parentTreeId").value = parentTreeId
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
