import sigma from '../../sigma.core'
import {EDGE_TYPES} from '../../../../app/core/globals'

sigma.utils.pkg('sigma.canvas.edgehovers');
sigma.canvas.edgehovers = sigma.canvas.edgehovers || {}

/**
 * This hover renderer will display the edge with a different color or size.
 *
 * @param  {object}                   edge         The edge branchesMap.
 * @param  {object}                   source node  The edge source node.
 * @param  {object}                   target node  The edge target node.
 * @param  {CanvasRenderingContext2D} context      The canvas context.
 * @param  {configurable}             settings     The settings function.
 */
sigma.canvas.edgehovers.def =
    function (edge, source, target, context, settings) {
        // if (window.awaitingEdgeConnection && edge.type !== EDGE_TYPES.SUGGESTED_CONNECTION){
        //   return
        // } else {
        // }
        var color = edge.color,
            prefix = settings('prefix') || '',
            size = edge[prefix + 'size'] || 1,
            edgeColor = settings('edgeColor'),
            defaultNodeColor = settings('defaultNodeColor'),
            defaultEdgeColor = settings('defaultEdgeColor');

        if (!color)
            switch (edgeColor) {
                case 'source':
                    color = source.color || defaultNodeColor;
                    break;
                case 'target':
                    color = target.color || defaultNodeColor;
                    break;
                default:
                    color = defaultEdgeColor;
                    break;
            }

        if (settings('edgeHoverColor') === 'edge') {
            color = edge.hover_color || color;
        } else {
            color = edge.hover_color || settings('defaultEdgeHoverColor') || color;
        }
        size *= settings('edgeHoverSizeRatio');

        var colorSave = context.strokeStyle
        var lineWidth = context.lineWidth
        context.strokeStyle = color;
        context.lineWidth = size * 3;
        context.beginPath();
        context.moveTo(
            source[prefix + 'x'],
            source[prefix + 'y']
        );
        context.lineTo(
            target[prefix + 'x'],
            target[prefix + 'y']
        );
        context.stroke();
        context.lineWidth = lineWidth
        context.color = colorSave
    };
