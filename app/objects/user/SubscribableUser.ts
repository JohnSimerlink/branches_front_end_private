// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    CONTENT_TYPES,
    IUserData, ISubscribable,
    ISubscribableUser,
    ISubscribableMutableField,
    IValUpdates, timestamp,
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types'

@injectable()
export class SubscribableUser extends Subscribable<IValUpdates> implements ISubscribableUser {
    private publishing = false
    public membershipExpirationDate: ISubscribableMutableField<timestamp>;

    constructor(@inject(TYPES.SubscribableUserArgs) {
        updatesCallbacks, membershipExpirationDate
    }: SubscribableUserArgs ) {
        super({updatesCallbacks})
        this.membershipExpirationDate = membershipExpirationDate
    }
    // TODO: should the below three objects be private?
    public val(): IUserData {
        return {
            membershipExpirationDate: this.membershipExpirationDate.val(),
        }
    }
    protected callbackArguments(): IValUpdates {
        return this.val()
    }
    public startPublishing() {
        if (this.publishing) {
            return
        }
        this.publishing = true
        const boundCallCallbacks = this.callCallbacks.bind(this)
        this.membershipExpirationDate.onUpdate(boundCallCallbacks)
    }
}

@injectable()
export class SubscribableUserArgs {
    @inject(TYPES.Array) public updatesCallbacks: any[]
    @inject(TYPES.ISubscribableMutableNumber) public membershipExpirationDate: ISubscribableMutableField<timestamp>
}
