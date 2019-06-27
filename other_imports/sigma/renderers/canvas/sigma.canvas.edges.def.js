import sigma from '../../sigma.core'
import {EDGE_TYPES} from "../../../../app/core/globals";

sigma.utils.pkg('sigma.canvas.edges');
sigma.canvas.edges = sigma.canvas.edges || {}

/**
 * The default edge renderer. It renders the edge as a simple line.
 *
 * @param  {object}                   edge         The edge branchesMap.
 * @param  {object}                   source node  The edge source node.
 * @param  {object}                   target node  The edge target node.
 * @param  {CanvasRenderingContext2D} context      The canvas context.
 * @param  {configurable}             settings     The settings function.
 */
function renderSeveredEdge(edge, source, target, context, settings) {
    return;
}

function renderPreSeveredEdge(edge, source, target, context, settings) {

}

sigma.canvas.edges.def = function (edge, source, target, context, settings) {
    if (edge.state == 'severed') {
        return
    }
    if (edge.type == EDGE_TYPES.SUGGESTED_CONNECTION /*&& !window.awaitingEdgeConnection*/) {
        return
    }
    var color = edge.color,
        prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1,
        edgeColor = settings('edgeColor'),
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor');
    // if (window.awaitingEdgeConnection){
    //   if(edge.type == EDGE_TYPES.SUGGESTED_CONNECTION){
    //     color = setOpacityOfRgbString(colorToRgbString(color), .8)
    //   } else {
    //     color = setOpacityOfRgbString(colorToRgbString(color), .1)
    //   }
    // }

    context.strokeStyle = color;
    if (edge.state == 'pre-severed' || edge.type == EDGE_TYPES.SUGGESTED_CONNECTION) {
        size = size * 3 * 1 //window.haloEdgeSizeScalingFactor
    } else {
        size = size * 3
    }

    const sourceX = source[prefix + 'x'];
    const sourceY = source[prefix + 'y'];
    const targetX = target[prefix + 'x'];
    const targetY = target[prefix + 'y'];
    // console.log('source and target are ', source.id, target.id, sourceX, sourceY, targetX, targetY)
    context.lineWidth = size
    context.beginPath();
    context.moveTo(
    	sourceX,
      sourceY
    );
    context.lineTo(
      targetX,
			targetY
    );
    context.stroke();

    if (edge.state == "pre-severed") {

        var x1 = source[prefix + 'x'],
            x2 = target[prefix + 'x'],
            y1 = source[prefix + 'y'],
            y2 = target[prefix + 'y']
        var midX = (x1 + x2) / 2,
            midY = (y1 + y2) / 2

        var X_LEG_SIZE = 20
        context.strokeStyle = 'red'
        context.beginPath();
        context.moveTo(midX - X_LEG_SIZE, midY - X_LEG_SIZE)
        context.lineTo(midX + X_LEG_SIZE, midY + X_LEG_SIZE)
        context.stroke()

        context.beginPath();
        context.moveTo(midX + X_LEG_SIZE, midY - X_LEG_SIZE)
        context.lineTo(midX - X_LEG_SIZE, midY + X_LEG_SIZE)
        context.stroke()
    }
};
