import sigma from '../../sigma.core'
import {ProficiencyUtils} from '../../../../app/objects/proficiency/ProficiencyUtils'
import {PROFICIENCIES} from "../../../../app/objects/proficiency/proficiencyEnum";

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
function proficiencyToColor(proficiency){
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
sigma.canvas.nodes.def = function(node, context, settings) {
  // console.log("canvas nodes def called", node, context, settings)
  if (node.type === NODE_TYPES.SHADOW_NODE){
      return
  }

  var prefix = settings('prefix') || '';

  var size = node[prefix + 'size'];
  context.fillStyle = node.color || settings('defaultNodeColor');
  var x = node[prefix + 'x']
  var y = node[prefix + 'y']
  context.font="Fredoka One"
  if (node.colorSlices) {
      for (let colorSlice of node.colorSlices) {
          // console.log("render for loop", colorSlice)
          context.fillStyle = colorSlice.color
          context.beginPath()
          context.arc(
              x,
              y,
              size,
              colorSlice.start,
              colorSlice.end,
              true
          )
          context.closePath()
          context.fill()
      }
  } else {
      context.fillStyle = ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN)
      context.beginPath()
      context.arc(
          x,
          y,
          size,
          0,
          2 * Math.PI,
          true
      )
      context.closePath()
      context.fill()
  }

  if (node.overdue){
      var fontSize = Math.floor(size * 1.414)
      context.font = fontSize + 'px FredokaOne'
      // context.fillText('\uf017', x + size, y + size) // << TODO : Seems to only work on localhost . .. not on production
      context.fillText('⏱', x + size, y + size) //■►☼!⌚&#9200;&#8987', x + size, y + size)
  }
  var lineWidth = context.lineWidth
  if (node.highlighted){
      // context.fillStyle = setOpacityOfRgbString(hexToRgbString(context.fillStyle), .6)
      var haloSize = size + 2

      context.strokeStyle = 'blue'
      context.lineWidth = 20
      var center = context.beginPath()
      context.fillStyle = 'blue'
      context.arc(x, y, haloSize, 0, Math.PI * 2, true);
      context.stroke()
  }
  context.lineWidth = lineWidth

};

function percentageToRadians(percentage){
    return percentage * 2 * Math.PI
}

function drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color){
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
}

