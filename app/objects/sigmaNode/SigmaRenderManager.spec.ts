import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {ISigmaRenderUpdate, ISigmaRenderManager, RenderUpdateTypes} from '../interfaces';
import {TYPES} from '../types';
import {SigmaRenderManager, SigmaRenderManagerArgs} from './SigmaRenderManager';
import {partialInject} from '../../testHelpers/partialInject';

myContainerLoadAllModules()
test('SigmaRenderManager::::DI constructor works', (t) => {
    const injects = injectionWorks<SigmaRenderManagerArgs, ISigmaRenderManager>({
        container: myContainer,
        argsType: TYPES.SigmaRenderManagerArgs,
        interfaceType: TYPES.ISigmaRenderManager,
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('SigmaRenderManager::::should broadcast an update listing the id as renderable after marking tree' +
    ' and treelocation data added[Regular Constructor]', (t) => {
    const treeDataLoadedIdsSet = {}
    const treeLocationDataLoadedIdsSet = {}
    const callback = sinon.spy()
    const sigmaRenderManager: ISigmaRenderManager =
        partialInject<SigmaRenderManagerArgs>({
            konstructor: SigmaRenderManager,
            constructorArgsType: TYPES.SigmaRenderManagerArgs,
            injections: {
                treeDataLoadedIdsSet,
                treeLocationDataLoadedIdsSet,
                updatesCallbacks: [callback],
            },
            container: myContainer
        })
    const treeId = '12354'
    const expectedCalledWith: ISigmaRenderUpdate = {
        sigmaNodeIdToRender: treeId,
        type: RenderUpdateTypes.NEW_NODE,
    }
    expect(callback.callCount).to.equal(0)
    sigmaRenderManager.markTreeDataLoaded(treeId)
    expect(callback.callCount).to.equal(0)
    sigmaRenderManager.markTreeLocationDataLoaded(treeId)
    expect(callback.callCount).to.equal(1)
    const calledWith = callback.getCall(0).args[0]
    expect(calledWith).to.deep.equal(expectedCalledWith)
    t.pass()
})
test('SigmaRenderManager::::should broadcast an update listing the id as renderable after marking tree' +
    ' and treelocation data added [DI constructor]', (t) => {
    const callback = sinon.spy()
    const sigmaRenderManager: ISigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
    const treeId = '12354'

    sigmaRenderManager.onUpdate(callback)
    const expectedCalledWith: ISigmaRenderUpdate = {
        sigmaNodeIdToRender: treeId,
        type: RenderUpdateTypes.NEW_NODE,
    }
    expect(callback.callCount).to.equal(0)
    sigmaRenderManager.markTreeDataLoaded(treeId)
    expect(callback.callCount).to.equal(0)
    sigmaRenderManager.markTreeLocationDataLoaded(treeId)
    expect(callback.callCount).to.equal(1)
    const calledWith = callback.getCall(0).args[0]
    expect(calledWith).to.deep.equal(expectedCalledWith)
    t.pass()
})
