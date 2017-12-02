// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {log} from '../../core/log'
import {
    IIdAndValUpdates, IMutableSubscribableTreeDataStore,
    ISubscribableGlobalDataStore, ITypeAndIdAndValUpdates, ObjectDataTypes
} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';

@injectable()
class SubscribableGlobalDataStore extends SubscribableCore<ITypeAndIdAndValUpdates>
implements ISubscribableGlobalDataStore {
    private update: ITypeAndIdAndValUpdates;
    protected callbackArguments(): ITypeAndIdAndValUpdates {
        // log('globaldatastore callback arguments called')
        return this.update
    }

    protected treeStore: IMutableSubscribableTreeDataStore;
    constructor(@inject(TYPES.SubscribableGlobalDataStoreArgs){treeStore, updatesCallbacks = []}) {
        super({updatesCallbacks})
        this.treeStore = treeStore
        // log('subscribableGlobalDataStore called')
    }
    public startBroadcasting() {
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
class GlobalDataStoreArgs {
    @inject(TYPES.Array) public updatesCallbacks;
    @inject(TYPES.ISubscribableTreeDataStore) public treeStore
}

export {SubscribableGlobalDataStore, GlobalDataStoreArgs, ISubscribableGlobalDataStore}
