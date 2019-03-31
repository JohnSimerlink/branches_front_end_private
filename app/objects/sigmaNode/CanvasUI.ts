// tslint:disable max-classes-per-file

import {
	inject,
	injectable,
	tagged
} from 'inversify';
import {
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

	constructor(@inject(TYPES.CanvasUIArgs){sigmaNodesUpdater}: CanvasUIArgs) {
		this.sigmaNodesUpdater = sigmaNodesUpdater;
	}

	public subscribe(obj: ISubscribable<ITypeAndIdAndValUpdate>) {
		const handleUpdate = this.sigmaNodesUpdater.handleUpdate.bind(this.sigmaNodesUpdater);
		obj.onUpdate(handleUpdate);
	}
}

@injectable()
export class CanvasUIArgs {
	@inject(TYPES.ISigmaNodesUpdater)
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	public sigmaNodesUpdater;
}
