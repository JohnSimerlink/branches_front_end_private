import {inject, injectable} from 'inversify';
import {
    IRenderedNodesManager, IRenderedNodesManagerCore, ISigmaIdToRender, ISubscribable,
} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class RenderedNodesManager implements IRenderedNodesManager {
    private renderedNodesManagerCore: IRenderedNodesManagerCore
    constructor(@inject(TYPES.RenderedNodesManagerArgs){renderedNodesManagerCore}: RenderedNodesManagerArgs) {
        this.renderedNodesManagerCore =  renderedNodesManagerCore
    }
    public subscribe(obj: ISubscribable<ISigmaIdToRender>) {
        const me = this
        obj.onUpdate(update => {
            me.renderedNodesManagerCore.addToRenderList(update.sigmaIdToRender)
        })
    }
}
@injectable()
export class RenderedNodesManagerArgs {
    @inject(TYPES.IRenderedNodesManagerCore) public renderedNodesManagerCore: IRenderedNodesManagerCore
}
