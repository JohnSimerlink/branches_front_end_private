import {
	decibels,
	percentage_as_decimal,
	seconds,
	timestamp
} from '../interfaces';
import {
	calculateRecall,
	calculateTime
} from '../../forgettingCurve';

export function calculatePercentOpacity(
	{
		lastReviewTime,
		lastEstimatedStrength,
		now
	}: {
		lastReviewTime: timestamp,
		lastEstimatedStrength: decibels,
		now: timestamp
	}) {
	const timeSinceLastRecall: seconds = (now - lastReviewTime) / 1000

	const estimatedCurrentRecall: percentage_as_decimal = calculateRecall({
		S: lastEstimatedStrength,
		t: timeSinceLastRecall
	})

	const MAX_OPACITY = 1
	const MIN_OPACITY = .4 // make sure color is never invisible or too hard to see

	const opacity = MIN_OPACITY + (estimatedCurrentRecall) * (MAX_OPACITY - MIN_OPACITY)

	return opacity

}

/**
 *
 * @source https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
 */
export function colorToRGBA(color) {
	// Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
	// color must be a valid canvas fillStyle. This will cover most anything
	// you'd want to use.
	// Examples:
	// colorToRGBA('red')  # [255, 0, 0, 255]
	// colorToRGBA('#f00') # [255, 0, 0, 255]
	let cvs, ctx;
	cvs = document.createElement('canvas');
	cvs.height = 1;
	cvs.width = 1;
	ctx = cvs.getContext('2d');
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, 1, 1);
	return ctx.getImageData(0, 0, 1, 1).data;
}
