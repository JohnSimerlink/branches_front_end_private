import {expect} from 'chai'
import {ISigmaRenderManager} from '../interfaces';
import {SigmaRenderManager} from './SigmaRenderManager';
import {myContainer} from '../../../inversify.config';
import {TYPES} from '../types';

describe('SigmaRenderManager', () => {
    it('DI constructor works', () => {

        const sigmaRenderManager: ISigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
        expect(sigmaRenderManager['treeDataLoadedIdsSet']).to.not.equal(undefined)
        expect(sigmaRenderManager['treeLocationDataLoadedIdsSet']).to.not.equal(undefined)
    })
    it('should mark as renderable after marking tree and treelocation data added[Regular Constructor]', () => {
        const treeDataLoadedIdsSet = {}
        const treeLocationDataLoadedIdsSet = {}
        const sigmaRenderManager: ISigmaRenderManager = new SigmaRenderManager(
            {
                treeDataLoadedIdsSet, treeLocationDataLoadedIdsSet
            })
        const treeId = '12354'
        let cannotRender = !sigmaRenderManager.canRender(treeId)
        expect(cannotRender).to.equal(true)
        sigmaRenderManager.markTreeDataLoaded(treeId)
        cannotRender = !sigmaRenderManager.canRender(treeId)
        expect(cannotRender).to.equal(true)
        sigmaRenderManager.markTreeLocationDataLoaded(treeId)
        cannotRender = !sigmaRenderManager.canRender(treeId)
        expect(cannotRender).to.equal(false)
    })
    it('should mark as renderable after marking tree and treelocation data added [DI constructor]', () => {

        const treeDataLoadedIdsSet = {}
        const treeLocationDataLoadedIdsSet = {}
        const sigmaRenderManager: ISigmaRenderManager = new SigmaRenderManager(
            {
                treeDataLoadedIdsSet, treeLocationDataLoadedIdsSet
            })
        const treeId = '12354'
        let cannotRender = !sigmaRenderManager.canRender(treeId)
        expect(cannotRender).to.equal(true)
        sigmaRenderManager.markTreeDataLoaded(treeId)
        cannotRender = !sigmaRenderManager.canRender(treeId)
        expect(cannotRender).to.equal(true)
        sigmaRenderManager.markTreeLocationDataLoaded(treeId)
        cannotRender = !sigmaRenderManager.canRender(treeId)
        expect(cannotRender).to.equal(false)
    })
})
