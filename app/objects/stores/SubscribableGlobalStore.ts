// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {
	inject,
	injectable
} from 'inversify';
import {
	CustomStoreDataTypes,
	IIdAndValUpdate,
	ISubscribableContentStore,
	ISubscribableContentUserStore,
	ISubscribableGlobalStore,
	ISubscribableTreeLocationStore,
	ISubscribableTreeStore,
	ISubscribableTreeUserStore,
	ITypeAndIdAndValUpdate,
	IUpdatesCallback,
} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';

@injectable()
export class SubscribableGlobalStore extends SubscribableCore<ITypeAndIdAndValUpdate>
	implements ISubscribableGlobalStore {
	protected treeStore: ISubscribableTreeStore;
	protected treeUserStore: ISubscribableTreeUserStore;
	protected treeLocationStore: ISubscribableTreeLocationStore;
	protected contentStore: ISubscribableContentStore;
	protected contentUserStore: ISubscribableContentUserStore;
	private update: ITypeAndIdAndValUpdate;

	constructor(@inject(TYPES.SubscribableGlobalStoreArgs){
		treeStore, treeUserStore, treeLocationStore,
		contentStore, contentUserStore, updatesCallbacks = []
	}: SubscribableGlobalStoreArgs) {
		super({updatesCallbacks});
		this.treeStore = treeStore;
		this.treeUserStore = treeUserStore;
		this.treeLocationStore = treeLocationStore;
		this.contentStore = contentStore;
		this.contentUserStore = contentUserStore;
		// log('subscribableGlobalStore called')
	}

	public startPublishing() {
		const me = this;
		this.treeStore.onUpdate((update: IIdAndValUpdate) => {
			me.update = {
				type: CustomStoreDataTypes.TREE_DATA,
				...update
			};
			me.callCallbacks();
		});
		this.treeStore.startPublishing();
		this.treeUserStore.onUpdate((update: IIdAndValUpdate) => {
			me.update = {
				type: CustomStoreDataTypes.TREE_USER_DATA,
				...update
			};
			me.callCallbacks();
		});
		this.treeUserStore.startPublishing();
		this.treeLocationStore.onUpdate((update: IIdAndValUpdate) => {
			me.update = {
				type: CustomStoreDataTypes.TREE_LOCATION_DATA,
				...update
			};
			me.callCallbacks();
		});
		this.treeLocationStore.startPublishing();
		this.contentStore.onUpdate((update: IIdAndValUpdate) => {
			me.update = {
				type: CustomStoreDataTypes.CONTENT_DATA,
				...update
			};
			me.callCallbacks();
		});
		this.contentStore.startPublishing();
		this.contentUserStore.onUpdate((update: IIdAndValUpdate) => {
			me.update = {
				type: CustomStoreDataTypes.CONTENT_USER_DATA,
				...update
			};
			me.callCallbacks();
		});
		this.contentUserStore.startPublishing();
	}

	protected callbackArguments(): ITypeAndIdAndValUpdate {
		// log('globaldatastore callback arguments called')
		return this.update;
	}

	protected callCallbacks() {
		super.callCallbacks();
	}
}

@injectable()
export class SubscribableGlobalStoreArgs {
	@inject(TYPES.Array) public updatesCallbacks: Array<IUpdatesCallback<any>>;
	@inject(TYPES.ISubscribableTreeStore) public treeStore: ISubscribableTreeStore;
	@inject(TYPES.ISubscribableTreeUserStore) public treeUserStore: ISubscribableTreeUserStore;
	@inject(TYPES.ISubscribableTreeLocationStore) public treeLocationStore: ISubscribableTreeLocationStore;
	@inject(TYPES.ISubscribableContentUserStore) public contentUserStore: ISubscribableContentUserStore;
	@inject(TYPES.ISubscribableContentStore) public contentStore: ISubscribableContentStore;
}
