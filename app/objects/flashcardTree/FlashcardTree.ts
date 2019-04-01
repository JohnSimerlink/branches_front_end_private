/* tslint:disable variable-name */
import {IFlashcardTreeData} from './IFlashcardTreeData';
import {IHash} from '../interfaces';
import {IFlashcardTreeArgs} from './IFlashcardTreeArgs';
import {IFlashcardTree} from './IFlashcardTree';
import {FlashcardTreeUtils} from './FlashcardTreeUtils';

/**
 * Tree used for reviewing flashcards.
 */
export class FlashcardTree implements IFlashcardTree {
	public data: IFlashcardTreeData;
	public children: IHash<IFlashcardTree>;

	constructor({
								data,
								children,
							}: IFlashcardTreeArgs) {
		this.data = data;
		this.children = children;
	}

	/*
			An iterator that iterates through the data, not the other trees
	 */
	public* [Symbol.iterator](): IterableIterator<IFlashcardTreeData> {
		if (FlashcardTreeUtils.isValid(this.data)) {
			yield this.data;
		}
		for (const key of Object.keys(this.children)) {
			const child = this.children[key];
			yield* (Array.from(child) as IFlashcardTreeData[]);
			/* ^^ for more on why we need Array.from above,
			 see long comment starting on line 15 of FlashcardTree.spec.ts
			*/
		}

	}
}
