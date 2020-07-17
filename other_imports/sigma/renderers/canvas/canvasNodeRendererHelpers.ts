import {
	ISigmaNode,
	ISigmaNodeData
} from '../../../../app/objects/interfaces';
import {MAP_STATES} from '../../../../app/objects/mapStateManager/MAP_STATES';
import {
	DEFAULT_BORDER_RADIUS,
	QUATERNARY_COLOR,
	TERTIARY_COLOR
} from '../../../../app/core/globals';
import {
	calculateFlashcardPaddingFromNodeSize,
	getDimensions
} from './getDimensions';
import {PROFICIENCIES} from '../../../../app/objects/proficiency/proficiencyEnum';
import {ProficiencyUtils} from '../../../../app/objects/proficiency/ProficiencyUtils';
import {
	calculateCardDimensions,
	calculateStartXY
} from './cardDimensions';
import {wrapText} from './wrapText';
import {cardInteractedWith} from '../../../../app/objects/sigmaNode/sigmaNodeHelpers';

export function mainModeNodeRenderer(node: ISigmaNode, context, settings) {
	const mapState = MAP_STATES.MAIN
	drawNodeWithText(node, context, settings, mapState);
}
// TODO: this should be defined inside of a mapState class. . . not in this file.
export function darkModeNodeRenderer(node: ISigmaNode, context, settings) {
	const mapState = MAP_STATES.DARK
	drawNodeWithText(node, context, settings, mapState);
}

export function drawNodeWithText(node: ISigmaNode, context, settings, mapState: MAP_STATES) {
	// context.fillStyle = node.color || settings('defaultNodeColor');
	context.font = 'Nunito';

	// drawNode(context, node, size, x, y)
	const {size, x, y} = getDimensions(node, settings);
	// console.log("node x and y are ", node.id, x, y)
	const {width, height, halfWidth, halfHeight, lineHeight} = calculateCardDimensions(node, size)
	const {startX, startY} = calculateStartXY({
		centerX: x,
		centerY: y,
		halfWidth,
		halfHeight,
		lineHeight
	})
	const color = getColorFromNodeAndState(node, mapState)
	drawNodeRectangleFilled({
		context,
		startX,
		startY,
		height, //: cardHeight,
		width, //: cardWidth,
		color,
		focused: node.focused
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
	// const lineHeight = calculateTextSizeFromNodeSize(size)

	const text = node.label; // + 'word word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoo'
	const textStartY = startY + lineHeight
	const endingYPosition = wrapText(context, text, startX, textStartY, size/* maxWidth, lineHeight */, )

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
export function getColorFromNodeAndState(node, mapState) {
	const proficiency = node && node.contentUserData && node.contentUserData.proficiency  || PROFICIENCIES.UNKNOWN
	const color = ProficiencyUtils.getColorFromMapState(proficiency, mapState);
		// color = 'white'

	// return 'white'
	return color;
}

export function drawNodeRectangleCoreCore({context, height, width, startX, startY, focused = false}) {
	context.beginPath(); // TODO: can we remove this line because of line 156?
	let r = DEFAULT_BORDER_RADIUS; // TODO: adjust radius based on card size
	// context.rect(
	// 	startX,
	// 	startY,
	// 	width,
	// 	height
	// )
	r = width * .07; //TODO: adjust based on size, not width; eventually width and height will be use defined by a stretching action
	// if (width < 2 * r) {
	// 	r = width / 2;
	// }
	// if (height < 2 * r) {
	// 	r = height / 2;
	// }
	context.shadowBlur = 10;
	context.shadowColor = focused ? QUATERNARY_COLOR : TERTIARY_COLOR;
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

export function drawNodeRectangleFilled({context, startX, startY, width, height, color = 'white', focused = false}) {
	// const color = getColorFromNodeAndState(node);
	context.fillStyle = color;
	drawNodeRectangleCoreCore({
		context,
		width,
		height,
		startX,
		startY,
		focused
	});
	// from https://github.com/jacomyal/sigma.js/wiki/Renderers
	context.closePath();
	context.fill();

}

export function drawNodeRectangleOutline({context, startX, startY, width, height, color = 'white'}) {

	context.strokeStyle = TERTIARY_COLOR;
	context.font = '1px Nunito'; // TODO: what does font have anything to do with this?
	// const color = getColorFromNodeAndState(node);
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
// 	const color = getColorFromNodeAndState(node);
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
