/* tslint:disable variable-name */
import {IFlashcardTreeData} from './IFlashcardTreeData';
import {id, IHash, IState} from '../interfaces';
import {IFlashcardTreeArgs} from './IFlashcardTreeArgs'
import {IFlashcardTree} from './IFlashcardTree'

/**
 * Tree used for reviewing flashcards.
 */
export class FlashcardTree implements IFlashcardTree {
    public data: IFlashcardTreeData;
    private _children: IHash<IFlashcardTree>
    constructor({
        data,
        children,
    }: IFlashcardTreeArgs ) {
        this.data = data
        this._children = children

    }
    public children(): IHash<IFlashcardTree> {
        return this._children
    }
    private hasChildren(): boolean {
        return !!Object.keys(this.children()).length
    }
    /*
        An iterator that iterates through the data, not the other trees
     */
    public *[Symbol.iterator]() {
        if (!this.hasChildren()) {
            yield this.data
        }

    }
}
