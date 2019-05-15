import {
	inject,
	injectable,
	tagged
} from 'inversify';
import {
	CustomStoreDataTypes,
	IContentUser,
	IContentUserData,
	IOneToManyMap,
	ISigmaEdgesUpdater,
	ISigmaNodesUpdater,
	IStoreObjectUpdate,
	IStoreSourceUpdateListenerCore
} from '../interfaces';
import {TYPES} from '../types';
import {getContentId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {TAGS} from '../tags';
import {Store} from 'vuex';
import {
	ISetContentMutationArgs,
	ISetContentUserMutationArgs,
	ISetTreeLocationMutationArgs,
	ISetTreeMutationArgs,
} from '../../core/store/store_interfaces';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';

@injectable()
export class StoreSourceUpdateListenerCore implements IStoreSourceUpdateListenerCore {
	// private sigmaNodes: ISigmaNodes
	private sigmaNodesUpdater: ISigmaNodesUpdater;
	private sigmaEdgesUpdater: ISigmaEdgesUpdater;
	private contentIdSigmaIdMap: IOneToManyMap<string>;
	private store: Store<any>;

	constructor(
		@inject(TYPES.StoreSourceUpdateListenerCoreArgs){
			sigmaNodesUpdater,
			sigmaEdgesUpdater,
			contentIdSigmaIdMap, store
		}: StoreSourceUpdateListenerCoreArgs) {
		// this.sigmaNodes = sigmaNodes
		this.sigmaNodesUpdater = sigmaNodesUpdater;
		this.sigmaEdgesUpdater = sigmaEdgesUpdater;
		this.contentIdSigmaIdMap = contentIdSigmaIdMap;
		this.store = store;
	}

	/* TODO: edge case - what if a content data is received before the tree_OUTDATED data,
	meaning the content data may not have a sigma id to be applied to? */

	/* ^^^ This is handled in SigmaNodesUpdater ^^^^ */
	public receiveUpdate(update: IStoreObjectUpdate) {
		const type: CustomStoreDataTypes = update.type;
		switch (type) {
			case CustomStoreDataTypes.TREE_DATA: {
				const sigmaId = update.id;
				const contentId = update.val.contentId;

				this.contentIdSigmaIdMap.set(contentId, sigmaId);
				this.sigmaNodesUpdater.handleUpdate(update);

				const mutationArgs: ISetTreeMutationArgs = {
					treeId: update.id,
					tree: update.obj,
				};
				this.store.commit(MUTATION_NAMES.SET_TREE, mutationArgs);
				break;
			}
			case CustomStoreDataTypes.TREE_LOCATION_DATA: {
				this.sigmaNodesUpdater.handleUpdate(update);

				const mutationArgs: ISetTreeLocationMutationArgs = {
					treeId: update.id,
					treeLocation: update.obj,
				};
				this.store.commit(MUTATION_NAMES.SET_TREE_LOCATION, mutationArgs);

				break;
			}
			case CustomStoreDataTypes.CONTENT_DATA: {
				this.sigmaNodesUpdater.handleUpdate(update);

				const mutationArgs: ISetContentMutationArgs = {
					contentId: update.id,
					content: update.obj,
				};
				this.store.commit(MUTATION_NAMES.SET_CONTENT, mutationArgs);

				// }
				break;
			}
			case CustomStoreDataTypes.CONTENT_USER_DATA: {
				// TODO: currently assumes that tree_OUTDATED/sigma id's  are loaded before content is
				const contentUserId = update.id;
				const contentUser: IContentUser = update.obj
				const contentUserProficiencyVal: PROFICIENCIES = contentUser.proficiency.val();
				const contentId = getContentId({contentUserId});
				const sigmaIds = this.contentIdSigmaIdMap.get(contentId);
				if (sigmaIds.length) {
					this.sigmaNodesUpdater.handleUpdate(update);
					this.sigmaEdgesUpdater.handleUpdate(update);
					// sigmaIds.forEach(sigmaId => {
					// 	this.sigmaEdgesUpdater.updateParentEdgeColorLeaf({
					// 		treeId: sigmaId,
					// 		contentUserProficiency: contentUserProficiencyVal
					// 	})
					// })
				}

				const mutationArgs: ISetContentUserMutationArgs = {
					contentUserId: update.id,
					contentUser: update.obj,
				};
				this.store.commit(MUTATION_NAMES.SET_CONTENT_USER, mutationArgs);

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
	@inject(TYPES.ISigmaEdgesUpdater)
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	public sigmaEdgesUpdater: ISigmaEdgesUpdater;
	@inject(TYPES.IOneToManyMap)
	@tagged(TAGS.CONTENT_ID_SIGMA_IDS_MAP, true)
	public contentIdSigmaIdMap: IOneToManyMap<string>;
	@inject(TYPES.BranchesStore)
	public store: Store<any>;
}
