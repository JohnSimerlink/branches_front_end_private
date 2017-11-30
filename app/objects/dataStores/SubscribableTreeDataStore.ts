// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import * as entries from 'object.entries' // TODO: why cant i get this working natively with TS es2017?
import {ISubscribable} from '../subscribable/ISubscribable';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {ISubscribableBasicTree} from '../tree/ISubscribableBasicTree';
import {TYPES} from '../types';
import {IIdAndValUpdates} from './IIdAndValUpdates';
import {ICoreSubscribableDataStore} from './ISubscribableDataStore';
import {IValUpdates} from './IValUpdates';
if (!Object.entries) {
    entries.shim()
}

@injectable()
class SubscribableTreeDataStore
    extends SubscribableCore<IIdAndValUpdates>
    implements ICoreSubscribableDataStore<IIdAndValUpdates, ISubscribableBasicTree> {
    private store: object;
    private update: IIdAndValUpdates;
    constructor(@inject(TYPES.SubscribableDataStoreArgs){store = {}, updatesCallbacks}) {
        super({updatesCallbacks})
        this.store = store
    }
    protected callbackArguments(): IIdAndValUpdates {
        return this.update
    }
    public addAndSubscribeToItem(id: any, item: ISubscribable<IIdAndValUpdates> & ISubscribableBasicTree) {
        this.store[id] = item
        this.subscribeToItem(id, item)
        // throw new Error('Method not implemented.");
    }
    private onItemUpdate(id, val) {
        this.update = {id, val}
    }
    private subscribeToItem(id: any, item: ISubscribable<IValUpdates> & ISubscribableBasicTree) {
        const me = this
        item.onUpdate( (val: IValUpdates) => {
            me.onItemUpdate(id, val)
            me.callCallbacks()
        })
    }
    public subscribeToAllItems() {
        for (const [id, item] of Object.entries(this.store) ) {
            this.subscribeToItem(id, item)
        }
    }

}
class SubscribableDataStoreArgs {
    @inject(TYPES.Object) public store;
    @inject(TYPES.Array) public updatesCallbacks;
}

export {SubscribableDataStoreArgs}
