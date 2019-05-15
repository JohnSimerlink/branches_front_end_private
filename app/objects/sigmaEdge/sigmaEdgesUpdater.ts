import {
	FGetStore,
	id,
	ISigmaEdgesUpdater,
	ISigmaGraph,
	IStoreGetters
} from '../interfaces';
import {TYPES} from '../types';
import {
	inject,
	injectable
} from 'inversify';
import {createEdgeId} from './sigmaEdge';
import {ProficiencyUtils} from '../proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {log} from '../../core/log';

@injectable()
export class SigmaEdgesUpdater implements ISigmaEdgesUpdater {
	private getters: IStoreGetters;

	constructor(@inject(TYPES.SigmaEdgesUpdaterArgs){getters}: SigmaEdgesUpdaterArgs) {
		this.getters = getters;
	}

	public updateParentEdgeColorLeaf(
		{treeId, contentUserProficiency}: { treeId: id, contentUserProficiency: PROFICIENCIES }) {
		log('updateParentEdgeColor Leaf called');
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
	@inject(TYPES.IStoreGetters) public getters: IStoreGetters
}
