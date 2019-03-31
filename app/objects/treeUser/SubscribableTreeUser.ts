// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {
	inject,
	injectable
} from 'inversify';
import {
	IMutableSubscribableField,
	IProficiencyStats,
	ISubscribableTreeUser,
	ITreeUserData,
	IValUpdate,
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types';

@injectable()
export class SubscribableTreeUser extends Subscribable<IValUpdate> implements ISubscribableTreeUser {
	public proficiencyStats: IMutableSubscribableField<IProficiencyStats>;
	public aggregationTimer: IMutableSubscribableField<number>;
	private publishing = false;

	constructor(@inject(TYPES.SubscribableTreeUserArgs) {
		updatesCallbacks, proficiencyStats, aggregationTimer
	}: SubscribableTreeUserArgs) {
		super({updatesCallbacks});
		this.proficiencyStats = proficiencyStats;
		this.aggregationTimer = aggregationTimer;
	}

	// TODO: should the below three objects be private?
	public val(): ITreeUserData {
		return {
			proficiencyStats: this.proficiencyStats.val(),
			aggregationTimer: this.aggregationTimer.val(),
		};
	}

	public startPublishing() {
		if (this.publishing) {
			return;
		}
		this.publishing = true;
		const boundCallCallbacks = this.callCallbacks.bind(this);
		this.proficiencyStats.onUpdate(boundCallCallbacks);
		this.aggregationTimer.onUpdate(boundCallCallbacks);
	}

	// TODO: make IValUpdate a generic that takes for example ITreeUserData
	protected callbackArguments(): IValUpdate {
		return this.val();
	}
}

@injectable()
export class SubscribableTreeUserArgs {
	@inject(TYPES.Array) public updatesCallbacks;
	@inject(TYPES.IMutableSubscribableProficiencyStats)
	public proficiencyStats: IMutableSubscribableField<IProficiencyStats>;
	@inject(TYPES.IMutableSubscribableNumber) public aggregationTimer: IMutableSubscribableField<number>;
}
