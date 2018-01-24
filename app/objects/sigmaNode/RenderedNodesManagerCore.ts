import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {IAddNodeToSigma, IRenderedNodesManagerCore, ISigmaNode} from '../interfaces';
import {TYPES} from '../types';
// import {SigmaJs} from 'sigmajs';

@injectable()
export class RenderedNodesManagerCore implements IRenderedNodesManagerCore {
    private sigmaNodes: object
    private addNodeToSigma: IAddNodeToSigma
    constructor(
        @inject(TYPES.RenderedNodesManagerCoreArgs){sigmaNodes, addNodeToSigma}: RenderedNodesManagerCoreArgs ) {
        this.sigmaNodes = sigmaNodes
        this.addNodeToSigma = addNodeToSigma
    }
    public addToRenderList(sigmaId: string) {
        const sigmaNode = this.sigmaNodes[sigmaId]
        this.addNodeToSigma(sigmaNode)
    }
}
@injectable()
export class RenderedNodesManagerCoreArgs {
    @inject(TYPES.Object) public sigmaNodes: object
    @inject(TYPES.Function) public addNodeToSigma: IAddNodeToSigma
}
