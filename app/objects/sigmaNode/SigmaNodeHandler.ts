// map from treeId to sigmaNodeId
// map from contentId to sigmaNodeId
// in the class that creates an instance of SigmaNodeHandlerSubscriber
// subscribe to stores. on stores update parse object type and id
// and get the correct tree id from either those two properties or from the result of a map lookup

import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    fGetSigmaIdsForContentId, ISigmaNodeHandler, ITypeAndIdAndValUpdates,
    ObjectDataDataTypes,
    ObjectDataTypes,
} from '../interfaces';
import {ISigmaNode} from '../interfaces';
import {TYPES} from '../types';

@injectable()
class SigmaNodeHandler implements ISigmaNodeHandler {
    private getSigmaIdsForContentId: fGetSigmaIdsForContentId
    private sigmaNodes: object;

    constructor(@inject(TYPES.SigmaNodeHandlerArgs){getSigmaIdsForContentId, sigmaNodes} ) {
        this.sigmaNodes = sigmaNodes
        this.getSigmaIdsForContentId = getSigmaIdsForContentId
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
    // TODO: refactor into a public method on another class
    public handleUpdate(update: ITypeAndIdAndValUpdates) {
        log('handleUpdate is ' + update + this.getSigmaNodeIds + this)
        const sigmaIds: string[] = this.getSigmaNodeIds(update)
        sigmaIds.forEach(id => {
            const sigmaNode: ISigmaNode = this.sigmaNodes[id]
            this.updateSigmaNode({sigmaNode, updateType: update.type, data: update.val})
        })
    }
    private updateSigmaNode(
        {
            sigmaNode, updateType, data
        }: {
            sigmaNode: ISigmaNode, updateType: ObjectDataTypes, data: ObjectDataDataTypes
        }) {
        switch (updateType) {
            case ObjectDataTypes.TREE_DATA:
                sigmaNode.receiveNewTreeData(data)
                break
            case ObjectDataTypes.TREE_LOCATION_DATA:
                sigmaNode.receiveNewTreeLocationData(data)
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
        }
    }
}
@injectable()
class SigmaNodeHandlerArgs {
    @inject(TYPES.fGetSigmaIdsForContentId) public getSigmaIdsForContentId;
    @inject(TYPES.Object) public sigmaNodes;
}

export {SigmaNodeHandler, SigmaNodeHandlerArgs}
