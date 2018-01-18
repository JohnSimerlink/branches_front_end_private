// map from treeId to sigmaNodeId
// map from contentId to sigmaNodeId
// in the class that creates an instance of CanvasUI
// subscribe to stores. on stores update parse object type and id
// and get the correct tree id from either those two properties or from the result of a map lookup

import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    fGetSigmaIdsForContentId, ISigmaNodesUpdater, ISigmaRenderManager, ITypeAndIdAndValUpdates,
    ObjectDataDataTypes,
    ObjectDataTypes,
} from '../interfaces';
import {ISigmaNode} from '../interfaces';
import {TYPES} from '../types';

@injectable()
class SigmaNodesUpdater implements ISigmaNodesUpdater {
    private getSigmaIdsForContentId: fGetSigmaIdsForContentId
    private sigmaNodes: object;
    private sigmaRenderManager: ISigmaRenderManager

    constructor(@inject(TYPES.SigmaNodesUpdaterArgs){
        getSigmaIdsForContentId, sigmaNodes,
        sigmaRenderManager} ) {
        this.sigmaNodes = sigmaNodes
        this.getSigmaIdsForContentId = getSigmaIdsForContentId
        this.sigmaRenderManager = sigmaRenderManager
    }

    private getSigmaNodeIds(update: ITypeAndIdAndValUpdates) {
        let sigmaIds = []
        const type: ObjectDataTypes = update.type
        switch (type) {
            case ObjectDataTypes.TREE_DATA:
            case ObjectDataTypes.TREE_LOCATION_DATA:
            case ObjectDataTypes.TREE_USER_DATA:
                const treeId = update.id
                sigmaIds = [treeId]
                break
            case ObjectDataTypes.CONTENT_DATA:
            case ObjectDataTypes.CONTENT_USER_DATA:
                const contentId = update.id
                sigmaIds = this.getSigmaIdsForContentId(contentId)
                // TODO: what to do if contentId is not stored in sigmaId map yet?
                break;
        }
        return sigmaIds
    }
    public handleUpdate(update: ITypeAndIdAndValUpdates) {
        // log('sigmaNodesUpdate handleUpdate called', update)
        const sigmaIds: string[] = this.getSigmaNodeIds(update)
        const me = this
        sigmaIds.forEach(sigmaId => {
            const sigmaNode: ISigmaNode = me.sigmaNodes[sigmaId]
            this.updateSigmaNode({sigmaNode, updateType: update.type, data: update.val, sigmaId})
        })
    }
    private updateSigmaNode(
        {
            sigmaNode, updateType, data, sigmaId,
        }: {
            sigmaNode: ISigmaNode, updateType: ObjectDataTypes, data: ObjectDataDataTypes, sigmaId: string
        }) {
        switch (updateType) {
            case ObjectDataTypes.TREE_DATA:
                sigmaNode.receiveNewTreeData(data)
                this.sigmaRenderManager.markTreeDataLoaded(sigmaId)
                break
            case ObjectDataTypes.TREE_LOCATION_DATA:
                sigmaNode.receiveNewTreeLocationData(data)
                this.sigmaRenderManager.markTreeLocationDataLoaded(sigmaId)
                break
            case ObjectDataTypes.TREE_USER_DATA:
                sigmaNode.receiveNewTreeUserData(data)
                break
            case ObjectDataTypes.CONTENT_DATA:
                sigmaNode.receiveNewContentData(data)
                break;
            case ObjectDataTypes.CONTENT_USER_DATA:
                sigmaNode.receiveNewContentUserData(data)
                break;
            default:
                throw new RangeError(updateType + ' not a valid type in ' + JSON.stringify(ObjectDataTypes))
        }
    }
}
@injectable()
class SigmaNodesUpdaterArgs {
    @inject(TYPES.fGetSigmaIdsForContentId) public getSigmaIdsForContentId;
    @inject(TYPES.Object) public sigmaNodes;
    @inject(TYPES.ISigmaRenderManager) public sigmaRenderManager;
}

export {SigmaNodesUpdater, SigmaNodesUpdaterArgs}
