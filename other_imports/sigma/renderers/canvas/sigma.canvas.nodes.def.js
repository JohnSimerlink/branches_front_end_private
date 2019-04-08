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

    // drawNode(context, node, size, x, y)
    drawNodeRectangleFilled(context, node, size, x, y)
    markNodeOverdueIfNecessary(context, node, size, x, y)
    var lineWidth = context.lineWidth
    highlightNodeIfNecessary(context, node, size, x, y)
    context.lineWidth = lineWidth
};
export function getDimensions(context, node, settings) {
    var prefix = settings('prefix') || '';
    const obj = {
        size: node[prefix + 'size'],
        x: node[prefix + 'x'],
        y: node[prefix + 'y'],
    }
    return obj

}
export function getColorFromNode(node) {
    let color
  if(node && node.contentUserData && node.contentUserData.proficiency) {
      color = ProficiencyUtils.getColor(node.contentUserData.proficiency)
  } else {
      color = ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN)
  }
  return color
}

export function drawNodeRectangleCore(context, node, size, x, y) {
    const halfWidth = calculateCardWidth(node, size) / 2;
    const height = calculateCardHeight(node, size)
    const halfHeight = height / 2
    context.beginPath();
    context.rect(
        x - halfWidth,
        y - halfHeight,
        halfWidth * 2,
        height
    );

}

function drawNodeRectangleFilled(context, node, size, x, y) {
    const color = getColorFromNode(node)
    context.fillStyle = color;
    drawNodeRectangleCore(context, node, size, x, y)
    // from https://github.com/jacomyal/sigma.js/wiki/Renderers
    context.closePath();
    context.fill();

}
function placeTextOnRectangle(context, node, x, y) {
    const text = "Hello this is a note"
}
export function calculateCardHeight(node, size) {
    return size * 5;
}
export function calculateCardWidth(node, size) {
    return size * 10;
}

export function getRectangleCorners(centerX, centerY, size) {
  const halfWidth = calculateCardWidth(null, size) / 2
  const halfHeight = calculateCardHeight(null, size) / 2
  const obj = {
    x1: centerX - halfWidth,
    y1: centerY - halfHeight,
    x2: centerX + halfWidth,
    y2: centerY + halfHeight,
    height: halfHeight * 2
  }
  console.log("getRectangleCorners", obj)
  return obj;

}


function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, true);
    ctx.closePath();
    ctx.fill();
}
function drawNode(context, node, size, x, y) {
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
