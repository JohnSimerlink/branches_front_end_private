import sigma from '../../sigma.core'
import {ProficiencyUtils} from '../../../../app/objects/proficiency/ProficiencyUtils'
import {PROFICIENCIES} from "../../../../app/objects/proficiency/proficiencyEnum";

// TODO: change all these sigma files to TS files
const NODE_TYPES = {
    SHADOW_NODE: 9100,
}

var Globals = {
    currentTreeSelected: null,
    colors: {
        proficiency_4: 'lawngreen',
        proficiency_3: 'yellow',
        proficiency_2: 'orange',
        proficiency_1: 'red',
        proficiency_unknown: 'gray',
    },
    overdueSize: 2,
    regularSize: 1,
}

function proficiencyToColor(proficiency) {
    if (proficiency > PROFICIENCIES.THREE) return Globals.colors.proficiency_4;
    if (proficiency > PROFICIENCIES.TWO) return Globals.colors.proficiency_3;
    if (proficiency > PROFICIENCIES.ONE) return Globals.colors.proficiency_2;
    if (proficiency > PROFICIENCIES.UNKNOWN) return Globals.colors.proficiency_1;
    return Globals.colors.proficiency_unknown;
}

sigma.utils.pkg('sigma.canvas.nodes');

/**
 * The default node renderer. It renders the node as a simple disc.
 *
 * @param  {object}                   node     The node object.
 * @param  {CanvasRenderingContext2D} context  The canvas context.
 * @param  {configurable}             settings The settings function.
 */
sigma.canvas.nodes.def = function (node, context, settings) {
    // console.log("canvas nodes def called", node, context, settings)
    if (node.type === NODE_TYPES.SHADOW_NODE) {
        return
    }
    const {size, x, y} = getDimensions(context, node, settings);
    context.fillStyle = node.color || settings('defaultNodeColor');
    context.font = "Nunito"

    // drawNodeCircle(context, node, size, x, y)
    drawNodeRectangleFilled(context, node,size,  x, y)
    markNodeOverdueIfNecessary(context, node, size, x, y)
    var lineWidth = context.lineWidth
    highlightNodeIfNecessary(context, node, size, x, y)
    context.lineWidth = lineWidth
};
function getDimensions(context, node, settings) {
    var prefix = settings('prefix') || '';
    const obj = {
        size: node[prefix + 'size'],
        x: node[prefix + 'x'],
        y: node[prefix + 'y'],
    }
    return obj

}


function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, true);
    ctx.closePath();
    ctx.fill();
}

function getColorFromNode(node) {
    let color
  if(node && node.contentUserData && node.contentUserData.proficiency) {
      color = ProficiencyUtils.getColor(node.contentUserData.proficiency)
  } else {
      color = ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN)
  }
  return color
}
function getRectangleDimensions(node, x, y) {
    // return
}
function drawNodeRectangleNotFilled(context, node, size, x, y){
    const halfWidth = size * 10
    const height = calculateCardHeight(node, size)
    const halfHeight = height / 2
    const color = getColorFromNode(node)
    context.lineWidth="4";
    context.strokeStyle = color;
    context.beginPath();
    context.rect(
        x - halfWidth,
        y + halfHeight - 45,
        halfWidth * 2,
        height
    );
    context.stroke();
}
function drawNodeRectangleFilled(context, node, size, x, y) {
    const halfWidth = size * 10;
    const height = calculateCardHeight(node, size)
    const halfHeight = height / 2
    const color = getColorFromNode(node)
    context.fillStyle = color;
    context.beginPath();
    context.rect(
        x - halfWidth,
        y - halfHeight,
        halfWidth * 2,
        height
    );
    // from https://github.com/jacomyal/sigma.js/wiki/Renderers
    context.closePath();
    context.fill();

    // if (node.colorSlices) {
    //     for (let colorSlice of node.colorSlices) {
    //         drawPieSlice(context, x, y, size, colorSlice.start, colorSlice.end, colorSlice.color)
    //     }
    // } else {
    //     drawPieSlice(context,
    //         x,
    //         y,
    //         size,
    //         0,
    //         2 * Math.PI,
    //         ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN)
    //     )
    // }
}
function placeTextOnRectangle(context, node, x, y) {
    const text = "Hello this is a note"
}

function calculateCardHeight(node, size){
    return size * 5;
    // return 50;
    //TODO: based off size of text

}

function drawNodeCircle(context, node, size, x, y) {
    if (node.colorSlices) {
        for (let colorSlice of node.colorSlices) {
            drawPieSlice(context, x, y, size, colorSlice.start, colorSlice.end, colorSlice.color)
        }
    } else {
        drawPieSlice(context,
            x,
            y,
            size,
            0,
            2 * Math.PI,
            ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN)
            )
    }
}

function drawCreateNodeIfNecessary(context, node, size, x, y) {

}

function markNodeOverdueIfNecessary(context, node, size, x, y){
    if (node.overdue) {
        var fontSize = Math.floor(size * 1.414)
        context.font = fontSize + 'px Nunito'
        // context.fillText('\uf017', x + size, y + size) // << TODO : Seems to only work on localhost . .. not on production
        context.fillStyle = 'black'
        context.fillText('⏱', x + size, y + size) //■►☼!⌚&#9200;&#8987', x + size, y + size)
    }
}
function highlightNodeIfNecessary(context, node, size, x, y) {
    if (node.highlighted) {
        const circleRadius = size

        context.strokeStyle = 'blue'
        context.lineWidth = circleRadius / 4
        context.fillStyle = 'blue'
        context.arc(x, y, circleRadius, 0, Math.PI * 2, true);
        context.stroke()
    }
}

function percentageToRadians(percentage) {
    return percentage * 2 * Math.PI
}

