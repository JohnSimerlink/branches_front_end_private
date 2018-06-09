// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log';
import {
	IMutableSubscribablePoint,
	ISubscribableTreeLocation,
	ITreeLocationData,
	IValUpdate,
	IMutableSubscribableField,
	id,
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types';

@injectable()
export class SubscribableTreeLocation extends Subscribable<IValUpdate> implements ISubscribableTreeLocation {
	// TODO: inject the publishing variable via dependency injection into constructor.
	// this could prove useful if we store the objects (with their updatesCallbacks callbacks array) in local storage
	private publishing = false;
	public point: IMutableSubscribablePoint;
	public level: IMutableSubscribableField<number>;
	public mapId: IMutableSubscribableField<id>;

	// TODO: should the below three objects be private?
	public val(): ITreeLocationData {
		return {
			point: this.point.val(),
			level: this.level.val(),
			mapId: this.mapId.val(),
		};
	}

	constructor(@inject(TYPES.SubscribableTreeLocationArgs) {
		updatesCallbacks, point, level, mapId
	}: SubscribableTreeLocationArgs) {
		super({updatesCallbacks});
		this.point = point;
		this.level = level;
		this.mapId = mapId;
	}

	// TODO: make IValUpdate a generic that takes for example ITreeLocationData
	protected callbackArguments(): IValUpdate {
		return this.val();
	}

	public startPublishing() {
		if (this.publishing) {
			return;
		}
		this.publishing = true;
		const boundCallCallbacks = this.callCallbacks.bind(this);
		this.point.onUpdate(boundCallCallbacks);
		this.level.onUpdate(boundCallCallbacks);
		this.mapId.onUpdate(boundCallCallbacks);
	}
}

@injectable()
export class SubscribableTreeLocationArgs {
	@inject(TYPES.Array) public updatesCallbacks: Function[];
	@inject(TYPES.IMutableSubscribablePoint) public point: IMutableSubscribablePoint;
	@inject(TYPES.IMutableSubscribableNumber) public level: IMutableSubscribableField<number>;
	@inject(TYPES.IMutableSubscribableString) public mapId: IMutableSubscribableField<id>;
}
