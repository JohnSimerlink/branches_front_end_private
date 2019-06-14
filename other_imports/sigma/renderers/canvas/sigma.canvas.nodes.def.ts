import sigmaUntyped
	from '../../sigma.core';
import {ProficiencyUtils} from '../../../../app/objects/proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../../../../app/objects/proficiency/proficiencyEnum';
import {
	calculateCardDimensions,
	calculateCardHeight,
	calculateCardWidth,
	calculateStartXY
} from './cardDimensions';
import {ISigma} from '../../../../app/objects/interfaces';
import {
	DEFAULT_BORDER_RADIUS,
	TERTIARY_COLOR
} from '../../../../app/core/globals';
import {
	calcHeight,
	calculateFlashcardPaddingFromNodeSize,
	calculateLabelLineHeightFromNodeSize,
	getDimensions
} from './getDimensions';
import {wrapText} from './wrapText';

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
	if (proficiency > PROFICIENCIES.THREE) {
		return Globals.colors.proficiency_4;
	}
	if (proficiency > PROFICIENCIES.TWO) {
		return Globals.colors.proficiency_3;
	}
	if (proficiency > PROFICIENCIES.ONE) {
		return Globals.colors.proficiency_2;
	}
	if (proficiency > PROFICIENCIES.UNKNOWN) {
		return Globals.colors.proficiency_1;
	}
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
	drawNodeWithText(node, context, settings);
};

export function drawNodeWithText(node, context, settings) {
	context.fillStyle = node.color || settings('defaultNodeColor');
	context.font = 'Nunito';

	// drawNode(context, node, size, x, y)
	const {size, x, y} = getDimensions(node, settings);
	const {width, height, halfWidth, halfHeight, lineHeight} = calculateCardDimensions(node, size)
	const {startX, startY} = calculateStartXY({
		centerX: x,
		centerY: y,
		halfWidth,
		halfHeight,
		lineHeight
	})
	const color = getColorFromNode(node)
	drawNodeRectangleFilled({
		context,
		startX,
		startY,
		height, //: cardHeight,
		width, //: cardWidth,
		color
	})
	// const cardWidth = calculateCardWidth(node, size)
	// // const cardHeight = calculateCardHeight(node, size)
	// const cardHeight = calcHeight(node, settings)
	// // drawNodeRectangleFilled(context, node, size, x, y);
	// // console.log('cardHeight is', cardHeight)
	// const halfWidth = cardWidth / 2
	// const halfHeight = cardHeight / 2
	// // const cardHeight = calculateCardHeight(node, size)
	//
	//
	// const label = node.label.length > 20 ? node.label.substring(0, 19) + ' . . .' : node.label
	// // const maxWidth = 400
	// // const lineHeight = 24
	//
	//
	// const lineHeight = calculateLabelLineHeightFromNodeSize(size)

	const text = node.label; // + 'word word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoo'
	const textStartY = startY + lineHeight
	const endingYPosition = wrapText(context, text, startX, textStartY, size/* maxWidth, lineHeight */)

	markNodeOverdueIfNecessary(context, node, size, x + halfWidth * .8, y + halfHeight * .8);
	const lineWidth = context.lineWidth;
	highlightNodeIfNecessary(context, node, size, x, y);
	context.lineWidth = lineWidth;
}


export function getColorFromNode(node) {
	let color;
	if (node && node.contentUserData && node.contentUserData.proficiency) {
		color = ProficiencyUtils.getColor(node.contentUserData.proficiency);
	} else {
		// color = ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN);
		color = 'white'

	}
	// return 'white'
	return color;
}

export function drawNodeRectangleCoreCore({context, height, width, startX, startY,}) {
	context.beginPath(); // TODO: can we remove this line because of line 156?
	let r = DEFAULT_BORDER_RADIUS; // TODO: adjust radius based on card size
	// context.rect(
	// 	startX,
	// 	startY,
	// 	width,
	// 	height
	// )
	if (width < 2 * r) {
		r = width / 2;
	}
	if (height < 2 * r) {
		r = height / 2;
	}
	context.shadowBlur = 10;
	context.shadowColor = TERTIARY_COLOR;
	context.shadowOffsetX = -4; // determine based on size
	context.shadowOffsetY = 4;
	context.beginPath();
	context.moveTo(startX + r, startY);
	context.arcTo(startX + width, startY, startX + width, startY + height, r);
	context.arcTo(startX + width, startY + height, startX, startY + height, r);
	context.arcTo(startX, startY + height, startX, startY, r);
	context.arcTo(startX, startY, startX + width, startY, r);
	context.closePath();
	context.save()
	// context.shadowBlur = 0;
	// // context.shadowColor='transparent'
	// context.shadowOffsetX = 0;
	// context.shadowOffsetY = 0;

}

export function drawNodeRectangleCore(context, node, size, centerX, centerY, hover = false) {
	const {width, height, halfWidth, halfHeight, lineHeight} = calculateCardDimensions(node, size)
	// const halfWidth = calculateCardWidth(node, size) / 2;
	// const height = calculateCardHeight(node, size);
	// const halfHeight = height / 2;

	const {startX, startY} = calculateStartXY({
		centerX,
		centerY,
		halfWidth,
		halfHeight,
		lineHeight
	})
	// const startX = x - halfWidth
	// const startY = y - halfHeight
	const padding = calculateFlashcardPaddingFromNodeSize(size) // 0
	drawNodeRectangleCoreCore({
		context,
		height: height + padding * 2,
		width: halfWidth * 2 + padding * 2,
		startX,
		startY,
	})
	// context.beginPath();
	// context.rect(
	// 	startX,
	// 	startY,
	// 	halfWidth * 2,
	// 	height
	// );

}


export function drawNodeRectangleFilled({context, startX, startY, width, height, color = 'white'}) {
	// const color = getColorFromNode(node);
	context.fillStyle = color;
	drawNodeRectangleCoreCore({
		context,
		width,
		height,
		startX,
		startY
	});
	// from https://github.com/jacomyal/sigma.js/wiki/Renderers
	context.closePath();
	context.fill();

}

export function drawNodeRectangleOutline({context, startX, startY, width, height, color = 'white'}) {

	context.strokeStyle = TERTIARY_COLOR;
	context.font = '1px Nunito'; // TODO: what does font have anything to do with this?
	// const color = getColorFromNode(node);
	drawNodeRectangleCoreCore({
		context,
		width,
		height,
		startX,
		startY
	});
	// from https://github.com/jacomyal/sigma.js/wiki/Renderers
	context.closePath();
	context.stroke();

}

// function drawNodeRectangleFilled(context, node, size, x, y) {
// 	const color = getColorFromNode(node);
// 	context.fillStyle = color;
// 	drawNodeRectangleCore(context, node, size, x, y);
// 	// from https://github.com/jacomyal/sigma.js/wiki/Renderers
// 	context.closePath();
// 	context.fill();
//
// }

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
