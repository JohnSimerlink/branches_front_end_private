// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import * as entries from 'object.entries' // TODO: why cant i get this working natively with TS es2017?
import {IIdAndValUpdates} from '../interfaces';
import {IValUpdates} from '../interfaces';
import {ICoreSubscribableDataStore, ISubscribable, ISubscribableBasicTreeCore} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';

if (!Object.entries) {
    entries.shim()
}

interface ISubscribableTreeDataStore extends SubscribableTreeDataStore {}
@injectable()
class SubscribableTreeDataStore
    extends SubscribableCore<IIdAndValUpdates>
    implements ICoreSubscribableDataStore<IIdAndValUpdates, ISubscribableBasicTreeCore> {
    private store: object;
    private update: IIdAndValUpdates;
    constructor(@inject(TYPES.SubscribableDataStoreArgs){store = {}, updatesCallbacks}) {
        super({updatesCallbacks})
        this.store = store
    }
    protected callbackArguments(): IIdAndValUpdates {
        return this.update
    }
    public addAndSubscribeToItem(
        {id, item}: {id: any, item: ISubscribable<IValUpdates> & ISubscribableBasicTreeCore }
        ) {
        this.store[id] = item
        this.subscribeToItem(id, item)
        // throw new Error('Method not implemented.");
    }
    private subscribeToItem(id: any, item: ISubscribable<IValUpdates> & ISubscribableBasicTreeCore) {
        const me = this
        item.onUpdate( (val: IValUpdates) => {
            me.update = {id, val}
            me.callCallbacks()
        })
    }
    public subscribeToAllItems() {
        for (const [id, item] of Object.entries(this.store) ) {
            this.subscribeToItem(id, item)
        }
    }

}

@injectable()
class SubscribableDataStoreArgs {
    @inject(TYPES.Object) public store;
    @inject(TYPES.Array) public updatesCallbacks;
}

export {SubscribableDataStoreArgs, ISubscribableTreeDataStore, SubscribableTreeDataStore}
