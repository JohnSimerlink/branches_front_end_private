// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {log} from '../../core/log'
import {
    IIdAndValUpdates, IMutableSubscribableTreeStore,
    ISubscribableGlobalStore, ITypeAndIdAndValUpdates, ObjectDataTypes
} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';

@injectable()
class SubscribableGlobalStore extends SubscribableCore<ITypeAndIdAndValUpdates>
implements ISubscribableGlobalStore {
    private update: ITypeAndIdAndValUpdates;
    protected callbackArguments(): ITypeAndIdAndValUpdates {
        // log('globaldatastore callback arguments called')
        return this.update
    }

    protected treeStore: IMutableSubscribableTreeStore;
    constructor(@inject(TYPES.SubscribableGlobalStoreArgs){treeStore, updatesCallbacks = []}) {
        super({updatesCallbacks})
        this.treeStore = treeStore
        // log('subscribableGlobalStore called')
    }
    public startPublishing() {
        const me = this
        this.treeStore.onUpdate((update: IIdAndValUpdates) => {
            me.update = {
                type: ObjectDataTypes.TREE_DATA,
                ...update
            }
            me.callCallbacks()
        })

    }
}

@injectable()
class GlobalStoreArgs {
    @inject(TYPES.Array) public updatesCallbacks;
    @inject(TYPES.ISubscribableTreeStore) public treeStore
}

export {SubscribableGlobalStore, GlobalStoreArgs, ISubscribableGlobalStore}
