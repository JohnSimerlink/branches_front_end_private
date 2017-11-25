import {expect} from 'chai'
import {myContainer} from '../../../inversify.config';
import {ISubscribableMutableId} from '../id/ISubscribableMutableId';
import {ISubscribableMutableStringSet} from '../set/ISubscribableMutableStringSet';
import {TYPES} from '../types';
import {DBSubscriberToBasicTree} from './DBSubscriberToBasicTree';
import {SubscribableBasicTree} from './SubscribableBasicTree';

describe('FirebaseSyncableBasicTree', () => {
    it('constructor should set all the subscribable properties', () => {
        const contentId = myContainer.get<ISubscribableMutableId>(TYPES.ISubscribableMutableId)
        const parentId = myContainer.get<ISubscribableMutableId>(TYPES.ISubscribableMutableId)
        const children = myContainer.get<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet)
        const TREE_ID = 'efa123'
        const tree = new SubscribableBasicTree({id: TREE_ID, contentId, parentId, children})
        expect(tree.contentId).to.deep.equal(contentId)
        expect(tree.parentId).to.deep.equal(parentId)
        expect(tree.children).to.deep.equal(children)
        expect(tree.getId()).to.deep.equal(TREE_ID)
    })
})
