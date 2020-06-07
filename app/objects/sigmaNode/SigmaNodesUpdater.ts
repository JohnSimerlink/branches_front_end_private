// map from treeId to sigmaNodeId
// sourceMap from contentId to sigmaNodeId
// in the class that creates an instance of CanvasUI
// subscribe to stores. on stores update parse object type and id
// and get the correct tree id from either those two properties or from the result of a sourceMap lookup

import {
	inject,
	injectable,
	tagged
} from 'inversify';
import {
	CustomStoreDataTypes,
	fGetSigmaIdsForContentId,
	FGetStore,
	IContentData,
	IContentUserData,
	id,
	IHash,
	ISigmaEdge,
	ISigmaEdges,
	ISigmaEdgesUpdater,
	ISigmaNode, ISigmaNodeInteractionState, ISigmaNodeInteractionStateUpdate,
	ISigmaNodes,
	ISigmaNodesUpdater,
	ISigmaRenderManager,
	IStoreGetters,
	ITypeAndIdAndValUpdate,
	ObjectDataDataTypes,
} from '../interfaces';
import {TYPES} from '../types';
import {getContentId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {
	SigmaNode,
	SigmaNodeArgs
} from './SigmaNode';
import {Store} from 'vuex';
import {TAGS} from '../tags';
import {
	createEdgeId,
	createParentSigmaEdge
} from '../sigmaEdge/sigmaEdge';
import {ProficiencyUtils} from '../proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {getTreeId} from '../treeUser/treeUserUtils';

@injectable()
export class SigmaNodesUpdater implements ISigmaNodesUpdater {
	private getSigmaIdsForContentId: fGetSigmaIdsForContentId;
	private sigmaNodes: ISigmaNodes;
	private sigmaEdges: ISigmaEdges;
	private sigmaRenderManager: ISigmaRenderManager;
	private contentIdContentMap: IHash<IContentData>;
	private contentIdContentUserMap: IHash<IContentUserData>;
	private getters: IStoreGetters;

	constructor(@inject(TYPES.SigmaNodesUpdaterArgs){
		getSigmaIdsForContentId,
		sigmaNodes,
		sigmaEdges,
		sigmaRenderManager,
		contentIdContentMap,
		contentIdContentUserMap,
		getters,
	}: SigmaNodesUpdaterArgs) {
		this.sigmaNodes = sigmaNodes;
		this.sigmaEdges = sigmaEdges;
		this.getSigmaIdsForContentId = getSigmaIdsForContentId;
		this.sigmaRenderManager = sigmaRenderManager;
		this.contentIdContentMap = contentIdContentMap;
		this.contentIdContentUserMap = contentIdContentUserMap;
		this.getters = getters
	}

	/*
	@requires that the sigmaNode with id of `update.id` already exists in this.sigmaNodes
	 */
	public handleInteractionStateUpdate(update: ISigmaNodeInteractionStateUpdate) {
		const sigmaNode = this.sigmaNodes[update.id];
		sigmaNode.setInteractionState(update);

	}
	// TODO: ensure that anything calling this has the sigmaNodes exist
	/** handles a generic update of type `ITypeAndIdAndValUpdate`
	 *
	 * These are for updating the actual "value of the card" - e.g. the content of the card, or the user's proficiency
	 * on it
	 * @param update
	 */
	public handleValueUpdate(update: ITypeAndIdAndValUpdate) {
		const sigmaIds: string[] = this.getSigmaNodeIdsOrCacheContentData(update);
		const me = this;
		sigmaIds.forEach(sigmaId => {
			let sigmaNode: ISigmaNode = me.sigmaNodes[sigmaId];
			if (!sigmaNode) {
				sigmaNode = new SigmaNode({id: sigmaId} as SigmaNodeArgs);
				me.sigmaNodes[sigmaId] = sigmaNode;
			}
			this.updateSigmaNode({
				sigmaNode,
				updateType: update.type,
				data: update.val,
				sigmaId
			});
		});
	}

	// Assumes the sigmaNodes that the update affects already exist

	public highlightNode(nodeId: id) {
		const sigmaNode: ISigmaNode = this.sigmaNodes[nodeId];
		sigmaNode.highlight();
	}

	public unHighlightNode(nodeId: id) {
		const sigmaNode: ISigmaNode = this.sigmaNodes[nodeId];
		sigmaNode.unhighlight();
	}
	public flip(nodeId: id) {
		const sigmaNode: ISigmaNode = this.sigmaNodes[nodeId];
		sigmaNode.flip();
	}

	private getSigmaNodeIdsOrCacheContentData(update: ITypeAndIdAndValUpdate) {
		let sigmaIds = [];
		const type: CustomStoreDataTypes = update.type;
		switch (type) {
			case CustomStoreDataTypes.TREE_DATA:
			case CustomStoreDataTypes.TREE_LOCATION_DATA: {
				const treeId = update.id;
				sigmaIds = [treeId];
				break;
			}
			case CustomStoreDataTypes.TREE_USER_DATA: {
				console.log('getSigmaNodeIdsOrCacheContentData called with type of TreeUserData')
				const treeUserId = update.id
				const treeId = getTreeId({treeUserId})
				sigmaIds = [treeId]
				// TODO: extract the treeId from treeUserId
				break;
			}
			case CustomStoreDataTypes.CONTENT_DATA: {
				const contentId = update.id;
				sigmaIds = this.getSigmaIdsForContentId(contentId);
				/* cache the content data because the treeDataFromDB for this contentItem may not be loaded yet,
				 so no sigmaIds may be returned,
					meaning once the treeDataFromDB is loaded we need to be able to load
					the contentData that was cached here
				 */
				const contentData: IContentData = update.val;
				this.contentIdContentMap[contentId] = contentData;
				break;
			}
			case CustomStoreDataTypes.CONTENT_USER_DATA: {
				const contentUserId = update.id;
				const contentId = getContentId({contentUserId});
				const contentUserData: IContentUserData = update.val;
				/* cache the content user data because the treeDataFromDB
					 for this contentuserItem may not be loaded yet,
					 so no sigmaIds may be returned, meaning once the treeDataFromDB
					 is loaded we need to be able to load the contentUserData
					 that was cached here.
				 */
				this.contentIdContentUserMap[contentId] = contentUserData;
				// TODO: Cache ContentUserData like we do with CONTENT_DATA
				sigmaIds = this.getSigmaIdsForContentId(contentId);
				break;
			}
		}
		return sigmaIds;
	}

	private updateSigmaNode(
		{
			sigmaNode, updateType, data, sigmaId,
		}: {
			sigmaNode: ISigmaNode, updateType: CustomStoreDataTypes, data: ObjectDataDataTypes, sigmaId: string
		}) {
		switch (updateType) {
			case CustomStoreDataTypes.TREE_DATA:
				sigmaNode.receiveNewTreeData(data);
				/* check if there is the contentData already downloaded for this sigmaId,
				 * and if so apply its data to the sigmaNode.
				 * Because the contentData may have been downloaded/cached before the treeDataFromDB
				 */
				const contentData: IContentData = this.contentIdContentMap[data.contentId];
				if (contentData) {
					sigmaNode.receiveNewContentData(contentData);
				}
				/* check if there is the contentUserData already downloaded for this sigmaId,
				 * and if so apply its data to the sigmaNode.
				 * Because the contentUserData may have been downloaded/cached before the treeDataFromDB
				 */
				const contentUserData: IContentUserData = this.contentIdContentUserMap[data.contentId];
				if (contentUserData) {
					sigmaNode.receiveNewContentUserData(contentUserData);
				}
				/**
				 * Create sigma Edge
				 */
					// TODO: move this logic into sigmaEdgesUpdater, and ensure it is called after sigmaNodesUpdater's call
				const treeId = sigmaId;
				const parentId = data.parentId;
				const edgeId = createEdgeId({
					treeId,
					parentId
				});
				let edge: ISigmaEdge = this.sigmaEdges[edgeId];
				if (!edge) {
					const color = ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN);
					edge = createParentSigmaEdge({
						parentId,
						treeId,
						color
					});
					this.sigmaEdges[edgeId] = edge;
					this.sigmaRenderManager.addWaitingEdge(edgeId);
				}

				this.sigmaRenderManager.markTreeDataLoaded(sigmaId);
				// ^ the above method will also search for any edges that now can be loaded now
				// that that treeDataFromDB is loaded . . . and publishes an update for that edge to be added.
				break;
			case CustomStoreDataTypes.TREE_LOCATION_DATA:
				sigmaNode.receiveNewTreeLocationData(data);
				this.sigmaRenderManager.markTreeLocationDataLoaded(sigmaId);
				break;
			case CustomStoreDataTypes.TREE_USER_DATA:
				sigmaNode.receiveNewTreeUserData(data);
				break;
			case CustomStoreDataTypes.CONTENT_DATA:
				sigmaNode.receiveNewContentData(data);
				break;
			case CustomStoreDataTypes.CONTENT_USER_DATA:
				sigmaNode.receiveNewContentUserData(data);
				break;
			default:
				throw new RangeError(updateType + ' not a valid type in ' + JSON.stringify(CustomStoreDataTypes));
		}
		const store = this.getters.getStore();
		store.commit(MUTATION_NAMES.REFRESH);
	}
}

@injectable()
export class SigmaNodesUpdaterArgs {
	@inject(TYPES.fGetSigmaIdsForContentId)
	@tagged(TAGS.CONTENT_ID_SIGMA_IDS_MAP, true)
	public getSigmaIdsForContentId: fGetSigmaIdsForContentId;
	@inject(TYPES.ISigmaNodes) public sigmaNodes: ISigmaNodes;
	@inject(TYPES.ISigmaEdges) public sigmaEdges: ISigmaEdges;
	@inject(TYPES.ISigmaRenderManager)
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	public sigmaRenderManager: ISigmaRenderManager;
	@inject(TYPES.Object) public contentIdContentMap: IHash<IContentData>;
	@inject(TYPES.Object) public contentIdContentUserMap: IHash<IContentUserData>;
	@inject(TYPES.IStoreGetters) public getters: IStoreGetters;
}
