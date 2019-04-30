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

export function wrapText(context, text, x, y, size/* maxWidth, lineHeight */): number {
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
