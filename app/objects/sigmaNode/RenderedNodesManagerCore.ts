import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {IAddNodeToSigma, IRenderedNodesManagerCore, ISigmaNode, ISigmaUpdater} from '../interfaces';
import {TYPES} from '../types';
// import {SigmaJs} from 'sigmajs';

@injectable()
export class RenderedNodesManagerCore implements IRenderedNodesManagerCore {
    private sigmaNodes: object
    private addNodeToSigma: IAddNodeToSigma
    private sigmaUpdater: ISigmaUpdater
    constructor(
        @inject(TYPES.RenderedNodesManagerCoreArgs){
            sigmaNodes, sigmaUpdater
        }: RenderedNodesManagerCoreArgs ) {
        this.sigmaNodes = sigmaNodes
        this.sigmaUpdater = sigmaUpdater
        // this.addNodeToSigma = addNodeToSigma
    }
    public addToRenderList(sigmaId: string) {
        const sigmaNode = this.sigmaNodes[sigmaId]
        this.sigmaUpdater.addNode((sigmaNode))
        // this.addNodeToSigma(sigmaNode)
    }
}
@injectable()
export class RenderedNodesManagerCoreArgs {
    @inject(TYPES.Object) public sigmaNodes: object
    @inject(TYPES.ISigmaUpdater) public sigmaUpdater: ISigmaUpdater
    // @inject(TYPES.Function) public addNodeToSigma: IAddNodeToSigma
}
