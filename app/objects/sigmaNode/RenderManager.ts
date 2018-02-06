import {inject, injectable} from 'inversify';
import {
    IRenderedNodesManager, IRenderedNodesManagerCore, ISigmaRenderUpdate, ISubscribable, RenderUpdateTypes,
} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class RenderedNodesManager implements IRenderedNodesManager {
    private renderedNodesManagerCore: IRenderedNodesManagerCore
    constructor(@inject(TYPES.RenderedNodesManagerArgs){renderedNodesManagerCore}: RenderedNodesManagerArgs) {
        this.renderedNodesManagerCore =  renderedNodesManagerCore
    }
    public subscribe(obj: ISubscribable<ISigmaRenderUpdate>) {
        const me = this
        obj.onUpdate(update => {
            switch (update.type) {
                case RenderUpdateTypes.NEW_NODE:
                    me.renderedNodesManagerCore.addNodeToRenderList(update.sigmaNodeIdToRender)
                    break;
                case RenderUpdateTypes.NEW_EDGE:
                    me.renderedNodesManagerCore.addEdgeToRenderList(update.sigmaEdgeIdToRender)
                    break;
            }
        })
    }
}
@injectable()
export class RenderedNodesManagerArgs {
    @inject(TYPES.IRenderedNodesManagerCore) public renderedNodesManagerCore: IRenderedNodesManagerCore
}
