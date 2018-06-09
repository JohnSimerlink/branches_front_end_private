import {IFlashcardTreeData} from './IFlashcardTreeData';
import {getASampleContentUser} from '../contentUser/contentUserTestHelpers';
import {getASampleContent} from '../content/contentTestHelpers';
import {getASampleTreeLocation1} from '../treeLocation/treeLocationTestHelpers';
import {getASampleTree, getASampleTreeGivenContentId} from '../tree/treeTestHelpers';
import {getSomewhatRandomId} from '../../testHelpers/randomValues';

export function getASampleFlashcardTreeData() {
	const contentIdVal = getSomewhatRandomId();
	const flashcardTreeData: IFlashcardTreeData = {
		contentUser: getASampleContentUser({contentId: contentIdVal}),
		content: getASampleContent(),
		tree: getASampleTreeGivenContentId(contentIdVal),
		treeLocation: getASampleTreeLocation1(),
		treeId: getSomewhatRandomId(),
	};
	return flashcardTreeData;
}
