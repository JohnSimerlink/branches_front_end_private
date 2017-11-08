
;(function(undefined) {
    'use strict';

    if (typeof sigma === 'undefined')
        throw 'sigma is not declared';

    var labelLevels = {}
    var packageData = {
        width: 0,
        height: 0,
        numRowsOnScreen: 0,
        numColumnsOnScreen: 5,
        initialized: false,
        labels: {},
        labelLevels: labelLevels,
    }

    window.packageData = packageData

    var xOffset = 50
        var rowHeight = sigma.settings.defaultLabelSize * 1.75
    document.addEventListener('DOMContentLoaded', function(event){
        var graphContainer = document.querySelector('#graph-container')
        if (!graphContainer) return //e.g. a user is not on the knowledgeMap page
        packageData.width = graphContainer.clientWidth
        packageData.height = graphContainer.clientHeight
        packageData.rowHeight = rowHeight
        packageData.numRowsOnScreen = packageData.height / rowHeight /*packageData.height / (sigma.settings.defaultLabelSize * .75)*/
        packageData.columnWidth = packageData.width / packageData.numColumnsOnScreen
        packageData.initialized = true
        clearLabelKnowledge()
    })

    var A_BIG_NUMBER = 9001
    function clearLabelKnowledge(){
        for (var row = 0; row < packageData.numRowsOnScreen; row++ ) {
            labelLevels[row] = []
            for (var column = 0; column < packageData.numColumnsOnScreen; column++) {
                labelLevels[row][column] = {id: null, label: null, level: A_BIG_NUMBER}
            }
        }
    }

    resetLabelData()
    PubSub.subscribe('canvas.zoom',resetLabelData)
    // PubSub.subscribe('canvas.clicked',function(){
    //     resetLabelData()
    // })

    function resetLabelData() {
        packageData.labels = {}
        clearLabelKnowledge()
        packageData.displayCount = 0
        packageData.hideCount = 0
        packageData.recentHistory =[]
        packageData.justReset = true
    }
    window.resetLabelData = resetLabelData
    //assumes fixed label size
    function determineSection(node){
        var x = node['renderer1:x']
        var y = node['renderer1:y']
        var column = Math.floor(x / packageData.columnWidth)
        var row = Math.floor(y / packageData.rowHeight)
        var section = {row, column}
        return {row, column}
    }
    function sectionOffScreen(section){
        if (section.row <0 || section.row >= packageData.numRowsOnScreen || section.column < 0 || section.column >= packageData.numColumnsOnScreen ){
            return true
        }
    }
    function getHeightFromNodeLevel(level){
        // var height = window.s.settings('defaultLabelSize') + 2.5 * 8 / level
        return window.s && window.s.settings('defaultLabelSize') + 2.5 * 8 / level || 14
    }
    // Initialize packages:
    sigma.utils.pkg('sigma.canvas.labels');

    PubSub.subscribe('canvas.nodesRendering', function(eventName,data){
    })
    /**
     * This label renderer will just display the label on the right of the node.
     *
     * @param  {object}                   node     The node object.
     * @param  {CanvasRenderingContext2D} context  The canvas context.
     * @param  {configurable}             settings The settings function.
     */
    sigma.canvas.labels.prioritizable = function(node, context, settings) {
        // debugger;
        packageData.recentHistory.push(node)
        var fontSize,
            prefix = settings('prefix') || '',
            size = node[prefix + 'size'];
        if (!node.label || typeof node.label !== 'string') {
            return;
        }


        // fontSize = settings('defaultLabelSize') + 2.5 * 8 / node.level // (settings('labelSize') === 'fixed') ?
        fontSize = getLabelFontSizeFromNode(node, settings)
        // settings('defaultLabelSize') :
        // settings('labelSizeRatio') * size;

        var section = determineSection(node)
        if (sectionOffScreen(section)){
            packageData.hideCount++
            return
        } else {
        }

            // labels.push({id: node.id, label: node.label, row:section.row, column:section.column})
        var nodeAtThatSection = labelLevels[section.row][section.column]
        if (node.level >= nodeAtThatSection.level && node.id != nodeAtThatSection.id) {
            return
        }

        var info = {id: node.id, label: node.label, level: node.level, row:section.row, column:section.column, height: getHeightFromNodeLevel(node.level)}
        packageData.labels[node.label] = info
        labelLevels[section.row][section.column] = info // labelLevels[section.row][section.column] || {}
        // labelLevels[section.row][section.column].level = node.level // = labelLevels[section.row][section.column] || {}
        // labelLevels[section.row][section.column].id = node.id //
        // labelLevels[section.row][section.column].label = node.label //
        labelLevels[section.row][section.column].count = typeof labelLevels[section.row][section.column].count == 'undefined' ?
            1 : labelLevels[section.row][section.column].count + 1 //    0//   = node.label //


        // {priority: 9001, id: node.id, label: node.label}
        // if (labelLevels[section.row][section.column])

        // if (size < settings('labelThreshold'))
        //     return;

        context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
            fontSize /*+ 0 /node.level */ + 'px ' + settings('font');
        context.fillStyle = (settings('labelColor') === 'node') ?
            (node.color || settings('defaultNodeColor')) :
            settings('defaultLabelColor');

        var x = Math.round(node[prefix + 'x'] /*+ size + 3*/)
        var y = Math.round(node[prefix + 'y'] + fontSize / 3)
        var label = node.label.length > 20 ? node.label.substring(0,19) + ' . . .' : node.label
        context.fillText(
            label,
            x,
            y
        );
    };
}).call(window);

window.getLabelFontSizeFromNode = function(node, settings){
    var fontSize = settings('defaultLabelSize') + 2.5 * 8 / node.level // (settings('labelSize') === 'fixed') ?
    return fontSize
}