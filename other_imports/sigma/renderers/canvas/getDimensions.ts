import {FONT_FAMILY} from '../../../../app/core/globals';
import {wrapText} from './wrapText';
import {settings} from 'cluster';
import {ISigmaNodeData} from '../../../../app/objects/interfaces';
import {cardInteractedWith} from '../../../../app/objects/sigmaNode/sigmaNodeHelpers';
export const SAMPLE_TEXT = 'word word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoo'
const DEFAULT_PREFIX = 'renderer1:'

export function getDimensions(node: ISigmaNodeData, settings?) {
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
export function getMeasurerContext(): CanvasRenderingContext2D {

	const element = document.querySelector('.context-measurer') as HTMLCanvasElement;
	const context = element.getContext('2d');
	return context;
}
// export function calcHeightFromTextAndSize(text: string, size: number) {
//
// 	const context = getMeasurerContext()
// 	context.font = FONT_FAMILY;
//
// 	const {x, y, size} = getDimensions(node, settings)
// 	const startingYPosition = y
// 	const text = node.label // SAMPLE_TEXT
// 	//
// 	//
// 	const endingYPosition = wrapText(context, text, x, y, size/* maxWidth, lineHeight */)
// 	// const lineHeight = calculateTextSizeFromNodeSize(size)
// 	const padding = calculateFlashcardPaddingFromNodeSize(size)
// 	const textHeight = endingYPosition - startingYPosition
// 	const height = textHeight + 2 * padding
// 	// console.log("calcHeight - textHeight and size are", node.label, lineHeight, textHeight, textHeight / lineHeight, size, textHeight / size, height)
//
// 	return height;
// }
export function calcHeight(node: ISigmaNodeData, settings?): number {
			const context = getMeasurerContext()
      context.font = FONT_FAMILY;

      const {x, y, size} = getDimensions(node, settings)
      const startingYPosition = y
      const text = node.label // SAMPLE_TEXT
			//
			//
      const endingYPosition = wrapText(context, text, x, y, size/* maxWidth, lineHeight */)
      // const lineHeight = calculateTextSizeFromNodeSize(size)
      const padding = calculateFlashcardPaddingFromNodeSize(size)
      const textHeight = endingYPosition - startingYPosition
      const height = textHeight + 2 * padding
      // console.log("calcHeight - textHeight and size are", node.label, lineHeight, textHeight, textHeight / lineHeight, size, textHeight / size, height)

      return height;
	// return 2
}
export function calculateTextSizeFromNodeSize(size: number) {
      return size
}
export function calculateFlashcardPaddingFromNodeSize(size: number) {
	return size / 5
      // return size / 3
}
