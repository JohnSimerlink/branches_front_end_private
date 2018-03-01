// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IDbValable,
    IDetailedUpdates, IHash,
    ISubscribable,
    ISyncableMutableSubscribableTreeLocation,
    IValable,
} from '../interfaces';
import {MutableSubscribableTreeLocation} from './MutableSubscribableTreeLocation';

@injectable()
export class SyncableMutableSubscribableTreeLocation
    extends MutableSubscribableTreeLocation implements ISyncableMutableSubscribableTreeLocation {
    public getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IDbValable> {
        return {
            point: this.point,
            level: this.level, // TODO: Make it where I don't have to manually define the properties. . .
            // And I can just define an branchesMap with certain properties and then define a syncer for that branchesMap
            // and everything just gets synced without all this set up . . .
        }
    }
}
