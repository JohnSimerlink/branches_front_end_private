;(function(undefined) {
    'use strict';


    var xOffset = 50
    var graphContainer = document.querySelector('#graph-container')
    var width = graphContainer.clientWidth
    var height = graphContainer.clientHeight
    var labels = {}
    if (typeof sigma === 'undefined')
        throw 'sigma is not declared';

    // Initialize packages:
    sigma.utils.pkg('sigma.canvas.labels');

    /**
     * This label renderer will just display the label on the right of the node.
     *
     * @param  {object}                   node     The node object.
     * @param  {CanvasRenderingContext2D} context  The canvas context.
     * @param  {configurable}             settings The settings function.
     */
    sigma.canvas.labels.prioritizable = function(node, context, settings) {
        console.log("prioritizable label called")
        var fontSize,
            prefix = settings('prefix') || '',
            size = node[prefix + 'size'];

        if (size < settings('labelThreshold'))
            return;

        if (!node.label || typeof node.label !== 'string')
            return;

        fontSize = 100;//(settings('labelSize') === 'fixed') ?
            // settings('defaultLabelSize') :
            // settings('labelSizeRatio') * size;

        context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
            fontSize + 'px ' + settings('font');
        context.fillStyle = (settings('labelColor') === 'node') ?
            (node.color || settings('defaultNodeColor')) :
            settings('defaultLabelColor');

        context.fillText(
            node.label,
            Math.round(node[prefix + 'x'] + size + 3),
            Math.round(node[prefix + 'y'] + fontSize / 3)
        );
    };
}).call(this);
