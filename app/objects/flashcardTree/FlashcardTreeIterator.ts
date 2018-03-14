import {IFlashcardTreeIteratorArgs} from './IFlashcardTreeIteratorArgs'
import {IFlashcardTree} from './IFlashcardTree'
import {IFactory} from '../interfaces'

export class FlashcardTreeIterator implements IFactory {
    private flashcardTree: IFlashcardTree
    constructor({flashcardTree}: IFlashcardTreeIteratorArgs) {
        this.flashcardTree = flashcardTree
    }
    create() {

    }

}
