// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {injectable} from 'inversify';
import {
    IDetailedUpdates, IHash,
    ISubscribable, ISyncableMutableSubscribableContentUser, IValable,
} from '../interfaces';
import {log} from '../../core/log'
import {MutableSubscribableContentUser} from './MutableSubscribableContentUser';
@injectable()
export class SyncableMutableSubscribableContentUser
    extends MutableSubscribableContentUser implements ISyncableMutableSubscribableContentUser {
    public getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IValable> {
        return {
            overdue: this.overdue,
            timer: this.timer,
            lastRecordedStrength: this.lastRecordedStrength,
            proficiency: this.proficiency,
        }
    }
    // TODO: should the below three objects be private?
}
