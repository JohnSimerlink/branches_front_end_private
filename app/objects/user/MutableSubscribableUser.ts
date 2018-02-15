// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    UserPropertyMutationTypes,
    UserPropertyNames, FieldMutationTypes,
    IDatedMutation, IMutableSubscribableUser,
    IProppedDatedMutation,
    ISubscribableUser, SetMutationTypes
} from '../interfaces';
import {TYPES} from '../types'
import {SubscribableUser, SubscribableUserArgs} from './SubscribableUser';

@injectable()
export class MutableSubscribableUser extends SubscribableUser implements IMutableSubscribableUser {

    // TODO: should the below three objects be private?
    constructor(@inject(TYPES.SubscribableUserArgs) {
        updatesCallbacks,
        membershipExpirationDate,
        everActivatedMembership
    }: SubscribableUserArgs) {
        super({updatesCallbacks, membershipExpirationDate, everActivatedMembership})
    }

    public addMutation(mutation: IProppedDatedMutation<UserPropertyMutationTypes, UserPropertyNames>
                       // TODO: this lack of typesafety between propertyName and MutationType is concerning
    ): void {
        const propertyName: UserPropertyNames = mutation.propertyName
        const propertyMutation: IDatedMutation<UserPropertyMutationTypes> = {
            data: mutation.data,
            timestamp: mutation.timestamp,
            type: mutation.type,
        }
        switch (propertyName) {
            case UserPropertyNames.MEMBERSHIP_EXPIRATION_DATE:
                this.membershipExpirationDate.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>)
                break;
            default:
                throw new TypeError(
                    propertyName + JSON.stringify(mutation)
                    + ' does not exist as a property. The allowed propertyNames are '
                    + UserPropertyNames.MEMBERSHIP_EXPIRATION_DATE)
        }
    }

    public mutations(): Array<IProppedDatedMutation<UserPropertyMutationTypes, UserPropertyNames>> {
        throw new Error('Not Implemented!')
    }
}
