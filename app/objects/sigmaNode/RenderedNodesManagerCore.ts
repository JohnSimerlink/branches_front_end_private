import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {IRenderedNodesManagerCore, ISigmaNode} from '../interfaces';
import {TYPES} from '../types';
// import {SigmaJs} from 'sigmajs';

@injectable()
export class RenderedNodesManagerCore implements IRenderedNodesManagerCore {
    private sigmaNodes
    private addNodeToSigma: (node: /* SigmaJs.Node & */ ISigmaNode) => void
    constructor(@inject(TYPES.RenderedNodesManagerCoreArgs){sigmaNodes, addNodeToSigma}) {
        this.sigmaNodes = sigmaNodes
        this.addNodeToSigma = addNodeToSigma
    }
    public addToRenderList(sigmaId: string) {
        log('RenderedNodesManagerCore addtoRenderList: ' + sigmaId)
        const sigmaNode = this.sigmaNodes[sigmaId]
        this.addNodeToSigma(sigmaNode)
    }
}
@injectable()
export class RenderedNodesManagerCoreArgs {
    @inject(TYPES.Object) public sigmaNodes
    @inject(TYPES.Function) public addNodeToSigma
}
