import {inject, injectable, tagged} from 'inversify';
import {log} from '../../../app/core/log'
import {
    IOneToManyMap, ISigmaNodes,
    ISigmaNodesUpdater, IStoreSourceUpdateListenerCore,
    ITypeAndIdAndValUpdates, ObjectDataTypes
} from '../interfaces';
import {SigmaNode, SigmaNodeArgs} from '../sigmaNode/SigmaNode';
import {TYPES} from '../types';
import {getContentId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {TAGS} from '../tags';

@injectable()
export class StoreSourceUpdateListenerCore implements IStoreSourceUpdateListenerCore {
    private sigmaNodes: ISigmaNodes
    private sigmaNodesUpdater: ISigmaNodesUpdater
    private contentIdSigmaIdMap: IOneToManyMap<string>
    constructor(
        @inject(TYPES.StoreSourceUpdateListenerCoreArgs){
            sigmaNodes, sigmaNodesUpdater, contentIdSigmaIdMap}: StoreSourceUpdateListenerCoreArgs) {
        this.sigmaNodes = sigmaNodes
        this.sigmaNodesUpdater = sigmaNodesUpdater
        this.contentIdSigmaIdMap = contentIdSigmaIdMap
        log('StoreSourceUpdateListenerCore sigmaNodes is', this.sigmaNodes, sigmaNodes,
            this.contentIdSigmaIdMap, contentIdSigmaIdMap,
            this.sigmaNodesUpdater, sigmaNodesUpdater)
        this['_id'] = Math.random()
        log('StoreSourceUpdateListenerCore id is', this['_id'])
    }
    // private receiveUpdate

    /* TODO: edge case - what if a content data is received before the tree data,
    meaning the content data may not have a sigma id to be applied to? */
    /* ^^^ This is handled in SigmaNodesUpdater ^^^^ */
    public receiveUpdate(update: ITypeAndIdAndValUpdates) {
        log('StoreSourceUpdateListenerCore, with id of ', this['_id'],' receiveUpdate CALLED!!!', update, this.sigmaNodes,
            this.sigmaNodesUpdater, this.contentIdSigmaIdMap)
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
                // const contentId = update.id
                // const sigmaIds = this.contentIdSigmaIdMap.get(contentId)
                // log('StoreSourceUpdateListenerCore sigmaIds in content Data are', sigmaIds, this.contentIdSigmaIdMap)
                // if (sigmaIds.length) {
                this.sigmaNodesUpdater.handleUpdate(update)
                // }
                break;
            }
            case ObjectDataTypes.CONTENT_USER_DATA: {
                // TODO: currently assumes that tree/sigma id's  are loaded before content is
                const contentUserId = update.id
                const contentId = getContentId({contentUserId})
                const sigmaIds = this.contentIdSigmaIdMap.get(contentId)
                log('StoreSourceUpdateListenerCore sigmaIds in content ' +
                    'user data are', sigmaIds, this.contentIdSigmaIdMap)
                if (sigmaIds.length) {
                    this.sigmaNodesUpdater.handleUpdate(update)
                }
                break;
            }
            default:
                throw new RangeError(JSON.stringify(type) + ' is not a valid update type')
        }
    }
}
@injectable()
export class StoreSourceUpdateListenerCoreArgs {
    @inject(TYPES.ISigmaNodes) public sigmaNodes: ISigmaNodes
    @inject(TYPES.ISigmaNodesUpdater) public sigmaNodesUpdater: ISigmaNodesUpdater
    @inject(TYPES.IOneToManyMap)
    @tagged(TAGS.CONTENT_ID_SIGMA_IDS_MAP, true)
        public contentIdSigmaIdMap: IOneToManyMap<string>
}
