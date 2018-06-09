// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
	IBranchesMapData,
	ISubscribableBranchesMap,
	IMutableSubscribableField,
	IValUpdate, timestamp, id,
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types';
import {log} from '../../core/log';

@injectable()
export class SubscribableBranchesMap extends Subscribable<IValUpdate> implements ISubscribableBranchesMap {
	// TODO: dependeny inject the publishing field
	private publishing = false;
	public rootTreeId: IMutableSubscribableField<id>;

	constructor(@inject(TYPES.SubscribableBranchesMapArgs) {
		updatesCallbacks,
		rootTreeId
	}: SubscribableBranchesMapArgs) {
		super({updatesCallbacks});
		this.rootTreeId = rootTreeId;
	}

	// TODO: should the below three objects be private?
	public val(): IBranchesMapData {
		return {
			rootTreeId: this.rootTreeId.val(),
		};
	}

	protected callbackArguments(): IValUpdate {
		return this.val();
	}

	public startPublishing() {
		if (this.publishing) {
			return;
		}
		this.publishing = true;
		const boundCallCallbacks = this.callCallbacks.bind(this);
		this.rootTreeId.onUpdate(boundCallCallbacks);
	}
}

@injectable()
export class SubscribableBranchesMapArgs {
	@inject(TYPES.Array) public updatesCallbacks: any[];
	@inject(TYPES.IMutableSubscribableNumber) public rootTreeId: IMutableSubscribableField<id>;
}
