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
} from '../../../../app/core/globals';
import {
	calculateFlashcardPaddingFromNodeSize,
	calculateLabelLineHeightFromNodeSize,
	getMeasurerContext
} from './getDimensions';
import {start} from 'repl';
import {getNextLineToDraw} from './getNextLineToDraw';

function getWidthPerLetter(context, text): number {
	const metrics = context.measureText(text);
	const widthPerLetter = metrics.width / text.length * 1.05
	return widthPerLetter
}
/**
 * wraps text at starting x and y, with width
 * @param context
 * @param text
 * @param x
 * @param y
 * @param size
 */
export function wrapText(context, text, x, y, size/* maxWidth, lineHeight */): number {
	const words: string[] = text.split(' ');

	const lineHeight = calculateLabelLineHeightFromNodeSize(size)
	console.log('lineHeight is ', lineHeight)
	const maxWidth = size * 10
	context.shadowColor = 'transparent'
	context.font = size + `px ${FONT_FAMILY}`

	const oldStyle = context.fillStyle
	context.fillStyle = TERTIARY_COLOR
	// debugger;
	// let aLineWasJustFinished = false;

	const moreLinesToDraw = words.length > 0
	// const remainingWords = words
	const widthPerLetter = getWidthPerLetter(context, text)



	// will this work for if there are a bunch of blank lines . .. e.g. carriage returns?
	let {line, remainingWords} = getNextLineToDraw(words, widthPerLetter, maxWidth)
	drawLineInCenter({context, line, maxWidth})
	y += lineHeight;
	while (remainingWords.length > 0) {
		const result = getNextLineToDraw(remainingWords, widthPerLetter, maxWidth)
		line = result.line
		remainingWords = result.remainingWords
		drawLineInCenter({context, line, maxWidth})

		y += lineHeight;

	}

	// for (let n = 0; n < words.length; n++) {
	// 	console.log('for loop wordsThatFit blocked called, ', n, words)
	// 	const linePlusAnotherWord = line + words[n] + ' ';
	// 	const metrics = context.measureText(linePlusAnotherWord);
	// 	const testWidth = metrics.width;
	// 	const isFirstWordOnLine = n === 0  // || aLineWasJustFinished;
	// 	const addingTheWordWouldMakeTheLineTooLong = testWidth > maxWidth
	// 	const linePlusAnotherWordFits = testWidth <= maxWidth
	// 	if (addingTheWordWouldMakeTheLineTooLong) { // either draw the existing line, or if this is the first word in the line, draw the first kth letters of that word on this line
	// 		// The extra word doesn't fit on the line, let's draw the line
	// 		if (isFirstWordOnLine) {
	// 			const word = linePlusAnotherWord
	// 			drawLongwordMultipleLines({context, word, maxWidth, lineHeight})
	// 		} else {
	// 			drawLineInCenter({context, line, maxWidth})
	// 			// and then start a new line with this word that didn't fit.
	// 			line = words[n] + ' ';
	// 			y += lineHeight;
	// 		}
	// 	} else {
	//
	// 		line = linePlusAnotherWord
	// 	}
	// 	// if (linePlusAnotherWordFits && !isFirstWordOnLine) {
	// 	// 	// drawLineInCenter({context, line, maxWidth, x, y})
	// 	// 	// keep going through the loop so as to add another word to the line
	// 	// }
	// 	// // else if (addingTheWordWouldMakeTheLineTooLong && isFi)
	// 	// else {
	// 	// }
	// 	// if (addingTheWordWouldMakeTheLineTooLong) {
	// 	// } else {
	// 	// 	line = linePlusAnotherWord;
	// 	// }
	// }
	//
	// const availableSpace = maxWidth - testWidth;
	// const
	function drawLongwordMultipleLines({context, word, maxWidth, lineHeight}) {
		// console.log('drawLongwordMultipleLines called')
		const metrics = context.measureText(word);
		const widthPerLetter = metrics.width / word.length
		const letterPaddingsPerSide = calculateFlashcardPaddingFromNodeSize(size) / widthPerLetter
		const lettersPerLineBeforePadding = maxWidth / widthPerLetter
		const lettersPerLine = lettersPerLineBeforePadding - 2 * letterPaddingsPerSide
		let lettersRemaining = word.length
		let startPos = 0
		while (lettersRemaining > 0) {
			// console.log('draw block called. num letters remaining is', lettersRemaining)
			const line = getSubstring(word, lettersPerLine, startPos  )
			drawLineInCenterItFits({context, line, maxWidth })
			y += lineHeight
			startPos += line.length
			lettersRemaining = word.length - startPos
		}
	}
	function drawLineInCenterItFits({context, line, maxWidth}) {
		const currentLineMetrics = context.measureText(line);
		const currentLineWidth = currentLineMetrics.width;
		const extraSpaceInLine = maxWidth - currentLineWidth;
		if (extraSpaceInLine >= 0) {
			const offset = extraSpaceInLine / 2;
			context.fillText(line, x + offset, y);
		} else { // the line itself is likely one word, but still doesn't even fit, meaning we are going to have to wrap that word
			console.error('Line DOES NOT FIT')

		}
	}
	function getSubstring(str: string, length, startPos) {
		if (str.length - startPos < length) {
			return str.substr(startPos)
		} else {
			return str.substr(startPos, startPos + length)
		}

	}
	// This line itself may be one word and not even fit within max width.
	/*
	@precondition: line fits on one line
	 */
	function drawLineInCenter({context, line, maxWidth}) {
		// debugger;
		const currentLineMetrics = context.measureText(line);
		const currentLineWidth = currentLineMetrics.width;
		const extraSpaceInLine = maxWidth - currentLineWidth;
		// if (extraSpaceInLine >= 0 ) {
			const offset = extraSpaceInLine / 2;
			context.fillText(line, x + offset, y);
		// }
		// else { // the line itself is likely one word, but still doesn't even fit, meaning we are going to have to wrap that word
		// 	drawLongwordMultipleLines({context, word: line, maxWidth, lineHeight})
		//
		// }
	}
	context.fillStyle = oldStyle;
	const endingYPosition = y // + lineHeight
	return endingYPosition
}

export function drawWrappedText(context, text, startX, startY, width): number {

	return 2
}
