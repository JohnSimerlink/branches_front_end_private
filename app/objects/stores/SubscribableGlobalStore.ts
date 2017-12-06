// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {log} from '../../core/log'
import {
    IIdAndValUpdates, IMutableSubscribableContentStore, IMutableSubscribableContentUserStore,
    IMutableSubscribableTreeStore, IMutableSubscribableTreeUserStore,
    ISubscribableGlobalStore, ITypeAndIdAndValUpdates, ObjectDataTypes
} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';

@injectable()
class SubscribableGlobalStore extends SubscribableCore<ITypeAndIdAndValUpdates>
implements ISubscribableGlobalStore {
    private update: ITypeAndIdAndValUpdates;
    protected callbackArguments(): ITypeAndIdAndValUpdates {
        // log('globaldatastore callback arguments called')
        return this.update
    }

    protected treeStore: IMutableSubscribableTreeStore;
    protected treeUserStore: IMutableSubscribableTreeUserStore;
    protected contentStore: IMutableSubscribableContentStore;
    protected contentUserStore: IMutableSubscribableContentUserStore;
    constructor(@inject(TYPES.GlobalStoreArgs){
        treeStore, treeUserStore, contentStore, contentUserStore, updatesCallbacks = []}) {
        super({updatesCallbacks})
        this.treeStore = treeStore
        this.treeUserStore = treeUserStore
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
                type: ObjectDataTypes.TREE_DATA,
                ...update
            }
            me.callCallbacks()
        })
        this.treeStore.startPublishing()
        this.treeUserStore.onUpdate((update: IIdAndValUpdates) => {
            me.update = {
                type: ObjectDataTypes.TREE_USER_DATA,
                ...update
            }
            me.callCallbacks()
        })
        this.treeUserStore.startPublishing()
        this.contentStore.onUpdate((update: IIdAndValUpdates) => {
            me.update = {
                type: ObjectDataTypes.CONTENT_DATA,
                ...update
            }
            me.callCallbacks()
        })
        this.contentStore.startPublishing()
        this.contentUserStore.onUpdate((update: IIdAndValUpdates) => {
            me.update = {
                type: ObjectDataTypes.CONTENT_USER_DATA,
                ...update
            }
            me.callCallbacks()
        })
        this.contentUserStore.startPublishing()
    }
}

@injectable()
class GlobalStoreArgs {
    @inject(TYPES.Array) public updatesCallbacks;
    @inject(TYPES.ISubscribableTreeStore) public treeStore
    @inject(TYPES.ISubscribableTreeUserStore) public treeUserStore
    @inject(TYPES.ISubscribableContentUserStore) public contentUserStore
    @inject(TYPES.ISubscribableContentStore) public contentStore
}

export {SubscribableGlobalStore, GlobalStoreArgs, ISubscribableGlobalStore}
