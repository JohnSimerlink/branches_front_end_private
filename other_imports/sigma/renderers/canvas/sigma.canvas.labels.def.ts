import sigma_untyped
	from '../../sigma.core'
import {
	clearLabelKnowledge,
	initializePackageData,
	labelLevels,
	packageData
} from './sigmaLabelPrioritizer'
import {
	getLabelFontSizeFromNode,
	getLabelYFromNodeAndFontSize
} from '../../utils/sigma.utils.branches';
import {
	ISigma,
	ISigmaConstructor,
	ISigmaNode
} from '../../../../app/objects/interfaces';


typeof document !== 'undefined' && document.addEventListener('DOMContentLoaded', function (event) {
	initializePackageData()
})
const sigma: ISigmaConstructor = sigma_untyped as any as ISigmaConstructor


resetLabelData()

function resetLabelData() {
	packageData.labels = {}
	clearLabelKnowledge()
	packageData.displayCount = 0
	packageData.hideCount = 0
	packageData.recentHistory = []
	packageData.justReset = true
}

;(window as any).resetLabelData = resetLabelData

// assumes fixed label size
function determineSection(node, prefix) {
	// TODO: if the if branching costs performance, after init, just replace the function with a non branching one
	if (!packageData.initialized) {
		initializePackageData()
	}
	var x = node[prefix + 'x']
	var y = node[prefix + 'y']
	var column = Math.floor(x / packageData.columnWidth)
	var row = Math.floor(y / packageData.rowHeight)
	var section = {
		row,
		column
	}
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
sigma.canvas.labels = sigma.canvas.labels || { def: null, prioritizable: null}

// PubSub.subscribe('canvas.nodesRendering', function (eventName, data) {
// })
/**
 * This label renderer will just display the label on the right of the node.
 *
 * @param  {object}                   node     The node branchesMap.
 * @param  {CanvasRenderingContext2D} context  The canvas context.
 * @param  {configurable}             settings The settings function.
 */
sigma.canvas.labels.prioritizable = function (node: ISigmaNode, context, settings) {
	// console.log("label function called", node, node.label)
	return false
	packageData.recentHistory.push(node)
	var fontSize,
		prefix = settings('prefix') || '',
		size = node[prefix + 'size'];
	if (!node.label || typeof node.label !== 'string') {
		return;
	}
	// if (node.hovering) {
	//     return
	// }
	fontSize = getLabelFontSizeFromNode(node, settings)

	var section = determineSection(node, prefix)
	// var x = node[prefix + 'x']
	// var y = node[prefix + 'y']
	if (sectionOffScreen(section)) {
		packageData.hideCount++
		return
	}

	let nodeAtThatSection = labelLevels[section.row][section.column]
	if (node.level >= nodeAtThatSection.level && node.id !== nodeAtThatSection.id) {
		return
	}

	var info = {
		id: node.id,
		label: node.label,
		level: node.level,
		row: section.row,
		column: section.column,
		height: getHeightFromNodeLevel(node.level)
	}
	packageData.labels[node.label] = info
	labelLevels[section.row][section.column] = info // labelLevels[section.row][section.column] || {}
	labelLevels[section.row][section.column].count = typeof labelLevels[section.row][section.column].count == 'undefined' ?
		1 : labelLevels[section.row][section.column].count + 1 //    0//   = node.label //

	context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
		fontSize /*+ 0 /node.level */ + 'px ' + settings('font');
	// context.fillStyle = (settings('labelColor') === 'node') ?
	// 	(node.color || settings('defaultNodeColor')) :
	// 	settings('defaultLabelColor');

	const x: number = Math.round(node[prefix + 'x'] /*+ size + 3*/)
	const y = getLabelYFromNodeAndFontSize(node, prefix, fontSize)

	var label = node.label.length > 20 ? node.label.substring(0, 19) + ' . . .' : node.label
	// context.fillText(
	// 	label,
	// 	x,
	// 	y
	// );

	// const text = label + 'word word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoo'
	// const maxWidth = 400
	// const lineHeight = 24
	// wrapText(context, text, x, y, maxWidth, lineHeight)
	//
	// function wrapText(context, text, x, y, maxWidth, lineHeight) {
	// 	var wordsThatFit = text.split(' ');
	// 	var line = '';
	//
	// 	for (var n = 0; n < wordsThatFit.length; n++) {
	// 		var testLine = line + wordsThatFit[n] + ' ';
	// 		var metrics = context.measureText(testLine);
	// 		var testWidth = metrics.width;
	// 		if (testWidth > maxWidth && n > 0) {
	// 			context.fillText(line, x, y);
	// 			line = wordsThatFit[n] + ' ';
	// 			y += lineHeight;
	// 		} else {
	// 			line = testLine;
	// 		}
	// 	}
	// 	context.fillText(line, x, y);
	// }


};

