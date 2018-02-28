// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {log} from '../../core/log'
import {
    IIdAndValUpdates, IMutableSubscribableContentStore, IMutableSubscribableContentUserStore, ISubscribableContentStore,
    ISubscribableContentUserStore,
    ISubscribableGlobalStore, ISubscribableTreeLocationStore, ISubscribableTreeStore, ISubscribableTreeUserStore,
    ITypeAndIdAndValUpdates, IUpdatesCallback,
    GlobalDataStoreObjectDataTypes,
} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';

@injectable()
export class SubscribableGlobalStore extends SubscribableCore<ITypeAndIdAndValUpdates>
implements ISubscribableGlobalStore {
    private update: ITypeAndIdAndValUpdates;
    protected callbackArguments(): ITypeAndIdAndValUpdates {
        // log('globaldatastore callback arguments called')
        return this.update
    }

    protected treeStore: ISubscribableTreeStore;
    protected treeUserStore: ISubscribableTreeUserStore;
    protected treeLocationStore: ISubscribableTreeLocationStore;
    protected contentStore: ISubscribableContentStore;
    protected contentUserStore: ISubscribableContentUserStore;
    constructor(@inject(TYPES.SubscribableGlobalStoreArgs){
        treeStore, treeUserStore, treeLocationStore,
        contentStore, contentUserStore, updatesCallbacks = []}: SubscribableGlobalStoreArgs ) {
        super({updatesCallbacks})
        this.treeStore = treeStore
        this.treeUserStore = treeUserStore
        this.treeLocationStore = treeLocationStore
        this.contentStore = contentStore
        this.contentUserStore = contentUserStore
        // log('subscribableGlobalStore called')
    }
    protected callCallbacks() {
        super.callCallbacks()
    }
    public startPublishing() {
        const me = this
        this.treeStore.onUpdate((update: IIdAndValUpdates) => {
            me.update = {
                type: GlobalDataStoreObjectDataTypes.TREE_DATA,
                ...update
            }
            me.callCallbacks()
        })
        this.treeStore.startPublishing()
        this.treeUserStore.onUpdate((update: IIdAndValUpdates) => {
            me.update = {
                type: GlobalDataStoreObjectDataTypes.TREE_USER_DATA,
                ...update
            }
            me.callCallbacks()
        })
        this.treeUserStore.startPublishing()
        this.treeLocationStore.onUpdate((update: IIdAndValUpdates) => {
            me.update = {
                type: GlobalDataStoreObjectDataTypes.TREE_LOCATION_DATA,
                ...update
            }
            me.callCallbacks()
        })
        this.treeLocationStore.startPublishing()
        this.contentStore.onUpdate((update: IIdAndValUpdates) => {
            me.update = {
                type: GlobalDataStoreObjectDataTypes.CONTENT_DATA,
                ...update
            }
            me.callCallbacks()
        })
        this.contentStore.startPublishing()
        this.contentUserStore.onUpdate((update: IIdAndValUpdates) => {
            me.update = {
                type: GlobalDataStoreObjectDataTypes.CONTENT_USER_DATA,
                ...update
            }
            me.callCallbacks()
        })
        this.contentUserStore.startPublishing()
    }
}

@injectable()
export class SubscribableGlobalStoreArgs {
    @inject(TYPES.Array) public updatesCallbacks: Array<IUpdatesCallback<any>>;
    @inject(TYPES.ISubscribableTreeStore) public treeStore: ISubscribableTreeStore
    @inject(TYPES.ISubscribableTreeUserStore) public treeUserStore: ISubscribableTreeUserStore
    @inject(TYPES.ISubscribableTreeLocationStore) public treeLocationStore: ISubscribableTreeLocationStore
    @inject(TYPES.ISubscribableContentUserStore) public contentUserStore: ISubscribableContentUserStore
    @inject(TYPES.ISubscribableContentStore) public contentStore: ISubscribableContentStore
}
