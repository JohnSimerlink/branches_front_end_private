// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    TreeLocationPropertyMutationTypes,
    TreeLocationPropertyNames,
    FieldMutationTypes,
    IDatedMutation, IMutableSubscribableTreeLocation, IMutableSubscribableTree,
    IProppedDatedMutation, ISubscribableTree,
    SetMutationTypes,
    TreePropertyMutationTypes, TreePropertyNames
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types'
import {SubscribableTreeLocation} from './SubscribableTreeLocation';

@injectable()
class MutableSubscribableTreeLocation extends SubscribableTreeLocation implements IMutableSubscribableTreeLocation {

    // TODO: should the below three objects be private?
    constructor(@inject(TYPES.SubscribableTreeLocationArgs) {
        updatesCallbacks, proficiencyStats, aggregationTimer
    }) {
        super({updatesCallbacks, proficiencyStats, aggregationTimer})
    }

    public addMutation(mutation: IProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames>
    // TODO: this lack of typesafety between propertyName and MutationType is concerning
    ): void {
        const propertyName: TreeLocationPropertyNames = mutation.propertyName
        const propertyMutation: IDatedMutation<TreeLocationPropertyMutationTypes> = {
            data: mutation.data,
            timestamp: mutation.timestamp,
            type: mutation.type,
        }
        switch (propertyName) {
            case TreeLocationPropertyNames.PROFICIENCY_STATS:
                this.proficiencyStats.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>)
                break
            case TreeLocationPropertyNames.AGGREGATION_TIMER:
                this.aggregationTimer.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>)
                break
            default:
                throw new TypeError(
                    propertyName + JSON.stringify(mutation)
                    + ' does not exist as a property ')
        }
    }

    public mutations(): Array<IProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames>> {
        throw new Error('Not Implemented!')
    }
}

export {MutableSubscribableTreeLocation}
