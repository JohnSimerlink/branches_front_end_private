import {inject, injectable} from 'inversify';
import {
    IRenderedNodesManager, IRenderedNodesManagerCore, ISigmaIdToRender, ISubscribable,
} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class RenderedNodesManager implements IRenderedNodesManager {
    private renderedNodesManagerCore: IRenderedNodesManagerCore
    constructor(@inject(TYPES.RenderedNodesManagerArgs){renderedNodesManagerCore}) {
        this.renderedNodesManagerCore =  renderedNodesManagerCore
    }
    public subscribe(obj: ISubscribable<ISigmaIdToRender>) {
        obj.onUpdate(this.renderedNodesManagerCore.addToRenderList.bind(this))
    }
}
@injectable()
export class RenderedNodesManagerArgs {
    @inject(TYPES.IRenderedNodesManagerCore) public renderedNodesManagerCore: IRenderedNodesManagerCore
}
