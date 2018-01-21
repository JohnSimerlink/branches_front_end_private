// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IDescendantPublisher, IIdAndValUpdates, ISubscribableContentUserStoreSource,
    ISubscribableStore, ISubscribableStoreSource, ITypeAndIdAndValAndObjUpdates, ITypeAndIdAndValUpdates
} from '../interfaces';
import {IValUpdates} from '../interfaces';
import { ISubscribable} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {log} from '../../core/log'

// interface ISubscribableTreeStore extends SubscribableTreeStore {}
// ^^ TODO: define this interface separate of the class, and have the class implement this interface
@injectable()
export abstract class SubscribableStore<SubscribableCoreInterface, ObjectInterface>
    extends SubscribableCore<IIdAndValUpdates>
    implements ISubscribableStore<SubscribableCoreInterface> {
    protected storeSource: ISubscribableStoreSource<
        ISubscribable<IValUpdates> & SubscribableCoreInterface & IDescendantPublisher & ObjectInterface
        >;
    private update: IIdAndValUpdates;
    private startedPublishing: boolean = false
    constructor(
        { storeSource, updatesCallbacks}: {
            storeSource: ISubscribableStoreSource<
        ISubscribable<IValUpdates> & SubscribableCoreInterface & IDescendantPublisher & ObjectInterface
        >,
            updatesCallbacks: Function[],
        }
    ) {
        super({updatesCallbacks})
        this.storeSource = storeSource
    }
    protected callbackArguments(): IIdAndValUpdates {
        return this.update
    }
    public addAndSubscribeToItem(
        id: any, item: ISubscribable<IValUpdates> & SubscribableCoreInterface & IDescendantPublisher & ObjectInterface
    ) {
        // TODO: make the arg type cleaner!
        if (!this.startedPublishing) {
            throw new Error('Can\'t add item until started publishing!')
        }
        this.storeSource.set(id, item)
        this.subscribeToItem(id, item)
        item.startPublishing()
        // throw new Error('Method not implemented.");
    }
    private subscribeToItem(id: any, item: ISubscribable<IValUpdates> & SubscribableCoreInterface) {
        const me = this
        item.onUpdate( (val: IValUpdates) => {
            me.update = {id, val}
            me.callCallbacks()
        })
    }
    private subscribeToExistingItems() {
        for (let [id, item] of this.storeSource.entries()) {
            item = item
            this.subscribeToItem(id, item)
            item.startPublishing()
        }
    }
    private subscribeToFutureItems() {
        log('subscribeToFutureItems called')
        // TODO: add a test to see if subscribe gets
        // called on an item that gets added to store source after startPublishing gets called
        this.storeSource.onUpdate((update: ITypeAndIdAndValAndObjUpdates) => {
            const id = update.id
            const item = update.obj
            this.subscribeToItem(id, item)
            item.startPublishing()
            log('subscribeToFutureItems update in store Source is ', update, update.obj, update.obj['_id'])
        })
    }
    public startPublishing() {
        this.subscribeToExistingItems()
        this.subscribeToFutureItems()
        log('store', this, ' just startedPublishing')
        this.startedPublishing = true
    }

}
