// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IUserData,
    ISubscribableUser,
    IMutableSubscribableField,
    IValUpdates, timestamp,
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types'

@injectable()
export class SubscribableUser extends Subscribable<IValUpdates> implements ISubscribableUser {
    // TODO: dependeny inject the publishing field
    private publishing = false
    public membershipExpirationDate: IMutableSubscribableField<timestamp>;
    public everActivatedMembership: IMutableSubscribableField<boolean>;

    constructor(@inject(TYPES.SubscribableUserArgs) {
        updatesCallbacks,
        membershipExpirationDate,
        everActivatedMembership,
    }: SubscribableUserArgs ) {
        super({updatesCallbacks})
        this.membershipExpirationDate = membershipExpirationDate
        this.everActivatedMembership = everActivatedMembership
    }
    // TODO: should the below three objects be private?
    public val(): IUserData {
        return {
            membershipExpirationDate: this.membershipExpirationDate.val(),
            everActivatedMembership: this.everActivatedMembership.val(),
        }
    }
    public dbVal(): IUserData {
        return this.val()
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
    @inject(TYPES.IMutableSubscribableNumber) public membershipExpirationDate: IMutableSubscribableField<timestamp>
    @inject(TYPES.IMutableSubscribableBoolean) public everActivatedMembership: IMutableSubscribableField<boolean>
}
