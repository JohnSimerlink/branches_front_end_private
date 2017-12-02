import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {log} from '../../core/log'
import {IdMutationTypes} from '../id/IdMutationTypes';
import {SubscribableMutableId} from '../id/SubscribableMutableId';
import {IDatedMutation} from '../mutations/IMutation';
import {SubscribableMutableStringSet} from '../set/SubscribableMutableStringSet';
import {SubscribableBasicTree} from '../tree/SubscribableBasicTree';
import {TreePropertyNames} from '../tree/TreePropertyNames';
import {TYPES} from '../types';
import {ObjectDataTypes} from './ObjectTypes';
import {SubscribableGlobalDataStore} from './SubscribableGlobalDataStore';
import {ISubscribableTreeDataStore} from './SubscribableTreeDataStore';

describe('ISubscribableGlobalDataStore', () => {
    it(' calling startBroadcasting on GlobalStore, should call onUpdate on each of the component Stores', () => {
        const contentId = new SubscribableMutableId()
        const parentId = new SubscribableMutableId()
        const children = new SubscribableMutableStringSet()
        const TREE_ID = 'efa123'
        const tree = new SubscribableBasicTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
        // const tree = myContainer.get<ISubscribableBasicTree>(TYPES.ISubscribableBasicTree)
        // <<< TODO: using this dependency injection causes this entire test to fail. WHY?
        tree.publishUponDescendantUpdates()
        const treeStore = myContainer.get<ISubscribableTreeDataStore>(TYPES.ISubscribableTreeDataStore)
        const globalStore = new SubscribableGlobalDataStore(
            {
                subscribableTreeDataStore: treeStore,
                updatesCallbacks: [],
            }
        )
        const treeStoreOnUpdateSpy = sinon.spy(treeStore, 'onUpdate')

        expect(treeStoreOnUpdateSpy.callCount).to.equal(0)
        globalStore.startBroadcasting()
        expect(treeStoreOnUpdateSpy.callCount).to.equal(1)
    })

    it('After calling startBroadcasting, globalStore should publish updates'
        + ' when one of its component stores publishes an update', () => {
        const contentId = new SubscribableMutableId()
        const parentId = new SubscribableMutableId()
        const children = new SubscribableMutableStringSet()
        const TREE_ID = 'efa123'
        const tree = new SubscribableBasicTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
        // const tree = myContainer.get<ISubscribableBasicTree>(TYPES.ISubscribableBasicTree)
        // <<< TODO: using this dependency injection causes this entire test to fail. WHY?
        tree.publishUponDescendantUpdates()
        const treeStore = myContainer.get<ISubscribableTreeDataStore>(TYPES.ISubscribableTreeDataStore)
        const globalStore = new SubscribableGlobalDataStore(
            {
                subscribableTreeDataStore: treeStore,
                updatesCallbacks: [],
            }
        )
        const callback1 = sinon.spy()
        const callback2 = sinon.spy()

        globalStore.onUpdate(callback2)
        globalStore.onUpdate(callback1)
        treeStore.addAndSubscribeToItem({id: TREE_ID, item: tree})
        const sampleMutation = myContainer.get<IDatedMutation<IdMutationTypes>>(TYPES.IDatedMutation)
        globalStore.startBroadcasting()
        tree.addDescendantMutation(TreePropertyNames.parentId, sampleMutation)

        const treeNewVal = tree.val()
        expect(callback1.callCount).to.equal(1)
        expect(callback1.getCall(0).args[0].id).to.equal(TREE_ID)
        expect(callback1.getCall(0).args[0].val).to.deep.equal(treeNewVal)
        expect(callback1.getCall(0).args[0].type).to.deep.equal(ObjectDataTypes.TREE_DATA)
        expect(callback2.callCount).to.equal(1)
        expect(callback2.getCall(0).args[0].id).to.equal(TREE_ID)
        expect(callback2.getCall(0).args[0].val).to.deep.equal(treeNewVal)
        expect(callback2.getCall(0).args[0].type).to.deep.equal(ObjectDataTypes.TREE_DATA)

    })
    //
    it('Before calling startBroadcasting, globalStore should NOT publish updates ' +
        ' when one of its component stores publishes an update', () => {

    const contentId = new SubscribableMutableId()
    const parentId = new SubscribableMutableId()
    const children = new SubscribableMutableStringSet()
    const TREE_ID = 'efa123'
    const tree = new SubscribableBasicTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
    // const tree = myContainer.get<ISubscribableBasicTree>(TYPES.ISubscribableBasicTree)
    // <<< TODO: using this dependency injection causes this entire test to fail. WHY?
    tree.publishUponDescendantUpdates()
    const treeStore = myContainer.get<ISubscribableTreeDataStore>(TYPES.ISubscribableTreeDataStore)
    const globalStore = new SubscribableGlobalDataStore(
        {
            subscribableTreeDataStore: treeStore,
            updatesCallbacks: [],
        }
    )
    // log('subscribableGlobalDataStore spec called. global store just created', globalStore)
    const callback1 = sinon.spy()
    const callback2 = sinon.spy()

    // log('subscribableGlobalDataStore spec called. about to call onUpdate ', globalStore['onUpdate'])
    globalStore.onUpdate(callback2)
    globalStore.onUpdate(callback1)
    treeStore.addAndSubscribeToItem({id: TREE_ID, item: tree})
    const sampleMutation = myContainer.get<IDatedMutation<IdMutationTypes>>(TYPES.IDatedMutation)
    // globalStore.startBroadcasting()
    tree.addDescendantMutation(TreePropertyNames.parentId, sampleMutation)

    const treeNewVal = tree.val()
    expect(callback1.callCount).to.equal(0)
    expect(callback2.callCount).to.equal(0)
    })

})
