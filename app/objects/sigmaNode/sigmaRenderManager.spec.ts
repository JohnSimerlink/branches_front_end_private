import {expect} from 'chai'
import {myContainer} from '../../../inversify.config';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {ISigmaRenderManager} from '../interfaces';
import {TYPES} from '../types';
import {SigmaRenderManager, SigmaRenderManagerArgs} from './SigmaRenderManager';

describe('SigmaRenderManager', () => {
    it('DI constructor works', () => {

        const injects = injectionWorks<SigmaRenderManagerArgs, ISigmaRenderManager>({
            container: myContainer,
            argsType: TYPES.SigmaRenderManagerArgs,
            classType: TYPES.ISigmaRenderManager,
        })
        expect(injects).to.equal(true)
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
        const sigmaRenderManager: ISigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
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
