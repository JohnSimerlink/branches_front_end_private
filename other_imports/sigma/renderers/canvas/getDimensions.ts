import {FONT_FAMILY} from '../../../../app/core/globals';
import {wrapText} from './wrapText';

export const SAMPLE_TEXT = 'word word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoo';
const DEFAULT_PREFIX = 'renderer1:';

export function getDimensions(node, settings?) {
	const prefix = settings && typeof settings === 'function' && settings('prefix') || DEFAULT_PREFIX; //  || '';
	const obj = {
		size: node[prefix + 'size'],
		x: node[prefix + 'x'],
		y: node[prefix + 'y'],
	};
	return obj;

}

/**
 * calcWidth(node)
 * calcMidLeftPoint(node)
 * calcCenterTopPoint(node)
 * calcHeight(node, settings) - should be like drawWrappedText(fakeContext,. ...) + calcPadding() * 2
 * calcPadding(node)
 * calcTopLeft(node)
 * calcTopRight(node)
 * calcBottomLeft(node)
 * calcBottomRight(node)
 * isInside(node, x, y)
 * drawWrappedText(context, text, startX, startY, width): height
 * drawNodeWithText(ctx, node)
 */
export function calcHeight(node, settings?): number {
	const element = document.querySelector('.context-measurer') as HTMLCanvasElement;
	const context = element.getContext('2d');
	context.font = FONT_FAMILY;

	const {x, y, size} = getDimensions(node, settings);
	const startingYPosition = y;
	const text = node.label; // SAMPLE_TEXT
	//
	//
	const endingYPosition = wrapText(context, text, x, y, size/* maxWidth, lineHeight */);
	const lineHeight = calculateLabelLineHeightFromNodeSize(size);
	const padding = calculateFlashcardPaddingFromNodeSize(size);
	const textHeight = endingYPosition - startingYPosition;
	const height = textHeight + 2 * padding;
	// console.log("calcHeight - textHeight and size are", node.label, lineHeight, textHeight, textHeight / lineHeight, size, textHeight / size, height)

	return height;
	// return 2
}

export function calculateLabelLineHeightFromNodeSize(size: number) {
	return size;
}

export function calculateFlashcardPaddingFromNodeSize(size: number) {
	return size / 5;
	// return size / 3
}
