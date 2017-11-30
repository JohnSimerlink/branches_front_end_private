// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IIdAndValUpdates, ITypeAndIdAndValUpdates} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';
import {ObjectTypes} from './ObjectTypes';

@injectable()
class SubscribableGlobalDataStore extends SubscribableCore<ITypeAndIdAndValUpdates> {
    private update: ITypeAndIdAndValUpdates;
    protected callbackArguments(): ITypeAndIdAndValUpdates {
        return this.update
    }

    private subscribableTreeDataStore;
    constructor(@inject(TYPES.GlobalDataStoreArgs){subscribableTreeDataStore, updatesCallbacks}) {
        super({updatesCallbacks})
        this.subscribableTreeDataStore = subscribableTreeDataStore
    }
    public startBroadcasting() {
        const me = this
        this.subscribableTreeDataStore.onUpdate((update: IIdAndValUpdates) => {
            me.update = {
                type: ObjectTypes.TREE,
                ...update
            }
        })

    }
}

@injectable()
class GlobalDataStoreArgs {
    @inject(TYPES.Array) public updatesCallbacks;
    @inject(TYPES.ISubscribableTreeDataStore) public subscribableTreeDataStore
}

export {SubscribableGlobalDataStore, GlobalDataStoreArgs}
