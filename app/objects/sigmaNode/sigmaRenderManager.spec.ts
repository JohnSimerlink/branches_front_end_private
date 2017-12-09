import {expect} from 'chai'
import {ISigmaRenderManager} from '../interfaces';
import {SigmaRenderManager} from './SigmaRenderManager';

describe('SigmaRendererManager', () => {
    it('should mark as renderable after marking tree and treelocation data added', () => {
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
