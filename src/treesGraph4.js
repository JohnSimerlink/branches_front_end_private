import {Trees} from './trees.js'
import {Facts} from './facts.js'
import {Globals} from './globals.js'
var i,
    s,
    N = 3,
    E = 2,
    g = {
        nodes: [],
        edges: []
    };

// Generate a random graph:

var numTreesLoaded = 0;
loadTreeAndSubTrees(1)
// Instantiate sigma:
function loadTreeAndSubTrees(treeId){
    console.log('loadTreeAndSubTrees just called')
    numTreesLoaded++;
    console.log('1num trees loaded is ', numTreesLoaded)
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
            if (tree.parentId) {
                g.edges.push({
                    id: tree.parentId + "___" + tree.id,
                    source: tree.parentId,
                    target: tree.id,
                    size: 1,
                    color: '#FF0'
                })
            }
            if (numTreesLoaded > 2){
                console.log('num treesloaded is ', numTreesLoaded)
                initSigma()
            }
        })
        tree.children && tree.children.forEach((childId) => {
            loadTreeAndSubTrees(childId)
        })
    })

}

var initialized = false;
function initSigma(){
    if (!initialized){
        sigma.renderers.def = sigma.renderers.canvas
        s = new sigma({
            graph: g,
            container: 'graph-container'
        });
        var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
        s.refresh();

        s.bind('clickNode', function(e) {
            console.log('event is e', e)
            console.log(e.type, e.data.node.label, e.data.captor);
            let parentTreeId = e.data.node.id.substring(0,e.data.node.id.indexOf("_"));
            console.log('parent tree id selected was', parentTreeId)
            document.querySelector("#parentTreeId").value = parentTreeId
            Globals.currentTreeSelected = parentTreeId;
            console.log('g nodes is', g.nodes)
        });
        initialized = true;
    }
}
