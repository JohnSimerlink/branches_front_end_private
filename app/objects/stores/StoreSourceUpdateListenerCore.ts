import {inject, injectable, tagged} from 'inversify';
import {log} from '../../../app/core/log';
import {
    GlobalStoreObjectDataTypes,
    IOneToManyMap,
    ISetContentDataMutationArgs,
    ISetContentUserDataMutationArgs,
    ISetTreeDataMutationArgs,
    ISetTreeLocationDataMutationArgs,
    ISigmaNodesUpdater,
    IStoreSourceUpdateListenerCore,
    ITypeAndIdAndValUpdates
} from '../interfaces';
import {TYPES} from '../types';
import {getContentId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {TAGS} from '../tags';
import {MUTATION_NAMES} from '../../core/store';
import {Store} from 'vuex';

@injectable()
export class StoreSourceUpdateListenerCore implements IStoreSourceUpdateListenerCore {
    // private sigmaNodes: ISigmaNodes
    private sigmaNodesUpdater: ISigmaNodesUpdater;
    private contentIdSigmaIdMap: IOneToManyMap<string>;
    private store: Store<any>;
    constructor(
        @inject(TYPES.StoreSourceUpdateListenerCoreArgs){
            sigmaNodesUpdater, contentIdSigmaIdMap, store}: StoreSourceUpdateListenerCoreArgs) {
        // this.sigmaNodes = sigmaNodes
        this.sigmaNodesUpdater = sigmaNodesUpdater;
        this.contentIdSigmaIdMap = contentIdSigmaIdMap;
        this.store = store;
        const _id = '_id';
        this[_id] = Math.random();
    }
    // private receiveUpdate

    /* TODO: edge case - what if a content data is received before the tree_OUTDATED data,
    meaning the content data may not have a sigma id to be applied to? */
    /* ^^^ This is handled in SigmaNodesUpdater ^^^^ */
    public receiveUpdate(update: ITypeAndIdAndValUpdates) {
        const type: GlobalStoreObjectDataTypes = update.type;
        switch (type) {
            case GlobalStoreObjectDataTypes.TREE_DATA: {
                const sigmaId = update.id;
                const contentId = update.val.contentId;
                // if (!this.sigmaNodes[sigmaId]) {
                //     this.sigmaNodes[sigmaId] = new SigmaNode({id: sigmaId} as SigmaNodeArgs)
                // }
                this.contentIdSigmaIdMap.set(contentId, sigmaId);
                this.sigmaNodesUpdater.handleUpdate(update);

                const mutationArgs: ISetTreeDataMutationArgs = {
                    treeId: update.id,
                    treeDataWithoutId: update.val,
                };
                this.store.commit(MUTATION_NAMES.SET_TREE_DATA, mutationArgs);
                break;
            }
            case GlobalStoreObjectDataTypes.TREE_LOCATION_DATA: {
                // const sigmaId = update.id
                // if (!this.sigmaNodes[sigmaId]) {
                //     this.sigmaNodes[sigmaId] = new SigmaNode({id: sigmaId} as SigmaNodeArgs)
                // }
                this.sigmaNodesUpdater.handleUpdate(update);

                const mutationArgs: ISetTreeLocationDataMutationArgs = {
                    treeId: update.id,
                    treeLocationData: update.val,
                };
                this.store.commit(MUTATION_NAMES.SET_TREE_LOCATION_DATA, mutationArgs);

                break;
            }
            case GlobalStoreObjectDataTypes.CONTENT_DATA: {
                this.sigmaNodesUpdater.handleUpdate(update);

                const mutationArgs: ISetContentDataMutationArgs = {
                    contentId: update.id,
                    contentData: update.val,
                };
                this.store.commit(MUTATION_NAMES.SET_CONTENT_DATA, mutationArgs);

                // }
                break;
            }
            case GlobalStoreObjectDataTypes.CONTENT_USER_DATA: {
                // TODO: currently assumes that tree_OUTDATED/sigma id's  are loaded before content is
                const contentUserId = update.id;
                const contentId = getContentId({contentUserId});
                const sigmaIds = this.contentIdSigmaIdMap.get(contentId);
                if (sigmaIds.length) {
                    this.sigmaNodesUpdater.handleUpdate(update);
                }

                const mutationArgs: ISetContentUserDataMutationArgs = {
                    contentUserId: update.id,
                    contentUserData: update.val,
                };
                this.store.commit(MUTATION_NAMES.SET_CONTENT_USER_DATA, mutationArgs);

                break;
            }
            default:
                throw new RangeError(JSON.stringify(type) + ' is not a valid update type');
        }
    }
}
@injectable()
export class StoreSourceUpdateListenerCoreArgs {
    // @inject(TYPES.ISigmaNodes) public sigmaNodes: ISigmaNodes
    @inject(TYPES.ISigmaNodesUpdater)
    @tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
        public sigmaNodesUpdater: ISigmaNodesUpdater;
    @inject(TYPES.IOneToManyMap)
    @tagged(TAGS.CONTENT_ID_SIGMA_IDS_MAP, true)
        public contentIdSigmaIdMap: IOneToManyMap<string>;
    @inject(TYPES.BranchesStore)
        public store: Store<any>;
}
