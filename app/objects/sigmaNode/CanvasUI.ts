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
		const handleUpdate = this.sigmaNodesUpdater.handleUpdate.bind(this.sigmaNodesUpdater);
		const handleUpdate2 = this.sigmaEdgesUpdater.handleUpdate.bind(this.sigmaEdgesUpdater);
		obj.onUpdate(handleUpdate);
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
