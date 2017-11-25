import {ISubscribableMutableId} from '../id/ISubscribableMutableId';
import {ISubscribableMutableStringSet} from '../set/ISubscribableMutableStringSet';
import {FirebaseSyncerBasicTree} from './FirebaseSyncableBasicTree';
import {TYPES} from '../types';
import {myContainer} from '../../../inversify.config';

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
