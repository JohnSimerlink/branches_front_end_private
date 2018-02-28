import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {injectionWorks, TREE_ID} from '../../testHelpers/testHelpers';
import {
    IOneToManyMap,
    ISigmaNodesUpdater, ISigmaRenderManager,
    IStoreSourceUpdateListenerCore, ITreeDataWithoutId, ITypeAndIdAndValUpdates,
    GlobalStoreObjectDataTypes
} from '../interfaces';
import {SigmaNodesUpdater, SigmaNodesUpdaterArgs} from '../sigmaNode/SigmaNodesUpdater';
import {SigmaRenderManager} from '../sigmaNode/SigmaRenderManager';
import {TYPES} from '../types';
import {StoreSourceUpdateListenerCore, StoreSourceUpdateListenerCoreArgs} from './StoreSourceUpdateListenerCore';
import test from 'ava'
import {partialInject} from '../../testHelpers/partialInject';
import BranchesStore, {MUTATION_NAMES} from '../../core/store';
import {Store} from 'vuex';

myContainerLoadAllModules()
test('StoreSourceUpdateListenerCore::::DI constructor should work', (t) => {
    const injects = injectionWorks<StoreSourceUpdateListenerCoreArgs, IStoreSourceUpdateListenerCore>({
        container: myContainer,
        argsType: TYPES.StoreSourceUpdateListenerCoreArgs,
        interfaceType: TYPES.IStoreSourceUpdateListenerCore,
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
        type: GlobalStoreObjectDataTypes.TREE_DATA,
        val,
    }
    const sigmaNodes = {}
    // const sigmaRenderManager: ISigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
    const sigmaNodesUpdater: ISigmaNodesUpdater
        = partialInject<SigmaNodesUpdaterArgs>({
        constructorArgsType: TYPES.SigmaNodesUpdaterArgs,
        konstructor: SigmaNodesUpdater,
        container: myContainer,
        injections: {sigmaNodes}
    })
    // = new SigmaNodesUpdater({sigmaNodes, sigmaRenderManager, getSigmaIdsForContentId: () => void 0})
    const contentIdSigmaIdMap: IOneToManyMap<string> = myContainer.get<IOneToManyMap<string>>(TYPES.IOneToManyMap)
    const storeSourceUpdateListenerCore: IStoreSourceUpdateListenerCore
        = partialInject<StoreSourceUpdateListenerCoreArgs>({
        constructorArgsType: TYPES.SigmaNodesUpdaterArgs,
        konstructor: StoreSourceUpdateListenerCore,
        container: myContainer,
        injections: {sigmaNodesUpdater, contentIdSigmaIdMap}
    })

    const sigmaNodesUpdaterHandleUpdateSpy = sinon.spy(sigmaNodesUpdater, 'handleUpdate')
    const store: Store<any> = myContainer.get<BranchesStore>(TYPES.BranchesStore) as Store<any>
    store.commit(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE_IF_NOT_INITIALIZED)

    storeSourceUpdateListenerCore.receiveUpdate(update)

    const containsNode = !!sigmaNodes[TREE_ID]
    expect(containsNode).to.equal(true)
    expect(sigmaNodesUpdaterHandleUpdateSpy.callCount).to.equal(1)
    const calledWith = sigmaNodesUpdaterHandleUpdateSpy.getCall(0).args[0]
    const expectedCalledWith = update
    expect(calledWith).to.deep.equal(expectedCalledWith)
    t.pass()
})
