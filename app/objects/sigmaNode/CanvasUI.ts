// tslint:disable max-classes-per-file

import {inject, injectable, tagged} from 'inversify';
import {ISigmaNodesUpdater, ITypeAndIdAndValUpdate, ISigmaNodesRemover} from '../interfaces';
import {ISubscribable, IUI} from '../interfaces';
import {TYPES} from '../types';
import {TAGS} from '../tags';

@injectable()
export class CanvasUI implements IUI {
	private sigmaNodesUpdater: ISigmaNodesUpdater;

	private sigmaNodesRemover: ISigmaNodesRemover;
	
	constructor(@inject(TYPES.CanvasUIArgs){sigmaNodesUpdater, sigmaNodesRemover}: CanvasUIArgs) {
		this.sigmaNodesUpdater = sigmaNodesUpdater;
		this.sigmaNodesRemover = sigmaNodesRemover;
	}

	public subscribe(obj: ISubscribable<ITypeAndIdAndValUpdate>) {
		const nodesUpdaterHandleUpdate = this.sigmaNodesUpdater.handleUpdate.bind(this.sigmaNodesUpdater);
		const nodesRemoverHandleUpdate = this.sigmaNodesRemover.handleUpdate.bind(this.sigmaNodesRemover);
		obj.onUpdate(nodesRemoverHandleUpdate);
		obj.onUpdate(nodesUpdaterHandleUpdate);
		
	}
}

@injectable()
export class CanvasUIArgs {
	@inject(TYPES.ISigmaNodesUpdater)
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	public sigmaNodesUpdater: ISigmaNodesUpdater;
	
	@inject(TYPES.ISigmaNodesRemover)
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	public sigmaNodesRemover: ISigmaNodesRemover;
}
