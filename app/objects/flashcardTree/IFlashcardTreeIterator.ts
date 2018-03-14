/* tslint:disable no-empty-supertype */
import {IFlashcardTree} from './IFlashcardTree'
import {IFactory} from '../interfaces'

export interface IFlashcardTreeIterator extends IFactory {

}
export interface IFlashcardTreeIteratorArgs {
    flashcardTree: IFlashcardTree
}
