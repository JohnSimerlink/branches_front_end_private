// tslint:disable max-classes-per-file
import {ISubscribableDataStore} from './ISubscribableDataStore';
import {ISubscribable, updatesCallback} from '../subscribable/ISubscribable';
import {IIdAndValUpdates} from './IIdAndValUpdates';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {Subscribable} from '../subscribable/Subscribable';

@injectable()
class SubscribableDataStore<UpdatesType, ObjectType> extends Subscribable<UpdatesType> implements ISubscribableDataStore<UpdatesType, ObjectType> {
    private store;
    constructor(@inject(TYPES.SubscribableDataStoreArgs){store, updatesCallbacks}) {
        super({updatesCallbacks})
        this.store = store
    }
    public addAndSubscribeToItem(id: any, item: ISubscribable<UpdatesType> & ObjectType) {
    }

    public subscribeToAllItems() {
    }

    public onUpdate(func: updatesCallback<IIdAndValUpdates>) {
    }

}
class SubscribableDataStoreArgs {
    @inject(TYPES.Object) public store;
    @inject(TYPES.Array) public updatesCallbacks;
}

export {SubscribableDataStore, SubscribableDataStoreArgs}
