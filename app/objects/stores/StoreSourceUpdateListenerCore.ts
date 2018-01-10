import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    IMap, IOneToManyMap,
    ISigmaNode,
    ISigmaNodesUpdater, IStoreSourceUpdateListener, IStoreSourceUpdateListenerCore, ISubscribable,
    ITypeAndIdAndValUpdates, ObjectDataTypes
} from '../interfaces';
import {SigmaNode, SigmaNodeArgs} from '../sigmaNode/SigmaNode';
import {TYPES} from '../types';
import {getSigmaIdsForContentId} from '../../testHelpers/testHelpers';

@injectable()
export class StoreSourceUpdateListenerCore implements IStoreSourceUpdateListenerCore {
    private sigmaNodes: object
    private sigmaNodesUpdater: ISigmaNodesUpdater
    private contentIdSigmaIdMap: IOneToManyMap<string>
    constructor(@inject(TYPES.StoreSourceUpdateListenerCoreArgs){sigmaNodes, sigmaNodesUpdater, contentIdSigmaIdMap}) {
        this.sigmaNodes = sigmaNodes
        this.sigmaNodesUpdater = sigmaNodesUpdater
        this.contentIdSigmaIdMap = contentIdSigmaIdMap
    }
    // private receiveUpdate

    /* TODO: edge case - what if a content data is received before the tree data,
    meaning the content data may not have a sigma id to be applied to? */
    public receiveUpdate(update: ITypeAndIdAndValUpdates) {
        log('StoreSourceUpdateListenerCore receiveUpdate CALLED!!!', update)
        const type: ObjectDataTypes = update.type
        switch (type) {
            case ObjectDataTypes.TREE_DATA: {
                const sigmaId = update.id
                const contentId = update.val.contentId
                if (!this.sigmaNodes[sigmaId]) {
                    this.sigmaNodes[sigmaId] = new SigmaNode({id: sigmaId} as SigmaNodeArgs)
                }
                this.contentIdSigmaIdMap.set(contentId, sigmaId)
                this.sigmaNodesUpdater.handleUpdate(update)
                break;
            }
            case ObjectDataTypes.TREE_LOCATION_DATA: {
                const sigmaId = update.id
                if (!this.sigmaNodes[sigmaId]) {
                    this.sigmaNodes[sigmaId] = new SigmaNode({id: sigmaId} as SigmaNodeArgs)
                }
                this.sigmaNodesUpdater.handleUpdate(update)
                break;
            }
            case ObjectDataTypes.CONTENT_DATA: {
                // TODO: currently assumes that tree/sigma id's  are loaded before content is
                const contentId = update.id
                const sigmaIds = this.contentIdSigmaIdMap.get(contentId)
                if (sigmaIds.length) {
                    this.sigmaNodesUpdater.handleUpdate(update)
                }
            }
            default:
                throw new RangeError(JSON.stringify(type) + ' is not a valid update type')
        }
    }
}
@injectable()
export class StoreSourceUpdateListenerCoreArgs {
    @inject(TYPES.Object) public sigmaNodes
    @inject(TYPES.ISigmaNodesUpdater) public sigmaNodesUpdater
}
