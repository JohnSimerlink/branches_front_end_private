// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IUserData,
    ISubscribableUser,
    ISubscribableMutableField,
    IValUpdates, timestamp,
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types'

@injectable()
export class SubscribableUser extends Subscribable<IValUpdates> implements ISubscribableUser {
    // TODO: dependeny inject the publishing field
    private publishing = false
    public membershipExpirationDate: ISubscribableMutableField<timestamp>;
    public everActivatedMembership: ISubscribableMutableField<boolean>;

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
    @inject(TYPES.ISubscribableMutableNumber) public membershipExpirationDate: ISubscribableMutableField<timestamp>
    @inject(TYPES.ISubscribableMutableBoolean) public everActivatedMembership: ISubscribableMutableField<boolean>
}
