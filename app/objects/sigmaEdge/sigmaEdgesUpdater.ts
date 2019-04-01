import {
	FGetStore,
	id,
	ISigmaEdgesUpdater
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
	private getStore: FGetStore;

	constructor(@inject(TYPES.SigmaEdgesUpdaterArgs){getStore}: SigmaEdgesUpdaterArgs) {
		this.getStore = getStore;
	}

	public updateParentEdgeColorLeaf(
		{treeId, contentUserProficiency}: { treeId: id, contentUserProficiency: PROFICIENCIES }) {
		log('updateParentEdgeColor Leaf called');
		const store = this.getStore()
		const sigmaGraph = store.getters.sigmaGraph;
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
	@inject(TYPES.fGetStore) public getStore: FGetStore
}
