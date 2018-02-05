import {id, ISigmaEdgeData, ISigmaEdgesUpdater, ISigmaEdgeUpdater} from '../interfaces';
import {Store} from 'vuex';
import {TYPES} from '../types';
import {inject, injectable} from 'inversify';
import {createEdgeId} from './sigmaEdge';
import {ProficiencyUtils} from '../proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';

@injectable()
export class SigmaEdgesUpdater implements ISigmaEdgesUpdater {
    private store: Store<any>

    constructor(@inject(TYPES.SigmaEdgesUpdaterArgs){store}: SigmaEdgesUpdaterArgs) {
        this.store = store
    }
    public updateParentEdgeColorLeaf(
        {treeId, contentUserProficiency}: {treeId: id, contentUserProficiency: PROFICIENCIES}) {
        const sigmaGraph = this.store.getters.sigmaGraph
        const treeNode = sigmaGraph.nodes(treeId)
        if (!treeNode) {
            throw new Error('SigmaInstanceGraphNode with id of ' + treeNode + ' could not be found')
        }
        const edgeId = createEdgeId({
            parentId: treeNode.parentId,
            treeId,
        })
        const edge = sigmaGraph.edges(edgeId)
        if (!edge) {
            throw new Error('SigmaInstanceGraphEdge with id of ' + edgeId + ' could not be found')
        }
        const color = ProficiencyUtils.getColor(contentUserProficiency)
        edge.color = color
    }
}

@injectable()
export class SigmaEdgesUpdaterArgs {
    @inject(TYPES.BranchesStore) public store: Store<any>
}
