import {Trees} from './trees.js'
import {Facts} from './facts.js'
var i,
    s,
    N = 3,
    E = 2,
    g = {
        nodes: [],
        edges: []
    };

// Instantiate sigma:
s = new sigma({
    graph: g,
    container: 'graph-container'
});
for (i = 0; i < N; i++){
    g.nodes.push({
        id: 'n' + i,
        label: 'Node ' + i,
        x: 100 * i,
        y: 100 * i,
        size: 10,
        color: '#666'
    });
    console.log(g.nodes)
}
s.refresh()
// loadTreeAndSubTrees(1);
// globalS = s
var c = s.camera;
var dom = document.querySelector('#graph-container canvas:last-child');
var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
// loadTreeAndSubTrees(1)

function loadTreeAndSubTrees(treeId){
    console.log('loadTreeAndSubTrees just called')

    // Trees.get(treeId, function(tree){
    //     console.log("TREESGRAPH2.JS: Trees.get callback tree is", tree)
    //     Facts.get(tree.factId, function(fact){
    //         console.log("TREESGRAPH2.JS: Facts.get callback is this. fact is", fact)
    //         const node = {
    //             id: tree.treeId,
    //             x: tree.x,
    //             y: tree.y,
    //             label: fact.question + "  " + fact.answer,
    //             size: 1,
    //             color: '#0FF'
    //         }
    //         console.log("TREESGRAPH2.JS: node is", node)
    //         g.nodes.push(node);
    //         const shadowNode = {
    //             id: treeId + "_newNode",
    //             x: parseInt(tree.x) - 100,
    //             y: parseInt(tree.y) + 100,
    //             label: 'Create a new Fact',
    //             size: 1,
    //             color: '#F0F'
    //         }
    //         s.refresh();
    //         console.log("TREESGRAPH2.js nodess is ", g.nodes)
    //         g.nodes.push(shadowNode)
    //         g.edges.push({
    //             id: node.id + "___" + shadowNode.id,
    //             source: node.id,
    //             target: shadowNode.id,
    //             size: 1,
    //             color: '#F0F'
    //         })
    //         console.log("TREESGRAPH2.js nodess is ", g.nodes)
    //         s.refresh();
    //
    //     })
    // })
    //
}

