import {Store} from 'vuex';
import {IFlashcardTreeFactory} from './IFlashcardTreeFactory';
import {CONTENT_TYPES, id, IHash, IState} from '../interfaces';
import {IFlashcardTree} from './IFlashcardTree';
import {FlashcardTree} from './FlashcardTree';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {IFlashcardTreeData} from './IFlashcardTreeData';
import {log} from '../../core/log';

export class FlashcardTreeFactory implements IFlashcardTreeFactory {
	private store: Store<any>;

	constructor({store}: { store: Store<any> }) {
		this.store = store;
	}

	/*
	Creates a tree (in the class computer science sense, not in the BranchesDB TreeData sense) with n nodes
	Running Time
			- Theta(n)
	If / when we add caching, we could have Omega(1)

	ASSUMES all the correct data is already in the store
	 */
	public createFlashcardTree({treeId, userId}: { treeId: id, userId: id }): IFlashcardTree {
		const state: IState = this.store.state;

		const treeData = state.globalDataStoreData.trees[treeId];
		if (!treeData) {
			/* if treeData is not found for that treeId, that means it hasn't been loaded yet.
			We therefore should not add that tree to our flashcardTree
			TODO: load the treeData if it has not yet been downloaded
			 */
			return;
		}
		const contentId = treeData.contentId;
		const contentData = state.globalDataStoreData.content[contentId];
		log('createFlashcardTree called with ', treeId, treeData);

		const children: IHash<IFlashcardTree> = {};
		for (const childId of treeData.children) {
			const childFlashcardTree = this.createFlashcardTree({treeId: childId, userId});
			if (!childFlashcardTree) {
				// only add the childTree to the set if it is not null - e.g. it may have not been loaded yet.
				continue;
			}
			children[childId] = childFlashcardTree;
		}
		const data = this.getFlashcardTreeData({treeId, contentId, userId});
		const flashcardTree = new FlashcardTree({children, data});
		return flashcardTree;
	}

	private getFlashcardTreeData({treeId, contentId, userId}:
		                             { treeId: id, contentId: id, userId: id }): IFlashcardTreeData {
		const contentUserId = getContentUserId({contentId, userId});
		const state: IState = this.store.state;

		const contentUser = state.globalDataStoreObjects.contentUsers[contentUserId];
		const content = state.globalDataStoreObjects.content[contentId];
		const tree = state.globalDataStoreObjects.trees[treeId];
		const treeLocation = state.globalDataStoreObjects.treeLocations[treeId];
		const data: IFlashcardTreeData = {
			content,
			contentUser,
			tree,
			treeLocation,
			treeId,
		}
		return data;
	}
}
