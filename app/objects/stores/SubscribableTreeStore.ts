// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import * as entries from 'object.entries' // TODO: why cant i get this working natively with TS es2017?
import {IIdAndValUpdates} from '../interfaces';
import {IValUpdates} from '../interfaces';
import {ICoreSubscribableStore, ISubscribable, ISubscribableTreeCore} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';

if (!Object.entries) {
    entries.shim()
}

interface ISubscribableTreeStore extends SubscribableTreeStore {}
// ^^ TODO: define this interface separate of the class, and have the class implement this interface
@injectable()
class SubscribableTreeStore
    extends SubscribableCore<IIdAndValUpdates>
    implements ICoreSubscribableStore<IIdAndValUpdates, ISubscribableTreeCore> {
    protected store: object;
    private update: IIdAndValUpdates;
    private startedPublishing: boolean = false
    constructor(@inject(TYPES.SubscribableDataStoreArgs){store = {}, updatesCallbacks}) {
        super({updatesCallbacks})
        this.store = store
    }
    protected callbackArguments(): IIdAndValUpdates {
        return this.update
    }
    public addAndSubscribeToItem(
        {id, item}: {id: any, item: ISubscribable<IValUpdates> & ISubscribableTreeCore }
        ) {
        if (!this.startedPublishing) {
            throw new Error('Can\'t add item until started publishing!')
        }
        this.store[id] = item
        this.subscribeToItem(id, item)
        // throw new Error('Method not implemented.");
    }
    private subscribeToItem(id: any, item: ISubscribable<IValUpdates> & ISubscribableTreeCore) {
        const me = this
        item.onUpdate( (val: IValUpdates) => {
            me.update = {id, val}
            me.callCallbacks()
        })
    }
    public startPublishing() {
        for (const [id, item] of Object.entries(this.store) ) {
            this.subscribeToItem(id, item)
        }
        this.startedPublishing = true
    }

}

@injectable()
class SubscribableDataStoreArgs {
    @inject(TYPES.Object) public store;
    @inject(TYPES.Array) public updatesCallbacks;
}

export {SubscribableDataStoreArgs, ISubscribableTreeStore, SubscribableTreeStore}
