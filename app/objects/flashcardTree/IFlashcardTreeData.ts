import {
	id,
	ISyncableMutableSubscribableContent, ISyncableMutableSubscribableContentUser,
	ISyncableMutableSubscribableTree, ISyncableMutableSubscribableTreeLocation
} from '../interfaces';

/**
 * Data associated with each node in a flashcard tree.
 */
export interface IFlashcardTreeData {
	contentUser: ISyncableMutableSubscribableContentUser;
	content: ISyncableMutableSubscribableContent;
	tree: ISyncableMutableSubscribableTree;
	treeLocation: ISyncableMutableSubscribableTreeLocation;
	treeId: id;
}
