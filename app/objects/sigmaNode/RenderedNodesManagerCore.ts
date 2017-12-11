import {inject, injectable} from 'inversify';
import {IRenderedNodesManagerCore} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class RenderedNodesManagerCore implements IRenderedNodesManagerCore {
    private renderedNodes
    private allSigmaNodes
    constructor(@inject(TYPES.RenderedNodesManagerCoreArgs){renderedNodes, allSigmaNodes}) {
        this.renderedNodes = renderedNodes
        this.allSigmaNodes = allSigmaNodes
    }
    public addToRenderList(sigmaId: string) {
        const sigmaNode = this.allSigmaNodes[sigmaId]
        this.renderedNodes[sigmaId] = sigmaNode
    }
}
@injectable()
export class RenderedNodesManagerCoreArgs {
    @inject(TYPES.Object) public renderedNodes
    @inject(TYPES.Object) public allSigmaNodes
}
