var PROFICIENCIES = {
    UNKNOWN: 0,
    ONE: 12.5,
    TWO: 37.5,
    THREE: 62.5,
    FOUR: 87.5,// DON"T make this 100. bc 100/100 is 1. and log of 1 is 0. and n/0 is undefined, which is what was happening in our math.
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
;(function() {
  'use strict';


  sigma.utils.pkg('sigma.canvas.nodes');

  /**
   * The default node renderer. It renders the node as a simple disc.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.nodes.def = function(node, context, settings) {
      if (node.content.type === 'heading') {
          renderHeading(node, context, settings)
          return
      }

      var prefix = settings('prefix') || '';

      var size = node[prefix + 'size'];
      context.fillStyle = node.color || settings('defaultNodeColor');
      var x = node[prefix + 'x']
      var y = node[prefix + 'y']
      if (window.awaitingEdgeConnection){
        if (node.content.type !== 'heading' && node.state !== 'awaitingEdgeConnection'){
            context.fillStyle = setOpacityOfRgbString(hexToRgbString(context.fillStyle), 0)
            // size = size * 1.5
        }
      }
      context.font="Fredoka One"
      if (node.state == 'awaitingEdgeConnection'){
           // context.fillStyle = setOpacityOfRgbString(hexToRgbString(context.fillStyle), .6)
           var haloSize = size * window.haloSizeScalingFactor

           context.beginPath()
           // context.fillStyle = 'black'
           context.strokeStyle = 'black'
           context.arc(x, y,haloSize,0,Math.PI * 2,true );
           context.stroke()
      }

      context.beginPath();
      context.arc(
        x,
        y,
        size,
        0,
        Math.PI * 2,
        true
      );

      context.closePath();
      context.fill();

      if (node.overdue){
          var fontSize = Math.floor(size * 1.414)
          context.font = fontSize + 'px FontAwesome'
          context.fillText('\uf017', x + size, y + size)
          // context.font = fontSize + 'px Fredoka One'
      }
      var lineWidth = context.lineWidth
      if (node.active){
          // context.fillStyle = setOpacityOfRgbString(hexToRgbString(context.fillStyle), .6)
          var haloSize = size  + 2

          context.strokeStyle = 'blue'
          context.lineWidth = 4
          var center = context.beginPath()
          // context.fillStyle = 'black'
          context.arc(x, y,haloSize,0,Math.PI * 2,true );
          context.stroke()
      }
      context.lineWidth = lineWidth

  };
})();

function renderHeading(node,context,settings){
    var prefix = settings('prefix') || '';
    var x = node[prefix + 'x']
    var y = node[prefix + 'y']
    var size = node[prefix + 'size'];

    var unknownColor = proficiencyToColor(PROFICIENCIES.UNKNOWN)
    var oneColor = proficiencyToColor(PROFICIENCIES.ONE)
    var twoColor = proficiencyToColor(PROFICIENCIES.TWO)
    var threeColor = proficiencyToColor(PROFICIENCIES.THREE)
    var fourColor = proficiencyToColor(PROFICIENCIES.FOUR)

    var proficiencyStats = node.proficiencyStats

    if(window.awaitingEdgeConnection){
        var haloSize = size * window.haloSizeScalingFactor

        var center = context.beginPath()
        // context.fillStyle = 'black'
        context.strokeStyle = 'white'
        context.arc(x, y, haloSize, 0, Math.PI * 2, true);
        context.stroke()
    }

    if (! (proficiencyStats instanceof Object)){

        drawPieSlice(context,x,y,size, 0, 2 * Math.PI, unknownColor)
        return
    }

    var numLeaves = proficiencyStats instanceof Object ? Object.keys(proficiencyStats).reduce((accum, statKey) => {
        return accum + proficiencyStats[statKey]
    },0) : 1

    var unknownPercentage = proficiencyStats.UNKNOWN / numLeaves
    var onePercentage = proficiencyStats.ONE / numLeaves
    var twoPercentage = proficiencyStats.TWO / numLeaves
    var threePercentage = proficiencyStats.THREE / numLeaves
    var fourPercentage = proficiencyStats.FOUR / numLeaves

    let startRadians = - Math.PI / 2 //start at North
    let endRadians = startRadians + percentageToRadians(unknownPercentage) ///check if i can init based off start, with using comma syntax
    drawPieSlice(context,x,y,size, startRadians, endRadians, unknownColor)

    startRadians = endRadians
    endRadians = startRadians + percentageToRadians(onePercentage)
    drawPieSlice(context,x,y,size, startRadians, endRadians, oneColor)

    startRadians = endRadians
    endRadians = startRadians + percentageToRadians(twoPercentage)
    drawPieSlice(context,x,y,size, startRadians, endRadians, twoColor)

    startRadians = endRadians
    endRadians = startRadians + percentageToRadians(threePercentage)
    drawPieSlice(context,x,y,size, startRadians, endRadians, threeColor)

    startRadians = endRadians
    endRadians = startRadians + percentageToRadians(fourPercentage)
    drawPieSlice(context,x,y,size, startRadians, endRadians, fourColor)
}
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

