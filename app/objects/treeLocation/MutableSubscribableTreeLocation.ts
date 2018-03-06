// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    FieldMutationTypes,
    IDatedMutation,
    IMutableSubscribableTree,
    IMutableSubscribableTreeLocation, IProppedDatedMutation, ISubscribableTree,
    PointMutationTypes, SetMutationTypes,
    TreeLocationPropertyMutationTypes,
    TreeLocationPropertyNames, TreePropertyMutationTypes, TreePropertyNames
} from '../interfaces';
import {TYPES} from '../types'
import {SubscribableTreeLocation, SubscribableTreeLocationArgs} from './SubscribableTreeLocation';

@injectable()
export class MutableSubscribableTreeLocation
    extends SubscribableTreeLocation implements IMutableSubscribableTreeLocation {
    // TODO: should the below three objects be private?
    constructor(@inject(TYPES.SubscribableTreeLocationArgs) {
        updatesCallbacks, point, level, mapId
    }: SubscribableTreeLocationArgs) {
        super({updatesCallbacks, point, level, mapId})
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
            case TreeLocationPropertyNames.POINT:
                this.point.addMutation(propertyMutation as IDatedMutation<PointMutationTypes>)
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
