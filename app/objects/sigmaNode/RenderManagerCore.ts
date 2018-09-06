import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log';
import {IAddNodeToSigma, IRenderManagerCore, ISigmaEdges, ISigmaNodes, ISigmaUpdater} from '../interfaces';
import {TYPES} from '../types';

// import {SigmaJs} from 'sigmajs';

@injectable()
export class RenderManagerCore implements IRenderManagerCore {
	private sigmaNodes: ISigmaNodes;
	private sigmaEdges: ISigmaEdges;
	private addNodeToSigma: IAddNodeToSigma;
	private sigmaUpdater: ISigmaUpdater;

	constructor(
		@inject(TYPES.RenderedNodesManagerCoreArgs){
			sigmaNodes, sigmaEdges, sigmaUpdater
		}: RenderManagerCoreArgs) {
		this.sigmaNodes = sigmaNodes;
		this.sigmaUpdater = sigmaUpdater;
		this.sigmaEdges = sigmaEdges;
		// this.addNodeToSigma = addNodeToSigma
	}
	public removeNode(sigmaId:string) {
		const sigmaNode = this.sigmaNodes[sigmaId];
		this.sigmaUpdater.removeNode((sigmaNode));
	}
	// TODO: have these methods just receive the actual edge themselves maybe,
	// rather than only receiving an id and having to grab them from a data member
	public addNodeToRenderList(sigmaId: string) {
		const sigmaNode = this.sigmaNodes[sigmaId];
		this.sigmaUpdater.addNode((sigmaNode));
		// this.addNodeToSigma(sigmaNode)
	}

	public addEdgesToRenderList(edgeIds: string[]) {
		const edges = [];
		for (const id of edgeIds) {
			const edge = this.sigmaEdges[id];
			if (!edge) {
				throw new Error('edge with id of ' + id +
					' does not exist in sigma edges. We can not render this edge');
			}
			edges.push(edge);
		}
		this.sigmaUpdater.addEdges((edges));
		// this.addNodeToSigma(sigmaNode)
	}
}

@injectable()
export class RenderManagerCoreArgs {
	@inject(TYPES.ISigmaNodes) public sigmaNodes: ISigmaNodes;
	@inject(TYPES.ISigmaUpdater) public sigmaUpdater: ISigmaUpdater;
	@inject(TYPES.ISigmaEdges) public sigmaEdges: ISigmaEdges;
	// @inject(TYPES.Function) public addNodeToSigma: IAddNodeToSigma
}
