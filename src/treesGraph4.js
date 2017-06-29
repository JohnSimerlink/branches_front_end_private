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

// Generate a random graph:
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

// Instantiate sigma:
s = new sigma({
    graph: g,
    container: 'graph-container'
});

