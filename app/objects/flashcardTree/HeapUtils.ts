import Heap = require('heap');
import {IFlashcardTreeData} from './IFlashcardTreeData';
import {FlashcardTreeUtils} from './FlashcardTreeUtils';
import moment = require('moment');

export function printStateOfFlashcardTreeHeap(heap: Heap<IFlashcardTreeData>) {
	for (const entry of heap['nodes']) {
		console.log('the node entry in the heap is', entry.treeId, moment(FlashcardTreeUtils.getNextTimeToStudy(entry)).fromNow());
	}
}
