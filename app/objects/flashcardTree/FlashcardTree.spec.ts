import test from 'ava';
import {expect} from 'chai'
import {getASampleFlashcardTreeData} from './FlashcardTreeTestHelpers';
import {FlashcardTree} from './FlashcardTree';
import {IFlashcardTree} from './IFlashcardTree';
import {getSomewhatRandomId} from '../../testHelpers/randomValues';
import {IFlashcardTreeData} from './IFlashcardTreeData';
import md5 from '../../core/md5wrapper';
import {IHash} from '../interfaces';

const stringify = require('json-stable-stringify') || require('json-stable-stringify').default;
test('When the tree has no children, FlashcardTree iterator should iterate just once and return the root data node', t => {
	const flashcardTreeData = getASampleFlashcardTreeData();
	const flashcardTree: IFlashcardTree = new FlashcardTree({
		data: flashcardTreeData,
		children: {}
	});
	const expectedIterable = [flashcardTreeData];
	/**
	 * Note we'd prefer the expectedIterable to be defined as follows:
	 *  actualIterable = [...flashcardTree]
	 *  However, it turns out that because we have `target` of ES5 set in our tsconfig.json, that we can't use Array-like features on our iterable.
	 *  Examples of Array-like features are
	 *      1) For-of loops
	 *          <pre>
	 *          for (let item in arrayLikeObject) {// do ...stuff}}
	 *          </pre>
	 *      2) Destructuring-syntax
	 *          <pre>
	 *              ...arrayLikeObject
	 *          </pre>
	 *      3) Destructuring-syntax with the destructured results being placed in a new array
	 *          <pre>
	 *              [...arrayLikeObject]
	 *          </pre>
	 *  . . . where arrayLikeObject is an iterable object defined as follows:
	 *      <pre>
	 const arrayLikeObject = {
                    [Symbol.iterator]: function*() {
                        yield 1
                        yield 2
                        yield 3
                    }
                }
	 </pre>
	 *       . . . per ES6 Iterables and Generators Syntax: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
	 *
	 * When target is ES5, we get the following TS compiler error:
	 *  <pre>
	 *      TS2495: Type '{ [Symbol.iterator]: () => IterableIterator<1 | 2 | 3>;}' is not an array type or string type
	 *  </pre>
	 *  If we were targeting ES6, the transpiled code would support using Array-like features,
	 *  Since we are targeting ES5, in our unit tests we can avoid the TS error by casting the iterable object we created into an array.
	 *  <pre>
	 *      const arr = Array.from(arrayLikeObject)
	 *      for (var x in arr) { // stuff } // << no TS2495 error
	 *  </pre>
	 *  <pre>
	 *  TS2495 ERROR: [...flashcardTree]
	 *  NO TS2495 ERROR: [...Array.from(flashcardTree)]
	 *  </pre>
	 */
	const actualIterable = [...Array.from(flashcardTree)]
	expect(actualIterable).to.deep.equal(expectedIterable)
	// const iterable = flashcardTree()

	t.pass()
})

test('When the tree has 3 children only no children,' +
	' FlashcardTree iterator should iterate just once and return the root data node', t => {
	const flashcardTreeData = getASampleFlashcardTreeData();
	const child1Id = getSomewhatRandomId();
	const child2Id = getSomewhatRandomId();
	const grandchild1Id = getSomewhatRandomId();
	const child1FlashcardTreeData = getASampleFlashcardTreeData();
	const child2FlashcardTreeData = getASampleFlashcardTreeData();
	const grandchild1FlashcardTreeData = getASampleFlashcardTreeData();

	const flashcardTreeGrandChild1: IFlashcardTree = new FlashcardTree({
		data: grandchild1FlashcardTreeData,
		children: {}
	});
	const flashcardTreeChild1: IFlashcardTree = new FlashcardTree({
		data: child1FlashcardTreeData,
		children: {
			[grandchild1Id]: flashcardTreeGrandChild1
		}
	});
	const flashcardTreeChild2: IFlashcardTree = new FlashcardTree({
		data: child2FlashcardTreeData,
		children: {}
	});
	const flashcardTree: IFlashcardTree = new FlashcardTree({
		data: flashcardTreeData,
		children: {
			[child1Id]: flashcardTreeChild1,
			[child2Id]: flashcardTreeChild2,
		}
	});
	const expectedIteratedItems =
		[flashcardTreeData, child1FlashcardTreeData, child2FlashcardTreeData, grandchild1FlashcardTreeData];
	// const actualIteratedItems: IFlashcardTreeData[] =
	// PostOrderTree(flashcardTree, (childKey) =>  )
	const actualIteratedItems: IFlashcardTreeData[] = [
		... (Array.from(flashcardTree)) as IFlashcardTreeData[]];
	/*
	* We need the above as IFlashcardTreeData[] because for some reason
	 * Array.from is returning a type of {}[] - an array of empty object - as opposed to IFlashcardTreeData[]
	 */

	/* Check that the two arrays contain the same elements
			Do this by creating a set for each array, where each set contains the hash of each element of the array
			Then check that the two sets are equal
			Also use stringify from json-stable-stringify pacakage, because regular JSON stringify doesn't
			 guarantee the same string object to be formed for two actually identical objects
	 */
	const actualHashes: IHash<boolean> = {};
	const expectedHashes: IHash<boolean> = {};
	for (const iterated of actualIteratedItems) {
		const hash = md5(stringify(iterated));
		actualHashes[hash] = true;
	}
	for (const expected of expectedIteratedItems) {
		const hash = md5(stringify(expected));
		expectedHashes[hash] = true;
	}
	expect(actualHashes).to.deep.equal(expectedHashes);

	t.pass();
})
