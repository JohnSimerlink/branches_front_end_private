;(function(undefined) {
  'use strict';

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
  sigma.canvas.labels.def = function(node, context, settings) {
    // console.log('label context is ', context)
    var fontSize,
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'];

    if (size < settings('labelThreshold'))
      return;

    if (!node.label || typeof node.label !== 'string')
      return;

    fontSize = (settings('labelSize') === 'fixed') ?
      settings('defaultLabelSize') :
      settings('labelSizeRatio') * size;

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

    sigma.canvas.labels.def2 = function(node, context, settings) {
        // console.log('DEF2 label context is ', context)
        var fontSize,
            prefix = settings('prefix') || '',
            size = node[prefix + 'size'];

        if (size < settings('labelThreshold'))
            return;

        if (!node.label || typeof node.label !== 'string')
            return;

        fontSize = (settings('labelSize') === 'fixed') ?
            settings('defaultLabelSize') :
            settings('labelSizeRatio') * size;

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

;(function(undefined) {
    'use strict';

    if (typeof sigma === 'undefined')
        throw 'sigma is not declared';
    //
    // var packageSettings = {
    //     width: 0,
    //     height: 0,
    //     numRowsOnScreen: 0,
    //     numColumnsOnScreen: 5,
    //     initialized: false
    // }
    //
    // var labelLevels = {}
    // window.labelLevels = labelLevels
    //
    // var xOffset = 50
    // document.addEventListener('DOMContentLoaded', function(event){
    //     var graphContainer = document.querySelector('#graph-container')
    //     packageSettings.width = graphContainer.clientWidth
    //     packageSettings.height = graphContainer.clientHeight
    //     packageSettings.numRowsOnScreen = packageSettings.height / (sigma.settings.defaultLabelSize * .75)
    //     packageSettings.columnWidth = packageSettings.width / packageSettings.numColumnsOnScreen
    //     packageSettings.rowHeight = sigma.settings.defaultLabelSize * .75
    //     packageSettings.initialized = true
    //     clearLabelKnowledge()
    // })
    //
    // var A_BIG_NUMBER = 9001
    // function clearLabelKnowledge(){
    //     for (var row = 0; row < packageSettings.numRowsOnScreen; row++ ) {
    //         labelLevels[row] = []
    //         for (var column = 0; column < packageSettings.numColumnsOnScreen; column++) {
    //             labelLevels[row][column] = {level: A_BIG_NUMBER}
    //         }
    //     }
    // }
    // var labels = []
    //
    // PubSub.subscribe('canvas.zoom', function(){
    //     labels = []
    // })
    //
    // //assumes fixed label size
    // function determineSection(node){
    //     var x = node['renderer1:x']
    //     var y = node['renderer1:y']
    //     var column = Math.floor(x / packageSettings.columnWidth)
    //     var row = Math.floor(y / packageSettings.rowHeight)
    //     var section = {row, column}
    //     // console.log('the x and y determined were', x,y)
    //     // console.log('the section determined was', section)
    //     return {row, column}
    // }
    // // Initialize packages:
    sigma.utils.pkg('sigma.canvas.labels');

    /**
     * This label renderer will just display the label on the right of the node.
     *
     * @param  {object}                   node     The node object.
     * @param  {CanvasRenderingContext2D} context  The canvas context.
     * @param  {configurable}             settings The settings function.
     */
    sigma.canvas.labels.prioritizable = function(node, context, settings) {
        // console.log("prioritizable label called", node)
        var fontSize,
            prefix = settings('prefix') || '',
            size = node[prefix + 'size'];
        if (!node.label || typeof node.label !== 'string')
            return;

        fontSize = (settings('labelSize') === 'fixed') ?
        settings('defaultLabelSize') :
        settings('labelSizeRatio') * size;

        // var section = determineSection(node)
        // // if (section.row < 0 || section.column < 0){
        // //     return
        // // }
        //
        // if (section.row <0 || section.row >= packageSettings.numRowsOnScreen || section.column < 0 || section.column >= packageSettings.numColumnsOnScreen ){
        //     // console.log('item is off sector')
        //     return
        // }
        // labels.push({id: node.id, label: node.label, row, column})
        // if (node.level >= labelLevels[section.row][section.column].level) {
        //    return
        // }
        // labelLevels[section.row][section.column] = labelLevels[section.row][section.column] || {}
        // labelLevels[section.row][section.column].level = node.level // = labelLevels[section.row][section.column] || {}
        // labelLevels[section.row][section.column].id = node.id //
        // labelLevels[section.row][section.column].label = node.label //
        // labelLevels[section.row][section.column].count = typeof labelLevels[section.row][section.column].count == 'undefined' ?
        //     1 : labelLevels[section.row][section.column].count + 1 //    0//   = node.label //
        //

        // {priority: 9001, id: node.id, label: node.label}
        // if (labelLevels[section.row][section.column])

        if (size < settings('labelThreshold'))
            return;

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
