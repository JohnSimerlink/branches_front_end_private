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
    var prefix = settings('prefix') || '';

    var size = node[prefix + 'size'];
    context.fillStyle = node.color || settings('defaultNodeColor');
    var x = node[prefix + 'x']
    var y = node[prefix + 'y']
      var centerX = x + size
      var centerY = y + size
      if (window.awaitingEdgeConnection){
        if (node.content.type !== 'heading' && node.state !== 'awaitingEdgeConnection'){
            context.fillStyle = setOpacityOfRgbString(hexToRgbString(context.fillStyle), 0)
            // size = size * 1.5
        }
        if (node.content.type == 'heading'){
            var haloSize = size * window.haloSizeScalingFactor

            var center =
                context.beginPath()
            // context.fillStyle = 'black'
            context.strokeStyle = 'white'
            context.arc(
                x,
                y,
                haloSize,
                0,
                Math.PI * 2,
                true
            );
            context.stroke()
        }
      }
    if (node.state == 'awaitingEdgeConnection'){
        // context.fillStyle = setOpacityOfRgbString(hexToRgbString(context.fillStyle), .6)
        size = size * 1.5
        var haloSize = size * window.haloSizeScalingFactor

        var center =
        context.beginPath()
        // context.fillStyle = 'black'
        context.strokeStyle = 'black'
        context.arc(
            x,
            y,
            haloSize,
            0,
            Math.PI * 2,
            true
        );
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


  };
})();
