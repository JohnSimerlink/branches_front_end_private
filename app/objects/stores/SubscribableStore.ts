// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IDescendantPublisher, IIdAndValUpdates,
    ISubscribableStore, ISubscribableStoreSource
} from '../interfaces';
import {IValUpdates} from '../interfaces';
import { ISubscribable} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';

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
    constructor({ storeSource, updatesCallbacks}) {
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
    public startPublishing() {
        for (let [id, item] of this.storeSource.entries()) {
            item = item
            this.subscribeToItem(id, item)
            item.startPublishing()
        }
        this.startedPublishing = true
    }

}
