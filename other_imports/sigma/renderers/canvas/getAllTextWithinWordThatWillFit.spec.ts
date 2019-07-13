import test
	from 'ava';
import {expect} from 'chai';
import {
	getAllTextWithinWordThatWillFit,
	getNextLineToDraw,
	getNextLineToDrawFromString
} from './getNextLineToDraw';

/**
 *
 * getAllTextWithinWordThatWillFit(word: string, remainingWords: string[], remainingWidth: number, widthPerLetter: number): string
 *
 *
 */
test(`mcvoteface with enough space for two letters should return mc and voteface`, (t) => {
	const TEN_LETTER_WORD = 'mcvoteface'
	const remainingWords = [TEN_LETTER_WORD, 'mccoatmace']
	const widthPerLetter = 10;
	const remainingWidth = 22

	const expectedText = 'mc'
	const expectedRemainingWords = ['voteface', 'mccoatmace']

	const text = getAllTextWithinWordThatWillFit(remainingWords[0], remainingWords, remainingWidth, widthPerLetter)
	expect(text).to.deep.equal(expectedText)
	expect(remainingWords).to.deep.equal(expectedRemainingWords)
	t.pass()
})
