// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {
	inject,
	injectable
} from 'inversify';
import {
	BranchesMapPropertyMutationTypes,
	BranchesMapPropertyNames,
	IDatedMutation,
	IMutableSubscribableBranchesMap,
	IProppedDatedMutation
} from '../interfaces';
import {TYPES} from '../types';
import {
	SubscribableBranchesMap,
	SubscribableBranchesMapArgs
} from './SubscribableBranchesMap';

@injectable()
export class MutableSubscribableBranchesMap extends SubscribableBranchesMap implements IMutableSubscribableBranchesMap {

	// TODO: should the below three objects be private?
	constructor(@inject(TYPES.SubscribableBranchesMapArgs) {
		updatesCallbacks,
		rootTreeId
	}: SubscribableBranchesMapArgs) {
		super({
			updatesCallbacks,
			rootTreeId
		});
	}

	public addMutation(mutation: IProppedDatedMutation<BranchesMapPropertyMutationTypes, BranchesMapPropertyNames>
										 // TODO: this lack of typesafety between propertyName and MutationType is concerning
	): void {
		const propertyName: BranchesMapPropertyNames = mutation.propertyName;
		const propertyMutation: IDatedMutation<BranchesMapPropertyMutationTypes> = {
			data: mutation.data,
			timestamp: mutation.timestamp,
			type: mutation.type,
		};
		switch (propertyName) {
			default:
				throw new TypeError(
					propertyName + JSON.stringify(mutation)
					+ ' does not exist as a property. The allowed propertyNames are '
					+ BranchesMapPropertyNames);
		}
	}

	public mutations(): Array<IProppedDatedMutation<BranchesMapPropertyMutationTypes, BranchesMapPropertyNames>> {
		throw new Error('Not Implemented!');
	}
}
