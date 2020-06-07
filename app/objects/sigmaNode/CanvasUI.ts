// tslint:disable max-classes-per-file

import {
	inject,
	injectable,
	tagged
} from 'inversify';
import {
	ISigmaEdgesUpdater,
	ISigmaNodesUpdater,
	ISubscribable,
	ITypeAndIdAndValUpdate,
	IUI
} from '../interfaces';
import {TYPES} from '../types';
import {TAGS} from '../tags';

@injectable()
export class CanvasUI implements IUI {
	private sigmaNodesUpdater: ISigmaNodesUpdater;
	private sigmaEdgesUpdater: ISigmaEdgesUpdater;

	constructor(@inject(TYPES.CanvasUIArgs){sigmaNodesUpdater, sigmaEdgesUpdater}: CanvasUIArgs) {
		this.sigmaNodesUpdater = sigmaNodesUpdater;
		this.sigmaEdgesUpdater = sigmaEdgesUpdater;
	}

	public subscribe(obj: ISubscribable<ITypeAndIdAndValUpdate>) {
		const updateNodes = this.sigmaNodesUpdater.handleValueUpdate.bind(this.sigmaNodesUpdater);
		const updateEdges = this.sigmaEdgesUpdater.handleUpdate.bind(this.sigmaEdgesUpdater);
		obj.onUpdate(updateNodes); // TODO: i'm pretty sure all the new edge logic is handled in nodesUpdater rather than edges updater. need to fix this
		obj.onUpdate(updateEdges);
	}
}

@injectable()
export class CanvasUIArgs {
	@inject(TYPES.ISigmaNodesUpdater)
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	public sigmaNodesUpdater;
	@inject(TYPES.ISigmaEdgesUpdater)
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	public sigmaEdgesUpdater;
}
