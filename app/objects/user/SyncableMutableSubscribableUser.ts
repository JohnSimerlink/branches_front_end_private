// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IDbValable,
    IDetailedUpdates, IHash,
    ISubscribable,
    ISyncableMutableSubscribableUser, IValable,
} from '../interfaces';
import {MutableSubscribableUser} from './MutableSubscribableUser';

@injectable()
export class SyncableMutableSubscribableUser
    extends MutableSubscribableUser implements ISyncableMutableSubscribableUser {
    public getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IDbValable> {
        return {
            membershipExpirationDate: this.membershipExpirationDate,
            everActivatedMembership: this.everActivatedMembership,
            points: this.points,
            currentHoveredTreeId: this.currentHoveredTreeId,
            rootMapId: this.rootMapId,
            openMapId: this.openMapId,
            userInfo: this.userInfo,
        };
    }
}
