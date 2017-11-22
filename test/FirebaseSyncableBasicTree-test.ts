import {FirebaseSyncableBasicTree} from '../app/objects/tree/FirebaseSyncableBasicTree';

describe('FirebaseSyncableBasicTree', () => {
    it('constructor should have firebase syncers subscribe to all the subscribable properties', () => {
        const TREE_ID = 'efa123'
        const firebaseSyncableBasicTree = new FirebaseSyncableBasicTree(TREE_ID)
    })
})
