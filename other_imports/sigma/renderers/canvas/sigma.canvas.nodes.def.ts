import sigmaUntyped from '../../sigma.core';
import {ProficiencyUtils} from '../../../../app/objects/proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../../../../app/objects/proficiency/proficiencyEnum';
import {
	calculateCardHeight,
	calculateCardWidth
} from './getRectangleCorners';
import {ISigma} from '../../../../app/objects/interfaces';
import {
	FONT_FAMILY,
	TERTIARY_COLOR
} from '../../../../app/core/globals';
const sigma: ISigma = sigmaUntyped as unknown as ISigma;

// TODO: change all these sigma files to TS files
const NODE_TYPES = {
	SHADOW_NODE: 9100,
};

const Globals = {
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
};

function proficiencyToColor(proficiency) {
	if (proficiency > PROFICIENCIES.THREE) { return Globals.colors.proficiency_4; }
	if (proficiency > PROFICIENCIES.TWO) { return Globals.colors.proficiency_3; }
	if (proficiency > PROFICIENCIES.ONE) { return Globals.colors.proficiency_2; }
	if (proficiency > PROFICIENCIES.UNKNOWN) { return Globals.colors.proficiency_1; }
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
sigma.canvas.nodes.def = (node, context, settings) => {
	// console.log("canvas nodes def called", node, context, settings)
	if (node.type === NODE_TYPES.SHADOW_NODE) {
		return;
	}
	const {size, x, y} = getDimensions(node, settings);
	context.fillStyle = node.color || settings('defaultNodeColor');
	context.font = 'Nunito';

	// drawNode(context, node, size, x, y)
	drawNodeRectangleFilled(context, node, size, x, y);
	const cardWidth = calculateCardWidth(node, size)
	const cardHeight = calculateCardHeight(node, size)
	const halfWidth = cardWidth / 2
	const halfHeight = cardHeight / 2
	// const cardHeight = calculateCardHeight(node, size)


	const label = node.label.length > 20 ? node.label.substring(0, 19) + ' . . .' : node.label
	const text = label + 'word word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoo'
	// const maxWidth = 400
	// const lineHeight = 24


	const startX = x - halfWidth;
	const startY = y - halfHeight;

	const endingYPosition = wrapText(context, text, startX, startY, size/* maxWidth, lineHeight */)


	markNodeOverdueIfNecessary(context, node, size, x + cardWidth / 2 * .8, y + cardHeight / 2 * .8);
	const lineWidth = context.lineWidth;
	highlightNodeIfNecessary(context, node, size, x, y);
	context.lineWidth = lineWidth;
};

/**
 *
 * @param context
 * @param text
 * @param x
 * @param y
 * @param size
 * @returns endingYPosition
 */
function wrapText(context, text, x, y, size/* maxWidth, lineHeight */): number {
	const words = text.split(' ');
	let line = '';

	const lineHeight = size
	const maxWidth = size * 10
	context.font = size + `px ${FONT_FAMILY}`

	const oldStyle = context.fillStyle
	context.fillStyle = TERTIARY_COLOR
	for (let n = 0; n < words.length; n++) {
		const testLine = line + words[n] + ' ';
		const metrics = context.measureText(testLine);
		const testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			context.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		} else {
			line = testLine;
		}
	}
	context.fillText(line, x, y);
	context.fillStyle = oldStyle
	const endingYPosition = y
	return y
}
export function getDimensions(node, settings) {
	const prefix = settings('prefix') || '';
	const obj = {
		size: node[prefix + 'size'],
		x: node[prefix + 'x'],
		y: node[prefix + 'y'],
	};
	return obj;

}

export function getColorFromNode(node) {
	let color;
	if (node && node.contentUserData && node.contentUserData.proficiency) {
		color = ProficiencyUtils.getColor(node.contentUserData.proficiency);
	} else {
		color = ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN);
	}
	return 'white'
	// return color;
}

export function drawNodeRectangleCore(context, node, size, x, y, hover = false) {
	const halfWidth = calculateCardWidth(node, size) / 2;
	const height = calculateCardHeight(node, size);
	const halfHeight = height / 2;
	const startX = x - halfWidth
	const startY = y - halfHeight
	context.beginPath();
	context.rect(
		startX,
		startY,
		halfWidth * 2,
		height
	)






}

function drawNodeRectangleFilled(context, node, size, x, y) {
	const color = getColorFromNode(node);
	context.fillStyle = color;
	drawNodeRectangleCore(context, node, size, x, y);
	// from https://github.com/jacomyal/sigma.js/wiki/Renderers
	context.closePath();
	context.fill();

}

function placeTextOnRectangle(context, node, x, y) {
	const text = 'Hello this is a note';
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
		for (const colorSlice of node.colorSlices) {
			drawPieSlice(context, x, y, size, colorSlice.start, colorSlice.end, colorSlice.color);
		}
	} else {
		drawPieSlice(context,
			x,
			y,
			size,
			0,
			2 * Math.PI,
			ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN)
		);
	}
}

function drawCreateNodeIfNecessary(context, node, size, x, y) {

}

function markNodeOverdueIfNecessary(context, node, size, x, y) {
	if (node.overdue) {
		const fontSize = Math.floor(size * 1.414);
		context.font = fontSize + 'px Nunito';
		// context.fillText('\uf017', x + size, y + size) // << TODO : Seems to only work on localhost . .. not on production
		context.fillStyle = 'black';
		context.fillText('⏱', x + size, y + size); // ■►☼!⌚&#9200;&#8987', x + size, y + size)
	}
}

function highlightNodeIfNecessary(context, node, size, x, y) {
	if (node.highlighted) {
		const circleRadius = size;

		context.strokeStyle = 'blue';
		context.lineWidth = circleRadius / 4;
		context.fillStyle = 'blue';
		context.arc(x, y, circleRadius, 0, Math.PI * 2, true);
		context.stroke();
	}
}

function percentageToRadians(percentage) {
	return percentage * 2 * Math.PI;
}
