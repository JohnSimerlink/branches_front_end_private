// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IDescendantPublisher, IIdAndValUpdate, ISubscribableContentUserStoreSource,
    ISubscribableStore, ISubscribableStoreSource, IStoreObjectUpdate, ITypeAndIdAndValUpdate
} from '../interfaces';
import {IValUpdates} from '../interfaces';
import { ISubscribable} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {log} from '../../core/log'

// interface ISubscribableTreeStore extends SubscribableTreeStore {}
// ^^ TODO: define this interface separate of the class, and have the class implement this interface
@injectable()
export abstract class SubscribableStore<SubscribableCoreInterface, ObjectInterface>
    extends SubscribableCore<IIdAndValUpdate>
    implements ISubscribableStore<SubscribableCoreInterface> {
    protected storeSource: ISubscribableStoreSource<
        ISubscribable<IValUpdates> & SubscribableCoreInterface & IDescendantPublisher & ObjectInterface
        >;
    private update: IIdAndValUpdate;
    private startedPublishing: boolean = false;
    private _id;
    constructor(
        { storeSource, updatesCallbacks}: {
            storeSource: ISubscribableStoreSource<
        ISubscribable<IValUpdates> & SubscribableCoreInterface & IDescendantPublisher & ObjectInterface
        >,
            updatesCallbacks: Function[],
        }
    ) {
        super({updatesCallbacks});
        this.storeSource = storeSource;
        this._id = Math.random()
        // log('new SubscribableStore just created', this._id)
    }
    protected callbackArguments(): IIdAndValUpdate {
        return this.update
    }
    public addItem(
        id: any, item: ISubscribable<IValUpdates> & SubscribableCoreInterface & IDescendantPublisher & ObjectInterface
    ) {
        // TODO: make the arg type cleaner!
        if (!this.startedPublishing) {
            throw new Error('Can\'t add item to store,' + this._id +
                ' until store has started publishing!')
        }
        this.storeSource.set(id, item)
        // log('SubscribableStore addItem just called', id, item)
        // this.subscribeToItem(id, item)
        // item.startPublishing()
        // throw new Error('Method not implemented.");
    }
    private subscribeToItem(id: any, item: ISubscribable<IValUpdates> & SubscribableCoreInterface) {
        const me = this;
        item.onUpdate( (val: IValUpdates) => {
            me.update = {id, val};
            me.callCallbacks()
        })
    }
    private subscribeToExistingItems() {
        for (const [id, item] of this.storeSource.entries()) {
            this.subscribeToItem(id, item);
            item.startPublishing()
        }
    }
    private subscribeToFutureItems() {
        // log('subscribeToFutureItems called')
        // TODO: add a test to see if subscribe gets
        // called on an item that gets added to store source after startPublishing gets called
        this.storeSource.onUpdate((update: IStoreObjectUpdate) => {
            const id = update.id;
            const item = update.obj;
            this.subscribeToItem(id, item);
            item.startPublishing()
            // log('subscribeToFutureItems update in store Source is ', update, update.obj, update.obj['_id'])
        })
    }
    public startPublishing() {
        this.subscribeToExistingItems();
        this.subscribeToFutureItems();
        // log('store ID: ', this._id, this, ' just startedPublishing')
        this.startedPublishing = true
    }

}
