;(function() {
  'use strict';

  const EDGE_TYPES = {
      SUGGESTED_CONNECTION: 9001,
      HIERARCHICAL: 9002,
  }
  sigma.utils.pkg('sigma.canvas.edges');

  /**
   * The default edge renderer. It renders the edge as a simple line.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  function renderSeveredEdge(edge, source, target, context, settings){
     return;
  }
  function renderPreSeveredEdge(edge, source, target, context, settings) {

  }

  sigma.canvas.edges.def = function(edge, source, target, context, settings) {
      if (edge.state == 'severed') {
          return
      }
      if (!window.awaitingEdgeConnection && edge.type == EDGE_TYPES.SUGGESTED_CONNECTION){
          return
      }
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
      if (window.awaitingEdgeConnection){
        color = setOpacityOfRgbString(colorToRgbString(color), .5)
      }

    context.strokeStyle = color;
    context.lineWidth = edge.state == 'pre-severed' || edge.type=== EDGE_TYPES.SUGGESTED_CONNECTION ? size * 3 * (window.haloEdgeSizeScalingFactor ): size * 3;
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

    if (edge.state == "pre-severed") {

        var x1 = source[prefix + 'x'],
            x2= target[prefix + 'x'],
            y1 = source[prefix + 'y'],
            y2 = target[prefix + 'y']
        var midX = (x1 + x2) / 2,
            midY = (y1 + y2) / 2

        var X_LEG_SIZE = 20
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
})();
