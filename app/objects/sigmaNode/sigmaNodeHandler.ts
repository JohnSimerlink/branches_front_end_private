// map from treeId to sigmaNodeId
// map from contentId to sigmaNodeId
// in the class that creates an instance of SigmaNodeHandler
// subscribe to store. on store update parse object type and id
// and get the correct tree id from either those two properties or from the result of a map lookup

import {ISubscriber} from '../subscribable/ISubscriber';
import {IIdSigmaNodeMap, ITypeAndIdAndValUpdates} from '../interfaces';
import {ISubscribable} from '../subscribable/ISubscribable';
import {ObjectDataTypes} from '../dataStores/ObjectTypes';
import {ISigmaNode} from './ISigmaNode';

class SigmaNodeHandler implements ISubscriber<ITypeAndIdAndValUpdates> {
    public subscribe(obj: ISubscribable<ITypeAndIdAndValUpdates>) {
        obj.onUpdate((updates: ITypeAndIdAndValUpdates) => {

        })
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
    private handleUpdate(update: ITypeAndIdAndValUpdates) {
        const sigmaId = this.getSigmaNodeId(update)
        const sigmaNode: ISigmaNode = this.sigmaNodes[sigmaId]
        switch (update)

    }

    private contentIdSigmaIdMap
    private sigmaNodes: IIdSigmaNodeMap

    constructor({contentIdSigmaIdMap, sigmaNodes}) {
        this.sigmaNodes = sigmaNodes
        this.contentIdSigmaIdMap = contentIdSigmaIdMap
    }
}

export class {SigmaNodeHandler}
