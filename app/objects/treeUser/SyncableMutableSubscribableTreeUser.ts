// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IDetailedUpdates, IHash,
    ISubscribable,
    ISyncableMutableSubscribableTree, ISyncableMutableSubscribableTreeUser,
    IValable,
} from '../interfaces';
import {MutableSubscribableTreeUser} from './MutableSubscribableTreeUser';

@injectable()
export class SyncableMutableSubscribableTreeUser
    extends MutableSubscribableTreeUser implements ISyncableMutableSubscribableTreeUser {
    public getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IValable> {
        return {
            proficiencyStats: this.proficiencyStats,
            aggregationTimer: this.aggregationTimer,
        }
    }
}
