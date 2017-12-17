import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {ISigmaIdToRender, ISigmaRenderManager} from '../interfaces';
import {TYPES} from '../types';
import {SigmaRenderManager, SigmaRenderManagerArgs} from './SigmaRenderManager';

test('SigmaRenderManager::::DI constructor works', (t) => {

    const injects = injectionWorks<SigmaRenderManagerArgs, ISigmaRenderManager>({
        container: myContainer,
        argsType: TYPES.SigmaRenderManagerArgs,
        classType: TYPES.ISigmaRenderManager,
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('SigmaRenderManager::::should broadcast an update listing the id as renderable after marking tree' +
    ' and treelocation data added[Regular Constructor]', (t) => {
    const treeDataLoadedIdsSet = {}
    const treeLocationDataLoadedIdsSet = {}
    const callback = sinon.spy()
    const sigmaRenderManager: ISigmaRenderManager = new SigmaRenderManager(
        {
            treeDataLoadedIdsSet, treeLocationDataLoadedIdsSet, updatesCallbacks: [callback]
        })
    const treeId = '12354'
    const expectedCalledWith: ISigmaIdToRender = {
        sigmaIdToRender: treeId
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
    const expectedCalledWith: ISigmaIdToRender = {
        sigmaIdToRender: treeId
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
