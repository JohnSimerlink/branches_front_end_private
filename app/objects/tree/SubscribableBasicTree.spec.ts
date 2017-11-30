import * as assert from 'assert';
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {IdMutationTypes} from '../id/IdMutationTypes';
import {ISubscribableMutableId} from '../id/ISubscribableMutableId';
import {IDatedMutation} from '../mutations/IMutation';
import {ISubscribableMutableStringSet} from '../set/ISubscribableMutableStringSet';
import {TYPES} from '../types';
import {SubscribableBasicTree} from './SubscribableBasicTree';

describe('FirebaseSyncableBasicTree', () => {
    it('constructor should set all the subscribable properties', () => {
        const contentId = myContainer.get<ISubscribableMutableId>(TYPES.ISubscribableMutableId)
        const parentId = myContainer.get<ISubscribableMutableId>(TYPES.ISubscribableMutableId)
        const children = myContainer.get<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet)
        const TREE_ID = 'efa123'
        const tree = new SubscribableBasicTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
        expect(tree.contentId).to.deep.equal(contentId)
        expect(tree.parentId).to.deep.equal(parentId)
        expect(tree.children).to.deep.equal(children)
        expect(tree.getId()).to.deep.equal(TREE_ID)
    })
    it('a mutation in one of the subscribable properties' +
        ' should publish an update of the entire object\'s value', () => {
        const contentId = myContainer.get<ISubscribableMutableId>(TYPES.ISubscribableMutableId)
        const parentId = myContainer.get<ISubscribableMutableId>(TYPES.ISubscribableMutableId)
        const children = myContainer.get<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet)
        const TREE_ID = 'efa123'
        const tree = new SubscribableBasicTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
        tree.publishUponDescendantUpdates()

        const callback = sinon.spy()
        tree.onUpdate(callback)

        const sampleMutation = myContainer.get<IDatedMutation<IdMutationTypes>>(TYPES.IDatedMutation)
        contentId.addMutation(sampleMutation)
        const newTreeDataValue = tree.val()
        expect(callback.callCount).to.equal(1)
        assert(callback.calledWith(newTreeDataValue))

    })
})
