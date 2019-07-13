export function getNextLineToDrawFromString(remainingWords: string, widthPerLetter: number, maxWidth: number, ): string | null {
	return null

}
export function getNextLineToDraw(remainingWords: string[], widthPerLetter, maxWidth, ): {line: string | null, remainingWords: string[]} {
	if (!remainingWords.length) {
		return {
			line: null,
			remainingWords
		}
	}
	const {widthUsed, wordsThatFit, remainingWords: newRemainingWords}
	= getAllFullWordsThatWillFit(remainingWords, maxWidth, widthPerLetter)

	const remainingWidth = maxWidth - widthUsed

	// we should NOT have partial wordsThatFit if there are other wordsThatFit on the line
	if (wordsThatFit.length <= 0) {
		const partialWord: string = getAllTextWithinWordThatWillFit(
			newRemainingWords[0],
			newRemainingWords,
			remainingWidth,
			widthPerLetter
		)
		return {
			line: partialWord,
			remainingWords: newRemainingWords,
		}
		// return partialWord
	} else {
		return {
			line: wordsThatFit,
			remainingWords: newRemainingWords
		}
		// return wordsThatFit
	}

	return null;
}
/**
 * @precondition: remainingWords.length > 0
 *
 * @postcondition: remainingWords changes appropriately
 */
export function getAllFullWordsThatWillFit(remainingWords: string[], maxWidth: number, widthPerLetter: number, ): {widthUsed: number, wordsThatFit: string, remainingWords: string[]} {
	console.log("getAllFullWordsThatWillFit called with ", remainingWords, maxWidth, widthPerLetter)
	// if
	let wordsThatFit = ''
	let widthSoFar = 0
	const firstWord = remainingWords[0]
	const firstWordWidth = firstWord.length * widthPerLetter
	if (firstWordWidth > maxWidth) { // if first word is longer than maxWidth, than no wordsThatFit fit
		return {
			widthUsed: 0,
			wordsThatFit: '',
			remainingWords
		}
	} else {
		wordsThatFit += firstWord
		widthSoFar += firstWordWidth
	}

	let i = 1;
	for (let currentWordWidth = 0, currentWord; i < remainingWords.length && widthSoFar <= maxWidth; i++) {
		currentWord = ' ' + remainingWords[i];
		currentWordWidth = currentWord.length * widthPerLetter /* TODO:
			 this may run into some UI errors, where some letters are skinnier/fatter than others,
			 meaning some letters will show up off the card */

		if (currentWordWidth + widthSoFar > maxWidth) {
			break;
		} else {
			widthSoFar += currentWordWidth
			wordsThatFit += currentWord
		}
	}
	console.log("remainingWords is currently", remainingWords)
	console.log(`remainingWords is about to splice at position ${i}`)
	const newRemainingWords = remainingWords.splice(i);
	console.log("remainingWords is now", newRemainingWords)
	return {
		widthUsed: widthSoFar,
		wordsThatFit,
		remainingWords: newRemainingWords,
	}
	//

}

/**
 *
 * @precondition width(word) > remainingWidth
 *
 * @postcondition first word in remainingWords gets spliced accordingly
 */
export function getAllTextWithinWordThatWillFit(word: string, remainingWords: string[], remainingWidth: number, widthPerLetter: number): string {

	console.log(
		`getAllTextWithinWordThatWillFit - ${word} : ${remainingWords.toString()} : ${remainingWidth} : ${widthPerLetter}`
	)
	let textThatFits
	// const widthPerLetter = getWidthPerLetter(context, word) // metrics.width / word.length
	const lettersPerUnitWidth = 1 / widthPerLetter
	console.log(`lettersPerUnitWidth ${lettersPerUnitWidth} : ${remainingWidth * lettersPerUnitWidth}`)
	const numLettersThatWillFit = Math.floor(remainingWidth * lettersPerUnitWidth)

	console.log(
		`before textThatFits made: word is ${word}. numLettersThatWillFit is ${numLettersThatWillFit}`
	)
	textThatFits = word.substring(0, numLettersThatWillFit)
	console.log(
		`textThatFits is ${textThatFits}`
	)

	// also update the firstWord in remainingWords
	word = word.substring(numLettersThatWillFit, word.length)
	console.log(
		`word is now ${word}`
	)
	remainingWords[0] = word

	return textThatFits

}


