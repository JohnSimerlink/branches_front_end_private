import {IFlashcardTree} from './IFlashcardTree'
import {id} from '../interfaces'

export interface IFlashcardTreeFactory {
    createFlashcardTree({treeId, userId}: {treeId: id, userId: id}): IFlashcardTree
}
