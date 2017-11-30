// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';

@injectable()
class SubscribableDataStore<UpdatesType, ObjectType, ObjectUpdateType>
    extends SubscribableCore<UpdatesType> {

    private store: object;
    constructor(@inject(TYPES.SubscribableDataStoreArgs){store = {}, updatesCallbacks}) {
        super({updatesCallbacks})
        this.store = store
    }
    protected callbackArguments() {
        throw new Error('Method not implemented.')
    }
    /*
    public addAndSubscribeToItem(id: any, item: ISubscribable<ObjectUpdateType> & ObjectType) {
        this.store[id] = item
        this.subscribeToItem(item)
    }
    private onItemUpdate(id, item) {
        this.update = {id, val: item.vau

    }
    private subscribeToItem(item: ISubscribable<UpdatesType> & ObjectType) {
        this.update +
        item.onUpdate( (updates: ObjectUpdateType) => { } ) // this.callCallbacks.bind(this))
    }

    public subscribeToAllItems() {
    }
    */

}
class SubscribableTreeDataStore {

}
class SubscribableDataStoreArgs {
    @inject(TYPES.Object) public store;
    @inject(TYPES.Array) public updatesCallbacks;
}

export {SubscribableDataStore, SubscribableDataStoreArgs}
