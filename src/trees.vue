<template>
    <div>
        <div>
            <h2>Trees List</h2>
            <ul>
                <!--<tree v-for='tree in trees' :id='tree.id' :key='tree.id' :question='fact.question' :answer='fact.answer'></tree>-->
            </ul>
        </div>
        <div id="graph-container2">
            <div id="disc2"></div>
            <div id="ground2"></div>
        </div>
    </div>
</template>
<script>
import "../other_imports/sigma/sigma.core.js"
import "../other_imports/sigma/conrad.js"
import "../other_imports/sigma/utils/sigma.utils.js"
import "../other_imports/sigma/utils/sigma.polyfills.js"
import "../other_imports/sigma/sigma.settings.js"
import "../other_imports/sigma/classes/sigma.classes.dispatcher.js"
import "../other_imports/sigma/classes/sigma.classes.configurable.js"
import "../other_imports/sigma/classes/sigma.classes.graph.js"
import "../other_imports/sigma/classes/sigma.classes.camera.js"
import "../other_imports/sigma/classes/sigma.classes.quad.js"
import "../other_imports/sigma/classes/sigma.classes.edgequad.js"
import "../other_imports/sigma/captors/sigma.captors.mouse.js"
import "../other_imports/sigma/captors/sigma.captors.touch.js"
import "../other_imports/sigma/renderers/sigma.renderers.canvas.js"
import "../other_imports/sigma/renderers/sigma.renderers.def.js"
import "../other_imports/sigma/renderers/canvas/sigma.canvas.labels.def.js"
import "../other_imports/sigma/renderers/canvas/sigma.canvas.nodes.def.js"
import "../other_imports/sigma/renderers/canvas/sigma.canvas.edges.def.js"
import "../other_imports/sigma/renderers/canvas/sigma.canvas.edgehovers.def.js"
import "../other_imports/sigma/renderers/canvas/sigma.canvas.extremities.def.js"
import "../other_imports/sigma/renderers/svg/sigma.svg.utils.js"
import "../other_imports/sigma/renderers/svg/sigma.svg.nodes.def.js"
import "../other_imports/sigma/renderers/svg/sigma.svg.edges.def.js"
import "../other_imports/sigma/renderers/svg/sigma.svg.labels.def.js"
import "../other_imports/sigma/renderers/svg/sigma.svg.hovers.def.js"
import "../other_imports/sigma/middlewares/sigma.middlewares.rescale.js"
import "../other_imports/sigma/middlewares/sigma.middlewares.copy.js"
import "../other_imports/sigma/misc/sigma.misc.animation.js"
import "../other_imports/sigma/misc/sigma.misc.bindEvents.js"
import "../other_imports/sigma/misc/sigma.misc.bindDOMEvents.js"
import "../other_imports/sigma/misc/sigma.misc.drawHovers.js"
import trees from "./trees.js"

(function() {
    'use strict';

    var s,
        c,
        dom,
        disc,
        ground,
        nId = 0,
        eId = 0,
        radius = 50,

        mouseX,
        mouseY,
        spaceMode = false,
        wheelRatio = 1.1,

        nodeRadius = 10,
        inertia = 0.8,
        springForce = 0.01,
        springLength = 50,
        maxDisplacement = 15,
        gravity = 1.5;
    /**
     * INITIALIZATION SCRIPT:
     * **********************
     */
    s = new sigma({
        renderer: {
            container: document.getElementById('graph-container2'),
            type: 'canvas'
        },
        settings: {
            autoRescale: false,
            mouseEnabled: false,
            touchEnabled: false,
            nodesPowRatio: 1,
            edgesPowRatio: 1,
            defaultEdgeColor: '#333',
            defaultNodeColor: '#333',
            edgeColor: 'default'
        }
    });
    dom = document.querySelector('#graph-container2 canvas:last-child');
    disc = document.getElementById('disc2');
    ground = document.getElementById('ground2');
    c = s.camera;

    // Initialize graph:
    s.graph.read({
        nodes: [
            {
                id: (++nId) + '',
                size: nodeRadius,
                x: 0,
                y: -80,
                dX: 0,
                dY: 0,
                type: 'def'
            },
            {
                id: (++nId) + '',
                size: nodeRadius,
                x: 10,
                y: -100,
                dX: 0,
                dY: 0,
                type: 'def'
            },
            {
                id: (++nId) + '',
                size: nodeRadius,
                x: 20,
                y: -80,
                dX: 0,
                dY: 0,
                type: 'def'
            }
        ],
        edges: [
            {
                id: (++eId) + '',
                source: '1',
                target: '2',
                type: 'def'
            },
            {
                id: (++eId) + '',
                source: '1',
                target: '3',
                type: 'def'
            },
            {
                id: (++eId) + '',
                source: '2',
                target: '3',
                type: 'def'
            }
        ]
    });

    function frame() {
        //s.graph.computePhysics();
        s.refresh();

        if (s.graph.nodes().length) {
            var w = dom.offsetWidth,
                h = dom.offsetHeight;

            // The "rescale" middleware modifies the position of the nodes, but we
            // need here the camera to deal with this. Here is the code:
            var xMin = Infinity,
                xMax = -Infinity,
                yMin = Infinity,
                yMax = -Infinity,
                margin = 50,
                scale;

            s.graph.nodes().forEach(function(n) {
                xMin = Math.min(n.x, xMin);
                xMax = Math.max(n.x, xMax);
                yMin = Math.min(n.y, yMin);
                yMax = Math.max(n.y, yMax);
            });

            xMax += margin;
            xMin -= margin;
            yMax += margin;
            yMin -= margin;

            scale = Math.min(
                w / Math.max(xMax - xMin, 1),
                h / Math.max(yMax - yMin, 1)
            );

            c.goTo({
                x: (xMin + xMax) / 2,
                y: (yMin + yMax) / 2,
                ratio: 1 / scale
            });

            ground.style.top =
                Math.max(h / 2 - Math.min((yMin + yMax) / 2 * scale, h), 0) + 'px';
            disc.style.borderRadius = radius * scale;
            disc.style.width = 2 * radius * scale;
            disc.style.height = 2 * radius * scale;
            disc.style.top = mouseY - radius * scale;
            disc.style.left = mouseX - radius * scale;
            disc.style.backgroundColor = spaceMode ? '#f99' : '#9cf';

        }

        requestAnimationFrame(frame);
    }

    frame();

    function addNode(x, y){
        console.log('ADD NODE', x, y)
        s.graph.addNode({
            id: ((++nId) + ''),
            size: nodeRadius,
            label: 'new node' + nId,
            x: x + Math.random() / 10,
            y: y + Math.random() / 10,
            type: 'def'
        })
    }

    dom.addEventListener('click', function(e) {
        // Find neighbors:
        var x,
            y,
            p,
            id,
            neighbors;

        x = sigma.utils.getX(e) - dom.offsetWidth / 2;
        y = sigma.utils.getY(e) - dom.offsetHeight / 2;

        p = c.cameraPosition(x, y);
        x = p.x;
        y = p.y;
        addNode(x, y);
//      g.edges.push({id: 'e' + 10, source: '3', target: '4', color: '#00f'})
        s.graph.addEdge({id: 'e' + 10, source: '3', target: '4', color: '#00f'})

    }, false);
    addNode(100,100)
    addNode(200,100)
})();
export default {
    name: 'treesgraph',
    data() {
        return {}
    }
}


</script>
<style>
    /*<style>*/
    #graph-container {
        background: #fff;
        height: 600px;
        max-width: 800px;
        margin: auto;
        position: relative;
        overflow: hidden;
    }

    #disc {
        position: absolute;
        top: 100%;
        bottom: 0;
        left: 0;
        right: 0;
    }

    #ground {
        position: absolute;
        background: #ccc;
        top: 100%;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>