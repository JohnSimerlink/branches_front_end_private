import {inject, injectable} from 'inversify';
import {ISigmaRenderManager, ITreeDataWithoutId, ITreeLocationData} from '../interfaces';
import {TYPES} from '../types';
import {SigmaNodeCreatorCore} from './SigmaNodeCreatorCore';

@injectable()
export class ManagedSigmaNodeCreatorCore extends SigmaNodeCreatorCore {
    private sigmaRenderManager: ISigmaRenderManager
    constructor(@inject(TYPES.ManagedSigmaNodeCreatorCoreArgs){sigmaNodes, sigmaRenderManager}) {
        super({sigmaNodes})
        this.sigmaRenderManager = sigmaRenderManager
    }
    public receiveNewTreeData({treeId, treeData}: { treeId: string; treeData: ITreeDataWithoutId }) {
        super.receiveNewTreeData({treeId, treeData})
        const sigmaId = treeId
        this.sigmaRenderManager.markTreeDataLoaded(sigmaId)
    }
    public receiveNewTreeLocationData(
        {treeId, treeLocationData}: { treeId: string; treeLocationData: ITreeLocationData }) {
        super.receiveNewTreeLocationData({treeId, treeLocationData})
        const sigmaId = treeId
        this.sigmaRenderManager.markTreeLocationDataLoaded(sigmaId)
    }
}
@injectable()
export class ManagedSigmaNodeCreatorCoreArgs {
    @inject(TYPES.ISigmaRenderManager) public sigmaRenderManager
}
