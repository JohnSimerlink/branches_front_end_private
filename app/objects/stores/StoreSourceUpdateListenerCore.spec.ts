import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {injectionWorks, TREE_ID} from '../../testHelpers/testHelpers';
import {
    ISigmaNodesUpdater, ISigmaRenderManager,
    IStoreSourceUpdateListenerCore, ITreeDataWithoutId, ITypeAndIdAndValUpdates,
    ObjectDataTypes
} from '../interfaces';
import {SigmaNodesUpdater} from '../sigmaNode/SigmaNodesUpdater';
import {SigmaRenderManager} from '../sigmaNode/SigmaRenderManager';
import {TYPES} from '../types';
import {StoreSourceUpdateListenerCore, StoreSourceUpdateListenerCoreArgs} from './StoreSourceUpdateListenerCore';
import test from 'ava'

test('StoreSourceUpdateListenerCore::::DI constructor should work', (t) => {
    const injects = injectionWorks<StoreSourceUpdateListenerCoreArgs, IStoreSourceUpdateListenerCore>({
        container: myContainer,
        argsType: TYPES.StoreSourceUpdateListenerCoreArgs,
        classType: TYPES.IStoreSourceUpdateListenerCore,
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('StoreSourceUpdateListenerCore::::should create a node for a nonexistent node and call sigmaNodesUpdate', (t) => {
    const newContentId = '4324234'
    const newParentId = '4344324234'
    const newChildren = ['45344324234', 'aabc321', 'abcd43132']
    const val: ITreeDataWithoutId = {
        children: newChildren,
        contentId: newContentId,
        parentId: newParentId,
    }
    const update: ITypeAndIdAndValUpdates = {
        id: TREE_ID,
        type: ObjectDataTypes.TREE_DATA,
        val,
    }
    const sigmaNodes = {}
    const sigmaRenderManager: ISigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
    const sigmaNodesUpdater: ISigmaNodesUpdater
        = new SigmaNodesUpdater({sigmaNodes, sigmaRenderManager, getSigmaIdsForContentId: () => void 0})
    const storeSourceUpdateListenerCore: IStoreSourceUpdateListenerCore
        = new StoreSourceUpdateListenerCore({sigmaNodes, sigmaNodesUpdater})
    const sigmaNodesUpdaterHandleUpdateSpy = sinon.spy(sigmaNodesUpdater, 'handleUpdate')

    storeSourceUpdateListenerCore.receiveUpdate(update)

    const containsNode = !!sigmaNodes[TREE_ID]
    expect(containsNode).to.equal(true)
    expect(sigmaNodesUpdaterHandleUpdateSpy.callCount).to.equal(1)
    const calledWith = sigmaNodesUpdaterHandleUpdateSpy.getCall(0).args[0]
    const expectedCalledWith = update
    expect(calledWith).to.deep.equal(expectedCalledWith)
    t.pass()
})
