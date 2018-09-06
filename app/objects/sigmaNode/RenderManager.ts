import {inject, injectable} from 'inversify';
import {IRenderManager, IRenderManagerCore, ISigmaRenderUpdate, ISubscribable, RenderUpdateTypes,} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class RenderManager implements IRenderManager {
	private renderManagerCore: IRenderManagerCore;

	constructor(@inject(TYPES.RenderedNodesManagerArgs){renderManagerCore}: RenderManagerArgs) {
		this.renderManagerCore = renderManagerCore;
	}

	public subscribe(obj: ISubscribable<ISigmaRenderUpdate>) {
		const me = this;
		console.log("renderManagerSubcribeCalled",obj)
		obj.onUpdate(update => {
			switch (update.type) {
				case RenderUpdateTypes.NEW_NODE:
					me.renderManagerCore.addNodeToRenderList(update.sigmaNodeIdToRender);
					break;
				case RenderUpdateTypes.NEW_EDGE:
					me.renderManagerCore.addEdgesToRenderList(update.sigmaEdgeIdsToRender);
					break;
				case RenderUpdateTypes.REMOVE_NODE:
					me.renderManagerCore.removeNode(update.sigmaId);
					break;
			}
		});
	}
}

@injectable()
export class RenderManagerArgs {
	@inject(TYPES.IRenderManagerCore) public renderManagerCore: IRenderManagerCore;
}
