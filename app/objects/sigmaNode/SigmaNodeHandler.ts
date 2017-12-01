// map from treeId to sigmaNodeId
// map from contentId to sigmaNodeId
// in the class that creates an instance of SigmaNodeHandlerSubscriber
// subscribe to store. on store update parse object type and id
// and get the correct tree id from either those two properties or from the result of a map lookup

import {inject, injectable} from 'inversify';
import {ObjectDataTypes} from '../dataStores/ObjectTypes';
import {ISigmaNodeHandler, ITypeAndIdAndValUpdates, ObjectDataDataTypes} from '../interfaces';
import {TYPES} from '../types';
import {ISigmaNode} from './ISigmaNode';

@injectable()
class SigmaNodeHandler implements ISigmaNodeHandler {
    private contentIdSigmaIdMap: object
    private sigmaNodes: object;

    constructor(@inject(TYPES.SigmaNodeHandlerArgs){contentIdSigmaIdMap, sigmaNodes} ) {
        this.sigmaNodes = sigmaNodes
        this.contentIdSigmaIdMap = contentIdSigmaIdMap
    }

    private getSigmaNodeId(update: ITypeAndIdAndValUpdates) {
        let sigmaId
        const type: ObjectDataTypes = update.type
        switch (type) {
            case ObjectDataTypes.TREE_DATA:
            case ObjectDataTypes.TREE_LOCATION_DATA:
            case ObjectDataTypes.TREE_USER_DATA:
                sigmaId = update.id
                break
            case ObjectDataTypes.CONTENT_DATA:
            case ObjectDataTypes.CONTENT_USER_DATA:
                sigmaId = this.contentIdSigmaIdMap[update.id]
                // TODO: what to do if contentId is not stored in sigmaId map yet?
                break;
        }
        return sigmaId
    }
    // TODO: refactor into a public method on another class
    public handleUpdate(update: ITypeAndIdAndValUpdates) {
        const sigmaId = this.getSigmaNodeId(update)
        const sigmaNode: ISigmaNode = this.sigmaNodes[sigmaId]
        this.updateSigmaNode({sigmaNode, updateType: update.type, data: update.val})

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
    @inject(TYPES.Object) public contentIdSigmaIdMap;
    @inject(TYPES.Object) public sigmaNodes;
}

export {SigmaNodeHandler}
