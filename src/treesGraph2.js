import getFirebase from './firebaseService.js';
const firebase = getFirebase();
import {Trees} from './trees.js'
import {Facts} from './facts.js'
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
    //
    // Trees.getAll((trees) =>{
    //     console.log('TREESGRAPH.JS: trees received in treesGRAPH.js is', JSON.stringify(trees))
    //     Object.keys(trees).forEach( (treeId) => {
    //         const tree = trees[treeId]
    //         Facts.get(tree.factId, (fact) => {
    //             console.log('inside of facts.get callback, fact is', fact)
    //
    //             let question = fact.question;
    //             let answer = fact.answer;
    //             console.log('question is ', question)
    //             console.log('answer is ', answer)
    //             g.nodes.push({id: treeId, x: numNodes * 100, y:numNodes * 100, question: question, answer: answer})
    //             numNodes++;
    //             console.log("TREESGRAPH.JS: NumNodes is now", numNodes)
    //         })
    //     })
    // })

// Generate a random graph:
Trees.getAll((trees) => {
        Object.keys(trees).forEach( (treeId) => {
            const tree = trees[treeId]
            Facts.get(tree.factId, (fact) => {
                console.log('A-inside of facts.get callback, fact is', fact)

                let question = fact.question;
                let answer = fact.answer;
                console.log('B-question is ', question)
                console.log('C-answer is ', answer)
                g.nodes.push(
                    {
                        id: treeId,
                        x: numNodes * 100,
                        y: numNodes * 100,
                        label: question + answer,
                        size: 1,
                        color: '#666'
                    }
                )
                numNodes++;
                console.log("D-TREESGRAPH.JS: NumNodes is now", numNodes)
            })
        })
})
// for (i = 0; i < N; i++)
//     g.nodes.push({
//         id: 'n' + i,
//         label: 'Node ' + i,
//         x: i * 100,
//         y: i * 100,
//         size: 1,
//         color: '#666'
//     });

// for (i = 0; i < E; i++)
//     g.edges.push({
//         id: 'e' + i,
//         source: 'n' + (Math.random() * N | 0),
//         target: 'n' + (Math.random() * N | 0),
//         size: 1,
//         color: '#ccc'
//     });
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
