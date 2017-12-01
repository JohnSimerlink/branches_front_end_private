// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {log} from '../../core/log'
import {IIdAndValUpdates, ITypeAndIdAndValUpdates} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';
import {ObjectTypes} from './ObjectTypes';

@injectable()
class SubscribableGlobalDataStore extends SubscribableCore<ITypeAndIdAndValUpdates> {
    private update: ITypeAndIdAndValUpdates;
    protected callbackArguments(): ITypeAndIdAndValUpdates {
        // log('globaldatastore callback arguments called')
        return this.update
    }

    private subscribableTreeDataStore;
    constructor(@inject(TYPES.GlobalDataStoreArgs){subscribableTreeDataStore, updatesCallbacks = []}) {
        super({updatesCallbacks})
        this.subscribableTreeDataStore = subscribableTreeDataStore
        // log('subscribableGlobalDataStore called')
    }
    public startBroadcasting() {
        const me = this
        this.subscribableTreeDataStore.onUpdate((update: IIdAndValUpdates) => {
            me.update = {
                type: ObjectTypes.TREE,
                ...update
            }
            me.callCallbacks()
        })

    }
}

@injectable()
class GlobalDataStoreArgs {
    @inject(TYPES.Array) public updatesCallbacks;
    @inject(TYPES.ISubscribableTreeDataStore) public subscribableTreeDataStore
}

export {SubscribableGlobalDataStore, GlobalDataStoreArgs}
