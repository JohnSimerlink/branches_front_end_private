// import "../other_imports/sigma/sigma.core.js"
//     import "../other_imports/sigma/conrad.js"
//     import "../other_imports/sigma/utils/sigma.utils.js"
//     import "../other_imports/sigma/utils/sigma.polyfills.js"
//     import "../other_imports/sigma/sigma.settings.js"
//     import "../other_imports/sigma/classes/sigma.classes.dispatcher.js"
//     import "../other_imports/sigma/classes/sigma.classes.configurable.js"
//     import "../other_imports/sigma/classes/sigma.classes.graph.js"
//     import "../other_imports/sigma/classes/sigma.classes.camera.js"
//     import "../other_imports/sigma/classes/sigma.classes.quad.js"
//     import "../other_imports/sigma/classes/sigma.classes.edgequad.js"
//     import "../other_imports/sigma/captors/sigma.captors.mouse.js"
//     import "../other_imports/sigma/captors/sigma.captors.touch.js"
//     import "../other_imports/sigma/renderers/sigma.renderers.canvas.js"
//     import "../other_imports/sigma/renderers/sigma.renderers.def.js"
//     import "../other_imports/sigma/renderers/canvas/sigma.canvas.labels.def.js"
//     import "../other_imports/sigma/renderers/canvas/sigma.canvas.hovers.def.js"
//     import "../other_imports/sigma/renderers/canvas/sigma.canvas.nodes.def.js"
//     import "../other_imports/sigma/renderers/canvas/sigma.canvas.edges.def.js"
//     import "../other_imports/sigma/renderers/canvas/sigma.canvas.edgehovers.def.js"
//     import "../other_imports/sigma/renderers/canvas/sigma.canvas.extremities.def.js"
//     import "../other_imports/sigma/renderers/svg/sigma.svg.utils.js"
//     import "../other_imports/sigma/renderers/svg/sigma.svg.nodes.def.js"
//     import "../other_imports/sigma/renderers/svg/sigma.svg.edges.def.js"
//     import "../other_imports/sigma/renderers/svg/sigma.svg.labels.def.js"
//     import "../other_imports/sigma/renderers/svg/sigma.svg.hovers.def.js"
//     import "../other_imports/sigma/middlewares/sigma.middlewares.rescale.js"
//     import "../other_imports/sigma/middlewares/sigma.middlewares.copy.js"
//     import "../other_imports/sigma/misc/sigma.misc.animation.js"
//     import "../other_imports/sigma/misc/sigma.misc.bindEvents.js"
//     import "../other_imports/sigma/misc/sigma.misc.bindDOMEvents.js"
//     import "../other_imports/sigma/misc/sigma.misc.drawHovers.js"
    import getFirebase from './firebaseService.js';
    const firebase = getFirebase();
    import {Trees} from './trees.js'
    import {Facts} from './facts.js'
// // function initializeNodes
// (function() {
//     'use strict';
//
//     var s,
//         c,
//         dom,
//         disc,
//         ground,
//         nId = 0,
//         eId = 0,
//         radius = 50,
//
//         mouseX,
//         mouseY,
//         spaceMode = false,
//         wheelRatio = 1.1,
//
//         nodeRadius = 10,
//         inertia = 0.8,
//         springForce = 0.01,
//         springLength = 50,
//         maxDisplacement = 15,
//         gravity = 1.5;
//     /**
//      * INITIALIZATION SCRIPT:
//      * **********************
//      */
//     s = new sigma({
//         renderer: {
//             container: document.getElementById('graph-container'),
//             type: 'canvas'
//         },
//         settings: {
//             autoRescale: false,
//             mouseEnabled: false,
//             touchEnabled: false,
//             nodesPowRatio: 1,
//             edgesPowRatio: 1,
//             defaultEdgeColor: '#333',
//             defaultNodeColor: '#333',
//             edgeColor: 'default'
//         }
//     });
//     dom = document.querySelector('#graph-container canvas:last-child');
//     disc = document.getElementById('disc');
//     ground = document.getElementById('ground');
//     c = s.camera;
//     const graphNodes = [];
//     let numNodes = 0;
//     console.log("TREESGRAPH.JS: Trees.getAll about to be called")
//     Trees.getAll((trees) =>{
//         console.log('TREESGRAPH.JS: trees received in treesGRAPH.js is', JSON.stringify(trees))
//         Object.keys(trees).forEach( (treeId) => {
//             const tree = trees[treeId]
//             Facts.get(tree.factId, (fact) => {
//                 console.log('inside of facts.get callback, fact is', fact)
//
//                 let question = fact.question;
//                 let answer = fact.answer;
//                 console.log('question is ', question)
//                 console.log('answer is ', answer)
//                 addNode({id: treeId, x: numNodes * 95, y:numNodes * -40, question: question, answer: answer})
//                 numNodes++;
//                 console.log("TREESGRAPH.JS: NumNodes is now", numNodes)
//             })
//         })
//     })
//
//     // Initialize graph:
//     function frame() {
//         //s.graph.computePhysics();
//         s.refresh();
//
//         if (s.graph.nodes().length) {
//             var w = dom.offsetWidth,
//                 h = dom.offsetHeight;
//
//             // The "rescale" middleware modifies the position of the nodes, but we
//             // need here the camera to deal with this. Here is the code:
//             var xMin = Infinity,
//                 xMax = -Infinity,
//                 yMin = Infinity,
//                 yMax = -Infinity,
//                 margin = 50,
//                 scale;
//
//             s.graph.nodes().forEach(function(n) {
//                 xMin = Math.min(n.x, xMin);
//                 xMax = Math.max(n.x, xMax);
//                 yMin = Math.min(n.y, yMin);
//                 yMax = Math.max(n.y, yMax);
//             });
//
//             xMax += margin;
//             xMin -= margin;
//             yMax += margin;
//             yMin -= margin;
//
//             scale = Math.min(
//                 w / Math.max(xMax - xMin, 1),
//                 h / Math.max(yMax - yMin, 1)
//             );
//
//             c.goTo({
//                 x: (xMin + xMax) / 2,
//                 y: (yMin + yMax) / 2,
//                 ratio: 1 / scale
//             });
//
//             ground.style.top =
//                 Math.max(h / 2 - Math.min((yMin + yMax) / 2 * scale, h), 0) + 'px';
//             disc.style.borderRadius = radius * scale;
//             disc.style.width = 2 * radius * scale;
//             disc.style.height = 2 * radius * scale;
//             disc.style.top = mouseY - radius * scale;
//             disc.style.left = mouseX - radius * scale;
//             disc.style.backgroundColor = spaceMode ? '#f99' : '#9cf';
//
//         }
//
//         requestAnimationFrame(frame);
//     }
//
//         frame();
//
//
//
//         function addNode(options){
//             console.log('ADD NODE', options, options.x, options.y)
//             let label = options.question && options.question.substring(0,5);
//             console.log('label is ',label)
//
//         s.graph.addNode({
//             id: ((options.id) + ''),
//             size: nodeRadius,
//             label: label,//'hi',// +  options.question && options.question.substring(0,5), //options.question + options.answer,
//             x: options.x,
//             y: options.y,
//             type: 'def'
//         })
//
//             function determineChildShadowNodeLocation(parentLocation, graph){
//                return {
//                    x: parentLocation.x + 200,
//                    y: parentLocation.y + 200
//                }
//             }
//     }
// //
// //     dom.addEventListener('click', function(e) {
// //         // Find neighbors:
// //         var x,
// //             y,
// //             p,
// //             id,
// //             neighbors;
// //
// //         x = sigma.utils.getX(e) - dom.offsetWidth / 2;
// //         y = sigma.utils.getY(e) - dom.offsetHeight / 2;
// //
// //         p = c.cameraPosition(x, y);
// //         x = p.x;
// //         y = p.y;
// //         addNode({id: Math.random() + '', x:x, y:y});
// // //      g.edges.push({id: 'e' + 10, source: '3', target: '4', color: '#00f'})
// // //         s.graph.addEdge({id: 'e' + 10, source: '3', target: '4', color: '#00f'})
// //
// //     }, false);
// //     // addNode({id: 2, x:100, y:100});
//     // addNode({id: 3, x:200, y:100});
// })();

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

// Generate a random graph:
for (i = 0; i < N; i++)
    g.nodes.push({
        id: 'n' + i,
        label: 'Node ' + i,
        x: i * 100,
        y: i * 100,
        size: 1,
        color: '#666'
    });

for (i = 0; i < E; i++)
    g.edges.push({
        id: 'e' + i,
        source: 'n' + (Math.random() * N | 0),
        target: 'n' + (Math.random() * N | 0),
        size: 1,
        color: '#ccc'
    });
// sigma.renderers.def = sigma.renderers.canvas
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
