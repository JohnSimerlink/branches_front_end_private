import {Store} from 'vuex'
import {IFlashcardTreeFactory} from './IFlashcardTreeFactory'
import {id, IHash, IState} from '../interfaces'
import {IFlashcardTree} from './IFlashcardTree'
import {FlashcardTree} from './FlashcardTree'
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils'
import {IFlashcardTreeData} from './IFlashcardTreeData'

export class FlashcardTreeFactory implements IFlashcardTreeFactory {
    private store: Store<any>
    constructor({store}: {store: Store<any>}) {
        this.store = store
    }
    /*
    Creates a tree (in the class computer science sense, not in the BranchesDB TreeData sense) with n nodes
    Running Time
        - Theta(n)
    If / when we add caching, we could have Omega(1)
     */
    public createFlashcardTree({treeId, userId}: {treeId: id, userId: id}): IFlashcardTree {
        const state: IState = this.store.state
        const treeData = state.globalDataStoreData.trees[treeId]
        const contentId = treeData.contentId

        const children: IHash<IFlashcardTree> = {}
        for (const childId of treeData.children){
            const childFlashcardTree = this.createFlashcardTree({treeId: childId, userId})
            children[childId] = childFlashcardTree
        }
        const data = this.getFlashcardTreeData({treeId, contentId,  userId})
        const flashcardTree = new FlashcardTree({children, data })
        return flashcardTree
    }

    private getFlashcardTreeData({ treeId, contentId, userId}:
                                     {treeId: id, contentId: id, userId: id}): IFlashcardTreeData {
        const contentUserId = getContentUserId({contentId, userId})
        const state: IState = this.store.state

        const contentUser = state.globalDataStoreObjects.contentUsers[contentUserId]
        const content = state.globalDataStoreObjects.content[contentUserId]
        const tree = state.globalDataStoreObjects.trees[treeId]
        const treeLocation = state.globalDataStoreObjects.treeLocations[treeId]
        const data: IFlashcardTreeData = {
            content,
            contentUser,
            tree,
            treeLocation,
        }
        return data
    }
}
