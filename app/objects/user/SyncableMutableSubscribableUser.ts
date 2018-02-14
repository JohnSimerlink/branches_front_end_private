// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IDetailedUpdates, IHash,
    ISubscribable,
    ISyncableMutableSubscribableUser, IValable,
} from '../interfaces';
import {MutableSubscribableUser} from './MutableSubscribableUser';

@injectable()
export class SyncableMutableSubscribableUser
    extends MutableSubscribableUser implements ISyncableMutableSubscribableUser {
    public getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IValable> {
        return {
            membershipExpirationDate: this.membershipExpirationDate
        }
    }
}
