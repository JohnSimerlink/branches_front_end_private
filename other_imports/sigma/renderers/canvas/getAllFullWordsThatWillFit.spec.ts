import test
	from 'ava';
import {expect} from 'chai';
import {
	getAllFullWordsThatWillFit,
	getNextLineToDraw,
	getNextLineToDrawFromString
} from './getNextLineToDraw';

test(`a 10 letter word as part of 3 words with maxWidth of 10 letters should return that 10 letter word`, (t) => {
	const TEN_LETTER_WORD = 'mcboatface'
	const WORD2 = 'hiscoatrace'
	const WORD3 = 'yourgoatplace'
	const remainingWords = [TEN_LETTER_WORD, WORD2, WORD3]
	const widthPerLetter = 10;
	const maxWidth = widthPerLetter * (
		(TEN_LETTER_WORD + ' ').length
		+ (WORD2 + ' ').length
	) // * remainingWords.reduce((sum, w) => sum + w.length, 0) //remainingWords.length
	const expectedWordsThatFit: string = [TEN_LETTER_WORD, WORD2 ].join(' ')
	const expectedRemainingWords = [WORD3]

	// const {widthUsed, wordsThatFit} = getAllFullWordsThatWillFit(remainingWords, maxWidth, widthPerLetter) //: {widthUsed: number, wordsThatFit: string}

	const {widthUsed, wordsThatFit, remainingWords: newRemainingWords} = getAllFullWordsThatWillFit(remainingWords, maxWidth, widthPerLetter) //: {widthUsed: number, wordsThatFit: string}













	// const expectedNextLine = remainingWords
	// const nextLine = getNextLineToDraw(remainingWords, widthPerLetter, maxWidth)
	expect(wordsThatFit).to.deep.equal(expectedWordsThatFit, "next lines don't match")
	expect(newRemainingWords).to.deep.equal(expectedRemainingWords, 'remaining wordsThatFit dont match')
	t.pass();
});

test(`a 10 letter word when maxWidth is 9 should return no words`, (t) => {
	const TEN_LETTER_WORD = 'mcboatface'
	let remainingWords = [TEN_LETTER_WORD]
	const widthPerLetter = 10;
	const maxWidth = widthPerLetter * (TEN_LETTER_WORD.length - 1)
	const expectedWordsThatFit: string = ''
	const expectedRemainingWords = remainingWords

	const {widthUsed, wordsThatFit, remainingWords: newRemainingWords} = getAllFullWordsThatWillFit(remainingWords, maxWidth, widthPerLetter) //: {widthUsed: number, wordsThatFit: string}


	// const expectedNextLine = remainingWords
	// const nextLine = getNextLineToDraw(remainingWords, widthPerLetter, maxWidth)
	expect(wordsThatFit).to.deep.equal(expectedWordsThatFit, "expectedWordsThatFit don't match")
	expect(newRemainingWords).to.deep.equal(expectedRemainingWords, 'remaining wordsThatFit dont match')
	t.pass();
});
