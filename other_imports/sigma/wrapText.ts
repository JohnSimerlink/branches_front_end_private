/**
 *
 * @param context
 * @param text
 * @param x
 * @param y
 * @param size
 * @returns endingYPosition
 */
import {
	FONT_FAMILY,
	TERTIARY_COLOR
} from '../../app/core/globals';
import {calculateLabelLineHeightFromNodeSize} from './getDimensions';

/**
 * wraps text at starting x and y, with width
 * @param context
 * @param text
 * @param x
 * @param y
 * @param size
 */
export function wrapText(context, text, x, y, size/* maxWidth, lineHeight */): number {
	const words = text.split(' ');
	let line = '';

	const lineHeight = calculateLabelLineHeightFromNodeSize(size)
	const maxWidth = size * 10
	context.shadowColor = 'transparent'
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
	const endingYPosition = y + lineHeight
	return endingYPosition
}

export function drawWrappedText(context, text, startX, startY, width): number {

	return 2
}
