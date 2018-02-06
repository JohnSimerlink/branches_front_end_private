import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    IAddNodeToSigma, IRenderedNodesManagerCore, ISigmaEdges, ISigmaNode, ISigmaNodes,
    ISigmaUpdater
} from '../interfaces';
import {TYPES} from '../types';
// import {SigmaJs} from 'sigmajs';

@injectable()
export class RenderedNodesManagerCore implements IRenderedNodesManagerCore {
    private sigmaNodes: ISigmaNodes
    private sigmaEdges: ISigmaEdges
    private addNodeToSigma: IAddNodeToSigma
    private sigmaUpdater: ISigmaUpdater
    constructor(
        @inject(TYPES.RenderedNodesManagerCoreArgs){
            sigmaNodes, sigmaEdges, sigmaUpdater
        }: RenderedNodesManagerCoreArgs ) {
        this.sigmaNodes = sigmaNodes
        this.sigmaUpdater = sigmaUpdater
        this.sigmaEdges = sigmaEdges
        // this.addNodeToSigma = addNodeToSigma
    }
    public addNodeToRenderList(sigmaId: string) {
        const sigmaNode = this.sigmaNodes[sigmaId]
        this.sigmaUpdater.addNode((sigmaNode))
        // this.addNodeToSigma(sigmaNode)
    }
    public addEdgeToRenderList(sigmaId: string) {
        const sigmaEdge = this.sigmaEdges[sigmaId]
        this.sigmaUpdater.addEdge((sigmaEdge))
        // this.addNodeToSigma(sigmaNode)
    }
}
@injectable()
export class RenderedNodesManagerCoreArgs {
    @inject(TYPES.ISigmaNodes) public sigmaNodes: ISigmaNodes
    @inject(TYPES.ISigmaUpdater) public sigmaUpdater: ISigmaUpdater
    @inject(TYPES.ISigmaEdges) public sigmaEdges: ISigmaEdges
    // @inject(TYPES.Function) public addNodeToSigma: IAddNodeToSigma
}
