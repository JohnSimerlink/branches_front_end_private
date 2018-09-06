import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {ISigmaEdgeData, ISigmaNodeData, ISigmaUpdater} from '../interfaces';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {error, log} from '../../core/log';
import {Store} from 'vuex';

@injectable()
export class SigmaUpdater implements ISigmaUpdater {
	private store: Store<any>; // : BranchesStore // : Graph
	constructor(@inject(TYPES.SigmaUpdaterArgs){store}: SigmaUpdaterArgs) {
		this.store = store;
	}

	public addNode(node: ISigmaNodeData): void {
		this.store.commit(MUTATION_NAMES.ADD_NODE, {node});
		/* TODO: LOL. DO i even need this class any more? seems like maybe an uncessary level of indirection.
		 unless i actually am going to use the stuff I am commenting out
			*/
	}
	public removeNode(node: ISigmaNodeData): void {
		this.store.commit(MUTATION_NAMES.REMOVE_NODE_UI, {node});
	}
	public addEdges(edges: ISigmaEdgeData[]): void {
		this.store.commit(MUTATION_NAMES.ADD_EDGES, {edges});
	}

}

@injectable()
export class SigmaUpdaterArgs {
	@inject(TYPES.BranchesStore) public store: Store<any>; // : Graph
}
