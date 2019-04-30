import {FONT_FAMILY} from '../../app/core/globals';
import {wrapText} from './renderers/canvas/sigma.canvas.nodes.def';
export const SAMPLE_TEXT = 'word word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoo'

export function getDimensions(node, settings) {
	const prefix = settings('prefix') || '';
	const obj = {
		size: node[prefix + 'size'],
		x: node[prefix + 'x'],
		y: node[prefix + 'y'],
	};
	return obj;

}
/**
 * calcWidth(node)
 * calcHeight(node, settings)
 * calcTopLeft(node)
 * calcTopRight(node)
 * calcBottomLeft(node)
 * calcBottomRight(node)
 * isInside(node, x, y)
 *
 * drawNodeWithText(ctx, node)
*/
function calcHeight(node, settings): number {
      // const element = document.querySelector('.context-measurer') as HTMLCanvasElement;
      //  const context = element.getContext('2d');
      //  context.font = FONT_FAMILY;
			//
      //  const {x, y, size} = getDimensions(node, settings)
      //  const startingYPosition = y
      //  const text = SAMPLE_TEXT
			//
			//
      //  const endingYPosition = wrapText(context, text, x, y, size/* maxWidth, lineHeight */)
      //  const lineHeight = calculateLabelLineHeightFromNodeSize(size)
      //  const padding = calculateFlashcardPaddingFromNodeSize(size)
      //  const textHeight = endingYPosition - startingYPosition
      //  const height = textHeight + 2 * padding
      //  console.log("calcHeight - textHeight and size are", textHeight, size, textHeight / size, height)
			//
      //  return height;
	return 2
}
export function calculateLabelLineHeightFromNodeSize(size: number) {
       return size
}
export function calculateFlashcardPaddingFromNodeSize(size: number) {
       return size / 3
}
