import sigmaUntyped	from '../../sigma.core';
import {DEFAULT_FONT_SIZE} from '../../../../app/core/globals';
import {
	getLabelFontSizeFromNode,
	getLabelYFromNodeAndFontSize
} from '../../utils/sigma.utils.branches';
import {drawNodeRectangleCore, getDimensions} from './sigma.canvas.nodes.def';
import {getRectangleCorners} from './getRectangleCorners';

import {ISigma} from '../../../../app/objects/interfaces';
// Initialize packages:
const sigma: ISigma = sigmaUntyped as unknown as ISigma;
sigma.utils.pkg('sigma.canvas.hovers');
sigma.canvas.hovers = sigma.canvas.hovers || {}

/**
 * This hover renderer will basically display the label with a background.
 *
 * @param  {object}                   node     The node branchesMap.
 * @param  {CanvasRenderingContext2D} context  The canvas context.
 * @param  {configurable}             settings The settings function.
 */
sigma.canvas.hovers.def = (node, context, settings) => {
	const {x, y, size} = getDimensions(context, node, settings)
	var	w,
		h,
		e,
		fontStyle = settings('hoverFontStyle') || settings('fontStyle'),
		prefix = settings('prefix') || '',
		// size = node[prefix + 'size'],
		fontSize = (settings('labelSize') === 'fixed') ?
			settings('defaultLabelSize') :
			settings('labelSizeRatio') * size;
	fontSize = DEFAULT_FONT_SIZE
	// fontSize = window.getLabelFontSizeFromNode(node, settings)
	// var fontSize =

	// Label background:
	context.font = (fontStyle ? fontStyle + ' ' : '') +
		fontSize + 'px ' + (settings('hoverFont') || settings('font'));

	context.beginPath();
	context.fillStyle = settings('labelHoverBGColor') === 'node' ?
		(node.color || settings('defaultNodeColor')) :
		settings('defaultHoverLabelBGColor');

	if (node.label && settings('labelHoverShadow')) {
		context.shadowOffsetX = 1;
		context.shadowOffsetY = 1;
		context.shadowBlur = 8;
		context.shadowColor = settings('labelHoverShadowColor');
	}

	// label textbox
	// if (node.label && typeof node.label === 'string') {
	//   x = Math.round(node[prefix + 'x'] - fontSize / 2 - 2);
	//   y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2);
	//   w = Math.round(
	//     context.measureText(node.label).width + fontSize / 2 + size + 7
	//   );
	//   h = Math.round(fontSize + 4);
	//   e = Math.round(fontSize / 2 + 2);
	//
	//   context.moveTo(x, y + e);
	//   context.arcTo(x, y, x + e, y, e);
	//   context.lineTo(x + w, y);
	//   context.lineTo(x + w, y + h);
	//   context.lineTo(x + e, y + h);
	//   context.arcTo(x, y + h, x, y + h - e, e);
	//   context.lineTo(x, y + e);
	//
	//   context.closePath();
	//   context.fill();
	//
	//   context.shadowOffsetX = 0;
	//   context.shadowOffsetY = 0;
	//   context.shadowBlur = 0;
	// }

	var font = context.font
	// Node border:
	if (settings('borderSize') > 0) {
		context.strokeStyle = 'black'
		context.font = '1px Nunito'; // TODO: what does font have anything to do with this?

		drawNodeRectangleCore(context, node, size, x, y, true)
		// context.arc(
		//     node[prefix + 'x'],
		//     node[prefix + 'y'],
		//     size + settings('borderSize'),
		//     0,
		//     2 * Math.PI,
		// );
		context.closePath();
		context.stroke();
	}
	context.font = font

	// Node:
	// var nodeRenderer = sigma.canvas.nodes[node.type] || sigma.canvas.nodes.def;
	// nodeRenderer(node, context, settings);
	// Display the label:

	if (false &&  node.label && typeof node.label === 'string') {
		context.shadowBlur = 0
		context.fillStyle = (settings('labelHoverColor') === 'node') ?
			(node.color || settings('defaultNodeColor')) :
			settings('defaultLabelHoverColor');
		fontSize = getLabelFontSizeFromNode(node, settings)
		context.font = (fontStyle ? fontStyle + ' ' : '') +
			fontSize + 'px ' + (settings('hoverFont') || settings('font'));

			const corners = getRectangleCorners(x, y, size)
			const padding = 8 / size;
			// const startingTextLocationX = corners.x1 + padding
			// const startingTextLocationY = corners.y1 + padding
			const startingTextLocationX = x
			const startingTextLocationY = y
		context.fillText(
			node.label,
			startingTextLocationX,
			startingTextLocationY
		);
	}
};
