// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {injectable} from 'inversify';
import {
    IDbValable,
    IDetailedUpdates,
    IHash,
    ISubscribable,
    ISyncableMutableSubscribableBranchesMap,
} from '../interfaces';
import {MutableSubscribableBranchesMap} from './MutableSubscribableBranchesMap';

@injectable()
export class SyncableMutableSubscribableBranchesMap
    extends MutableSubscribableBranchesMap implements ISyncableMutableSubscribableBranchesMap {
    public getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IDbValable> {
        return {
            rootTreeId: this.rootTreeId,
        };
    }
}
