import sigma from '../../sigma.core'
import {DEFAULT_FONT_SIZE} from '../../../../app/core/globals.ts'
import {labelLevels} from './sigmaLabelPrioritizer.ts'
import {packageData} from './sigmaLabelPrioritizer.ts'
import {initializePackageData} from './sigmaLabelPrioritizer.ts'
import {clearLabelKnowledge} from './sigmaLabelPrioritizer.ts'

// window.packageData = packageData

var rowHeight = sigma.settings.defaultLabelSize * 1.75
typeof document !== 'undefined' && document.addEventListener('DOMContentLoaded', function (event) {
    initializePackageData()
})



resetLabelData()
// PubSub.subscribe('canvas.zoom', resetLabelData)
// PubSub.subscribe('canvas.clicked',function(){
//     resetLabelData()
// })

function resetLabelData() {
    packageData.labels = {}
    clearLabelKnowledge()
    packageData.displayCount = 0
    packageData.hideCount = 0
    packageData.recentHistory = []
    packageData.justReset = true
}
window.resetLabelData = resetLabelData

// window.resetLabelData = resetLabelData
//assumes fixed label size
function determineSection(node, prefix) {
    // TODO: if the if branching costs performance, after init, just replace the function with a non branching one
    if (!packageData.initialized) {
        initializePackageData()
        console.log('INITIALIZING PACKAGE DATA')
    }
    var x = node[prefix + 'x']
    var y = node[prefix + 'y']
    var column = Math.floor(x / packageData.columnWidth)
    var row = Math.floor(y / packageData.rowHeight)
    var section = {row, column}
    return section
}

function sectionOffScreen(section) {
    if (section.row < 0 || section.row >= packageData.numRowsOnScreen || section.column < 0 || section.column >= packageData.numColumnsOnScreen) {
        return true
    }
}

function getHeightFromNodeLevel(level) {
    // var height = window.s.settings('defaultLabelSize') + 2.5 * 8 / level
    // return window.s && window.s.settings('defaultLabelSize') + 2.5 * 8 / level || 14
}

// Initialize packages:
sigma.utils.pkg('sigma.canvas.labels');
sigma.canvas.labels = sigma.canvas.labels || {}

// PubSub.subscribe('canvas.nodesRendering', function (eventName, data) {
// })
/**
 * This label renderer will just display the label on the right of the node.
 *
 * @param  {object}                   node     The node object.
 * @param  {CanvasRenderingContext2D} context  The canvas context.
 * @param  {configurable}             settings The settings function.
 */
sigma.canvas.labels.prioritizable = function (node, context, settings) {
    // debugger;
    // console.log('sigma canvas prioritizable called!', node, context, settings, 'and prefix is', settings('prefix'))
    packageData.recentHistory.push(node)
    var fontSize,
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'];
    if (!node.label || typeof node.label !== 'string') {
        return;
    }
    if (node.label === 'Spanish') {
        // console.log('1NODE LABEL IS SPANISH!!!')
    }
    // console.log('sigma canvas prioritizable called 2!')

    // fontSize = settings('defaultLabelSize') + 2.5 * 8 / node.level // (settings('labelSize') === 'fixed') ?
    fontSize = getLabelFontSizeFromNode(node, settings)
    // console.log('fontSize in labels def is ', fontSize)
    // settings('defaultLabelSize') :
    // settings('labelSizeRatio') * size;

    var section = determineSection(node, prefix)
    var x = node[prefix + 'x']
    var y = node[prefix + 'y']
    // console.log ('section determined for ', node.label, x, y, ' was ', section)
    if (sectionOffScreen(section)) {
        packageData.hideCount++
        // console.log(node.label, 'is off screen!')
        return
    } else {
        // console.log(node.label, 'is on screen!')
    }
    // console.log('node section is', section)

    // labels.push({id: node.id, label: node.label, row:section.row, column:section.column})
    // console.log('sigma canvas prioritizable called 3!')

    var nodeAtThatSection = labelLevels[section.row][section.column]
    if (node.level >= nodeAtThatSection.level && node.id !== nodeAtThatSection.id) {
        // console.log(node.label, ' (level ' + node.level + ')  was overriden by ', nodeAtThatSection.label, ' (Level ' + nodeAtThatSection.level + ')!')
        return
    } else {
        // console.log(node.label, ' (level ' + node.level + ')  was NOT overriden by ', nodeAtThatSection.label, ' (Level ' + nodeAtThatSection.level + ')!')
    }

    var info = {
        id: node.id,
        label: node.label,
        level: node.level,
        row: section.row,
        column: section.column,
        height: getHeightFromNodeLevel(node.level)
    }
    // console.log('sigma canvas prioritizable called 4!')
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
    var label = node.label.length > 20 ? node.label.substring(0, 19) + ' . . .' : node.label
    // console.log('sigma canvas labels context fillText about to get called', label, x, y, context.font, DEFAULT_FONT_SIZE)
    context.fillText(
        label,
        x,
        y
    );
};

function getLabelFontSizeFromNode(node, settings){
    let fontSize
    if (!node.level) {
        fontSize = DEFAULT_FONT_SIZE
        // console.log('there is no node level. fontSize set by line 171', fontSize)
    } else {
        fontSize = settings('defaultLabelSize') + 2.5 * 8 / node.level // (settings('labelSize') === 'fixed') ?
    }
    return fontSize
}
