import {
	CustomStoreDataTypes,
	IContentUserData,
	id,
	IIdAndValUpdate,
	IOneToManyMap,
	ISigmaEdgesUpdater,
	ISigmaGraph,
	IStoreGetters,
	ITypeAndIdAndValUpdate
} from '../interfaces';
import {TYPES} from '../types';
import {
	inject,
	injectable, tagged
} from 'inversify';
import {createEdgeId} from './sigmaEdge';
import {ProficiencyUtils} from '../proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {log} from '../../core/log';
import {getContentId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {TAGS} from '../tags';

// TODO: maybe instead of calling this EdgeUpdater . .. call it DataChangeResponder . . .It listens to data changes on the event bus, and updates the UI appropriately. eh maybe it's fine as it is now
@injectable()
export class SigmaEdgesUpdater implements ISigmaEdgesUpdater {
	private getters: IStoreGetters;
	private contentIdSigmaIdMap: IOneToManyMap<id>;

	constructor(@inject(TYPES.SigmaEdgesUpdaterArgs){getters, contentIdSigmaIdMap}: SigmaEdgesUpdaterArgs) {
		this.getters = getters;
		this.contentIdSigmaIdMap = contentIdSigmaIdMap;
	}

	/** extract update
	 *
	 * @param update
	 */
	public handleUpdate(update: ITypeAndIdAndValUpdate) {
		if (update.type === CustomStoreDataTypes.CONTENT_USER_DATA) {
			this.handleContentUserUpdate(update)
		}
	}
	private handleContentUserUpdate(update: IIdAndValUpdate) {
		const contentUserId = update.id;
		const contentUserVal: IContentUserData = update.val
		const contentUserProficiency = contentUserVal.proficiency
		const contentId = getContentId({contentUserId});
		const sigmaIds = this.contentIdSigmaIdMap.get(contentId);
		sigmaIds.forEach(sigmaId => {
			const treeId = sigmaId
			this.updateParentEdgeColorLeaf({treeId, contentUserProficiency})
		})

	}

	private updateParentEdgeColorLeaf(
		{treeId, contentUserProficiency}: { treeId: id, contentUserProficiency: PROFICIENCIES }) {
		const store = this.getters.getStore()
		const sigmaGraph: ISigmaGraph = store.state.graph;
		const treeNode = sigmaGraph.nodes(treeId);
		if (!treeNode) {
			throw new Error('SigmaInstanceGraphNode with id of ' + treeNode + ' could not be found');
		}
		const edgeId = createEdgeId({
			parentId: treeNode.parentId,
			treeId,
		});
		const edge = sigmaGraph.edges(edgeId);
		if (!edge) {
			throw new Error('SigmaInstanceGraphEdge with id of ' + edgeId + ' could not be found');
		}
		const color = ProficiencyUtils.getColor(contentUserProficiency);
		edge.color = color;
	}
}

@injectable()
export class SigmaEdgesUpdaterArgs {
	@inject(TYPES.IOneToManyMap)
	@tagged(TAGS.CONTENT_ID_SIGMA_IDS_MAP, true)
	public contentIdSigmaIdMap: IOneToManyMap<string>;
	@inject(TYPES.IStoreGetters) public getters: IStoreGetters
}
