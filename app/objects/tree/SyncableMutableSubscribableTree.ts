// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IDbValable,
    IDetailedUpdates, IHash,
    ISubscribable,
    ISyncableMutableSubscribableTree,
    IValable,
} from '../interfaces';
import {MutableSubscribableTree} from './MutableSubscribableTree';

@injectable()
export class SyncableMutableSubscribableTree
    extends MutableSubscribableTree implements ISyncableMutableSubscribableTree {
    public getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IDbValable> {
        return {
            contentId: this.contentId,
            parentId: this.parentId,
            children: this.children,
        }
    }
}
