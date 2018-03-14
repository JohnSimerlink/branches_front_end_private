import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {ISigmaEdgeData, ISigmaNodeData, ISigmaUpdater} from '../interfaces';
// import GraphData = SigmaJs.GraphData;
// import SigmaConfigs = SigmaJs.SigmaConfigs;
// import Sigma = SigmaJs.Sigma;
// import Graph = SigmaJs.Graph;
// import Node = SigmaJs.Node
import {error, log} from '../../core/log';
import {MUTATION_NAMES} from '../../core/store';
import {Store} from 'vuex';

// import {SigmaJs} from 'sigmajs';

@injectable()
export class SigmaUpdater implements ISigmaUpdater {
    private store: Store<any>; // : BranchesStore // : Graph
    // private refresh: () => void
    // private focusNode: (node: Node) => void
    constructor(@inject(TYPES.SigmaUpdaterArgs){store}: SigmaUpdaterArgs) {
        this.store = store;
        // this.refresh = refresh
        // this.graph = graph
        // this.focusNode = focusNode
    }
    public addNode(node: ISigmaNodeData): void {
        this.store.commit(MUTATION_NAMES.ADD_NODE, {node});
        /* TODO: LOL. DO i even need this class any more? seems like maybe an uncessary level of indirection.
         unless i actually am going to use the stuff I am commenting out
          */
        // this.graph.addNode(node)
        // this.focusNode(node)
        // this.refresh()
    }

    public addEdges(edges: ISigmaEdgeData[]): void {
        this.store.commit(MUTATION_NAMES.ADD_EDGES, {edges});
        // throw new Error('Method not implemented.');
    }

}

@injectable()
export class SigmaUpdaterArgs {
    // @inject(TYPES.Function) public refresh: () => void
    // @inject(TYPES.Function) public focusNode: (node: Node) => void
    @inject(TYPES.BranchesStore) public store: Store<any>; // : Graph
}

// function focusNode(camera, node) {
//     const cameraCoord = {
//         x: node['read_cam0:x'],
//         y: node['read_cam0:y'],
//         ratio: 0.20
//     };
//     camera.goTo(cameraCoord);
// }
