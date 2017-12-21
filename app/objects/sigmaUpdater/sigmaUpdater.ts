import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {ISigmaUpdater} from '../interfaces';
import GraphData = SigmaJs.GraphData;
import SigmaConfigs = SigmaJs.SigmaConfigs;
import Sigma = SigmaJs.Sigma;
import Graph = SigmaJs.Graph;
import Node = SigmaJs.Node
import {log} from '../../core/log'

@injectable()
export class SigmaUpdater implements ISigmaUpdater {
    private sigmaInstance: Sigma
    private graphData: GraphData
    private graph: Graph
    private initialized: boolean
    constructor(@inject(TYPES.SigmaUpdaterArgs){graphData, sigmaInstance, graph, initialized}) {
        this.sigmaInstance = sigmaInstance
        this.graph = graph
        this.graphData = graphData
        this.initialized = initialized
    }
    public refresh(): void {
        this.sigmaInstance.refresh()
    }
    public addNode(node: Node): void {
        if (this.initialized) {
            this.graph.addNode(node)
            this.refresh()
        } else {
            this.graphData.nodes.push(node) // TODO: Law of Demeter violation
        }
    }
    public initialize(): void {
        if (this.initialized) {
            return
        }
        this.sigmaInstance = new sigma({
            graph: this.graphData,
            container: 'graph-container',
            glyphScale: 0.7,
            glyphFillColor: '#666',
            glyphTextColor: 'white',
            glyphStrokeColor: 'transparent',
            glyphFont: 'FontAwesome',
            glyphFontStyle: 'normal',
            glyphTextThreshold: 6,
            glyphThreshold: 3,
            // renderers: [sigma.renderers.canvas]
        } as SigmaConfigs);

        // this.sigmaInstance.settings.font = 'Fredoka One'
        // this.sigmaInstance.renderers = [sigma.renderers.canvas]
        sigma.canvas.labels.def = sigma.canvas.labels.prioritizable
        this.graph = this.sigmaInstance.graph
    }
}

@injectable()
export class SigmaUpdaterArgs {
    @inject(TYPES.Object) public sigmaInstance: Sigma
    @inject(TYPES.Object) public graphData: GraphData
    @inject(TYPES.Object) public graph: Graph
    @inject(TYPES.Boolean) public initialized: boolean
}
