import {FirebaseSyncerBasicTree} from '../app/objects/tree/FirebaseSyncableBasicTree';
import {myContainer} from '../inversify.config';
import {ISubscribableMutableId} from '../app/objects/id/ISubscribableMutableId';
import {TYPES} from '../app/objects/types';

describe('FirebaseSyncableBasicTree', () => {
    it('constructor should have firebase syncers subscribe to all the subscribable properties', () => {
        const contentId = myContainer.get<ISubscribableMutableId>(TYPES.ISubscribableMutableId)
        const TREE_ID = 'efa123'
        // const firebaseSyncableBasicTree = new FirebaseSyncerBasicTree(TREE_ID)
    })
})
