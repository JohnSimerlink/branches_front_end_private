// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IUserData,
    ISubscribableUser,
    IMutableSubscribableField,
    IValUpdate, timestamp, id,
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types';
import * as firebase from 'firebase';

@injectable()
export class SubscribableUser extends Subscribable<IValUpdate> implements ISubscribableUser {
    // TODO: dependeny inject the publishing field
    private publishing = false;
    public membershipExpirationDate: IMutableSubscribableField<timestamp>;
    public everActivatedMembership: IMutableSubscribableField<boolean>;
    public points: IMutableSubscribableField<number>;
    public rootMapId: IMutableSubscribableField<id>;
    public openMapId: IMutableSubscribableField<id>;
    public currentHoveredTreeId: IMutableSubscribableField<id>;
    public userInfo: IMutableSubscribableField<firebase.UserInfo>;
    constructor(@inject(TYPES.SubscribableUserArgs) {
        updatesCallbacks,
        membershipExpirationDate,
        everActivatedMembership,
        points,
        rootMapId,
        openMapId,
        currentHoveredTreeId,
        userInfo,
    }: SubscribableUserArgs ) {
        super({updatesCallbacks});
        this.membershipExpirationDate = membershipExpirationDate;
        this.everActivatedMembership = everActivatedMembership;
        this.points = points;
        this.rootMapId = rootMapId;
        this.openMapId = openMapId;
        this.currentHoveredTreeId = currentHoveredTreeId;
        this.userInfo = userInfo;
    }
    // TODO: should the below three objects be private?
    public val(): IUserData {
        return {
            membershipExpirationDate: this.membershipExpirationDate.val(),
            everActivatedMembership: this.everActivatedMembership.val(),
            points: this.points.val(),
            rootMapId: this.rootMapId.val(),
            openMapId: this.openMapId.val(),
            currentHoveredTreeId: this.currentHoveredTreeId.val(),
            userInfo: this.userInfo.val(),
        };
    }
    protected callbackArguments(): IValUpdate {
        return this.val();
    }
    public startPublishing() {
        if (this.publishing) {
            return;
        }
        this.publishing = true;
        const boundCallCallbacks = this.callCallbacks.bind(this);
        this.membershipExpirationDate.onUpdate(boundCallCallbacks);
        this.everActivatedMembership.onUpdate(boundCallCallbacks);
        this.points.onUpdate(boundCallCallbacks);
        this.openMapId.onUpdate(boundCallCallbacks);
        this.rootMapId.onUpdate(boundCallCallbacks);
        this.currentHoveredTreeId.onUpdate(boundCallCallbacks);
    }
}

@injectable()
export class SubscribableUserArgs {
    @inject(TYPES.Array) public updatesCallbacks: any[];
    @inject(TYPES.IMutableSubscribableNumber) public membershipExpirationDate: IMutableSubscribableField<timestamp>;
    @inject(TYPES.IMutableSubscribableBoolean) public everActivatedMembership: IMutableSubscribableField<boolean>;
    @inject(TYPES.IMutableSubscribableNumber) public points: IMutableSubscribableField<number>;
    @inject(TYPES.IMutableSubscribableString) public rootMapId: IMutableSubscribableField<id>;
    @inject(TYPES.IMutableSubscribableString) public openMapId: IMutableSubscribableField<id>;
    @inject(TYPES.IMutableSubscribableString) public currentHoveredTreeId: IMutableSubscribableField<id>;
    @inject(TYPES.IMutableSubscribableUserInfo) public userInfo: IMutableSubscribableField<firebase.UserInfo>;
}
