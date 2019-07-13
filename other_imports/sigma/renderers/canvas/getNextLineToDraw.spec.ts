import test
	from 'ava';
import {expect} from 'chai';
import {
	getNextLineToDraw,
	getNextLineToDrawFromString
} from './getNextLineToDraw';

test(`a 10 letter word with maxWidth of 10 letters should return that 10 letter word`, (t) => {
	const TEN_LETTER_WORD = 'mcboatface'
	const remainingWords = [TEN_LETTER_WORD]
	const widthPerLetter = 10;
	const maxWidth = widthPerLetter * TEN_LETTER_WORD.length

	const expectedNextLine: string = TEN_LETTER_WORD
	const expectedRemainingWords = []
	const {line: nextLine, remainingWords: newRemainingWords} = getNextLineToDraw(remainingWords, widthPerLetter, maxWidth)
	expect(nextLine).to.deep.equal(expectedNextLine, "nextLine doesn't match")
	expect(newRemainingWords).to.deep.equal(expectedRemainingWords, "remainingWords doesn't match")
	t.pass();
});

test(`a 10 letter word with maxWidth of slightly less than 10 letters should return the first 9 letters`, (t) => {
	const TEN_LETTER_WORD = 'mcboatface'
	const remainingWords = [TEN_LETTER_WORD]
	const widthPerLetter = 10;
	const maxWidth = widthPerLetter * TEN_LETTER_WORD.length - 1

	const expectedNextLine = 'mcboatfac' // TEN_LETTER_WORD.substring(0, remainingWords.length - 1)
	const expectedRemainingWords = ['e']
	const {line: nextLine, remainingWords: newRemainingWords} = getNextLineToDraw(remainingWords, widthPerLetter, maxWidth)
	expect(nextLine).to.deep.equal(expectedNextLine)
	expect(newRemainingWords).to.deep.equal(expectedRemainingWords)
	// expect(1).to.equal(1);
	t.pass();
});
test(`an 18 letter phrase (with first word being 10 letters) with maxWidth of 10 letters should return the first 10 letters`, (t) => {
	const TEN_LETTER_WORD = 'mcboatface'
	const EIGHT_LETTER_WORD = 'duckduck'
	const remainingWords = [TEN_LETTER_WORD, EIGHT_LETTER_WORD]
	const numLettersInRemainingWords = remainingWords.reduce((agg, word) => agg + word)
	const widthPerLetter = 10;
	const maxWidth = widthPerLetter * TEN_LETTER_WORD.length

	const expectedNextLine = TEN_LETTER_WORD // TEN_LETTER_WORD.substring(0, remainingWords.length - 1)
	const expectedRemainingWords = [EIGHT_LETTER_WORD]
	const {line: nextLine, remainingWords: newRemainingWords} = getNextLineToDraw(remainingWords, widthPerLetter, maxWidth)
	expect(nextLine).to.deep.equal(expectedNextLine, "next line mismatch")
	expect(newRemainingWords).to.deep.equal(expectedRemainingWords, "remaining words mismatch")
	// expect(1).to.equal(1);
	t.pass();
});
//
// // cases with spaces between the wordsThatFit
