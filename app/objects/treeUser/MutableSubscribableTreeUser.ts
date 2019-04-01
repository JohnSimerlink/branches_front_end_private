// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {
	inject,
	injectable
} from 'inversify';
import {
	FieldMutationTypes,
	IDatedMutation,
	IMutableSubscribableTreeUser,
	IProppedDatedMutation,
	TreeUserPropertyMutationTypes,
	TreeUserPropertyNames
} from '../interfaces';
import {TYPES} from '../types';
import {SubscribableTreeUser} from './SubscribableTreeUser';

@injectable()
export class MutableSubscribableTreeUser extends SubscribableTreeUser implements IMutableSubscribableTreeUser {

	// TODO: should the below three objects be private?
	constructor(@inject(TYPES.SubscribableTreeUserArgs) {
		updatesCallbacks, proficiencyStats, aggregationTimer
	}) {
		super({
			updatesCallbacks,
			proficiencyStats,
			aggregationTimer
		});
	}

	public addMutation(mutation: IProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames>
										 // TODO: this lack of typesafety between propertyName and MutationType is concerning
	): void {
		const propertyName: TreeUserPropertyNames = mutation.propertyName;
		const propertyMutation: IDatedMutation<TreeUserPropertyMutationTypes> = {
			data: mutation.data,
			timestamp: mutation.timestamp,
			type: mutation.type,
		};
		switch (propertyName) {
			case TreeUserPropertyNames.PROFICIENCY_STATS:
				this.proficiencyStats.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
				break;
			case TreeUserPropertyNames.AGGREGATION_TIMER:
				this.aggregationTimer.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
				break;
			default:
				throw new TypeError(
					propertyName + JSON.stringify(mutation)
					+ ' does not exist as a property ');
		}
	}

	public mutations(): Array<IProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames>> {
		throw new Error('Not Implemented!');
	}
}
