import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {ISigmaUpdater} from '../interfaces';
// import GraphData = SigmaJs.GraphData;
// import SigmaConfigs = SigmaJs.SigmaConfigs;
// import Sigma = SigmaJs.Sigma;
// import Graph = SigmaJs.Graph;
// import Node = SigmaJs.Node
import {log, error} from '../../core/log'
// import {SigmaJs} from 'sigmajs';

@injectable()
export class SigmaUpdater implements ISigmaUpdater {
    private graph // : Graph
    private refresh: () => void
    constructor(@inject(TYPES.SigmaUpdaterArgs){refresh, graph}) {
        this.refresh = refresh
        log('the refresh function passed into sigmaUpdater is', refresh)
        this.graph = graph
        log('sigmaUpdater created')
    }
    public addNode(node: Node): void {
        this.graph.addNode(node)
        log('sigmaUpdater.addNode about to get CALLED!', this.refresh)
        this.refresh()
    }
}

@injectable()
export class SigmaUpdaterArgs {
    @inject(TYPES.Function) public refresh: () => void
    @inject(TYPES.Object) public graph // : Graph
}

// function focusNode(camera, node) {
//     const cameraCoord = {
//         x: node['read_cam0:x'],
//         y: node['read_cam0:y'],
//         ratio: 0.20
//     };
//     camera.goTo(cameraCoord);
// }
