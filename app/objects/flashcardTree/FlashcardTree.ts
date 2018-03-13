
import {IFlashcardTreeData} from './IFlashcardTreeData';
import {IHash, IState} from "../interfaces";
import {Store} from "vuex";

/**
 * Tree used for reviewing flashcards.
 */
export class FlashcardTree {

    public data: IFlashcardTreeData;
    public children() : IHash<FlashcardTree> {

    }
}
export class FlashcardTreeFactory {
    private store: Store<any>
    public createFlashCardTree(treeId) {
        const state: IState = store.state
        const tree:  = state.globalDataStoreData.trees[treeId]
        const contentId = tree.
    }
}