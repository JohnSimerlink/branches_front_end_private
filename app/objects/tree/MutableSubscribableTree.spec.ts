import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {TREE_ID3} from '../../testHelpers/testHelpers';
import {SubscribableMutableId} from '../id/SubscribableMutableId';
import {IDatedMutation, IdMutationTypes, IProppedDatedMutation, TreePropertyNames} from '../interfaces';
import {SubscribableMutableStringSet} from '../set/SubscribableMutableStringSet';
import {TYPES} from '../types';
import {MutableSubscribableTree} from './MutableSubscribableTree';
import {SubscribableTree} from './SubscribableTree';

describe('SubscribableTree', () => {
    it('a mutation in one of the subscribable properties' +
        ' should publish an update of the entire object\'s value '
        + ' after startBroadcasting has been called', () => {
        const contentId = new SubscribableMutableId()
        /* = myContainer.get<ISubscribableMutableId>(TYPES.ISubscribableMutableId)
         // TODO: figure out why DI puts in a bad updatesCallback!
        */
        const parentId = new SubscribableMutableId()
        const children = new SubscribableMutableStringSet()
        const TREE_ID = 'efa123'
        const tree = new MutableSubscribableTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
        tree.startPublishing()

        const callback = sinon.spy()
        tree.onUpdate(callback)

        const sampleMutation = myContainer.get<IDatedMutation<IdMutationTypes>>(TYPES.IProppedDatedMutation)
        contentId.addMutation(sampleMutation)
        const newTreeDataValue = tree.val()
        const calledWith = callback.getCall(0).args[0]
        expect(callback.callCount).to.equal(1)
        expect(calledWith).to.deep.equal(newTreeDataValue)
    })
    it('a mutation in one of the subscribable properties' +
        ' should NOT publish an update of the entire object\'s value'
        + ' before startBroadcasting has been called', () => {
        const contentId = new SubscribableMutableId()
        /* = myContainer.get<ISubscribableMutableId>(TYPES.ISubscribableMutableId)
         // TODO: figure out why DI puts in a bad updatesCallback!
        */
        const parentId = new SubscribableMutableId()
        const children = new SubscribableMutableStringSet()
        const TREE_ID = 'efa123'
        const tree = new SubscribableTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})

        const callback = sinon.spy()
        tree.onUpdate(callback)

        const sampleMutation = myContainer.get<IDatedMutation<IdMutationTypes>>(TYPES.IProppedDatedMutation)
        contentId.addMutation(sampleMutation)
        const newTreeDataValue = tree.val()
        expect(callback.callCount).to.equal(0)
    })
    it('addMutation ' +
        ' should call addMutation on the appropriate descendant property', () => {
        const contentId = new SubscribableMutableId()
        const parentId = new SubscribableMutableId()
        const children = new SubscribableMutableStringSet()
        const TREE_ID = TREE_ID3
        const tree = new MutableSubscribableTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
        const parentIdAddMutationSpy = sinon.spy(parentId, 'addMutation')

        // tslint:disable variable-name
        const sampleSetParentMutationTREE_ID3 =
            myContainer.get<
                IProppedDatedMutation<
                    IdMutationTypes,
                    TreePropertyNames
                    >
                >
            (TYPES.IProppedDatedMutation)
        tree.addMutation(sampleSetParentMutationTREE_ID3)
        expect(parentIdAddMutationSpy.callCount).to.equal(1)
    })
})
