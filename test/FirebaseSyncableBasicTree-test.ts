import {FirebaseSyncerBasicTree} from '../app/objects/tree/FirebaseSyncableBasicTree';
import {myContainer} from '../inversify.config';
import {ISubscribableMutableId} from '../app/objects/id/ISubscribableMutableId';
import {TYPES} from '../app/objects/types';
import {ISubscribableMutableStringSet} from '../app/objects/set/ISubscribableMutableStringSet';

describe('FirebaseSyncableBasicTree', () => {
    it('constructor should have firebase syncers subscribe to all the subscribable properties', () => {
        const contentId = myContainer.get<ISubscribableMutableId>(TYPES.ISubscribableMutableId)
        const parentId = myContainer.get<ISubscribableMutableId>(TYPES.ISubscribableMutableId)
        const children = myContainer.get<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet)
        const TREE_ID = 'efa123'
        const sometree = null
        const sometree2 = null
        // const firebaseSyncableBasicTree = new FirebaseSyncerBasicTree(TREE_ID)
    })
})
