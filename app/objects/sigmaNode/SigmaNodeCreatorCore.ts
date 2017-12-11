import {inject, injectable} from 'inversify';
import {
    IContentData, IContentUserData, IHash, ISigmaNode, ISigmaNodeCreatorCore, ITreeDataWithoutId, ITreeLocationData,
    ITreeUserData
} from '../interfaces';
import {TYPES} from '../types';
import {SigmaNode} from './SigmaNode';

@injectable()
export class SigmaNodeCreatorCore implements ISigmaNodeCreatorCore {
    private sigmaNodes: IHash<ISigmaNode>
    constructor(@inject(TYPES.SigmaNodeCreatorCoreArgs){sigmaNodes}) {
        this.sigmaNodes = sigmaNodes
    }
    private nodeExists(sigmaId) {
        return !!this.sigmaNodes[sigmaId]
    }
    public receiveNewTreeData({treeId, treeData}: { treeId: string; treeData: ITreeDataWithoutId }) {
        if (this.nodeExists(treeId)) {
            throw new RangeError(treeId + ' already exists as a sigmaNode. No need to recreate it')
        }
        const sigmaNode: ISigmaNode = new SigmaNode()
        const sigmaId = treeId
        sigmaNode.receiveNewTreeData(treeData)
        this.sigmaNodes[sigmaId] = sigmaNode
    }

    public receiveNewTreeLocationData(
        {treeId, treeLocationData}: { treeId: string; treeLocationData: ITreeLocationData }
        ) {
        if (this.nodeExists(treeId)) {
            throw new RangeError(treeId + ' already exists as a sigmaNode. No need to recreate it')
        }
        const sigmaNode: ISigmaNode = new SigmaNode()
        const sigmaId = treeId
        sigmaNode.receiveNewTreeLocationData(treeLocationData)
        this.sigmaNodes[sigmaId] = sigmaNode
    }

    public receiveNewTreeUserData({treeId, treeUserData}: { treeId: string; treeUserData: ITreeUserData }) {
    }

    public receiveNewContentData({contentId, contentData}: { contentId: string; contentData: IContentData }) {
    }

    public receiveNewContentUserData(
        {contentId, contentUserData}: { contentId: string; contentUserData: IContentUserData }
        ) {
    }
}
@injectable()
export class SigmaNodeCreatorCoreArgs {
    @inject(TYPES.Object) public sigmaNodes
}
