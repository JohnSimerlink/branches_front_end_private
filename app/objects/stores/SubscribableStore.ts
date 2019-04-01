// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {injectable} from 'inversify';
import {
	IDescendantPublisher,
	IIdAndValUpdate,
	IStoreObjectUpdate,
	ISubscribable,
	ISubscribableStore,
	ISubscribableStoreSource,
	IValUpdate
} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';

// interface ISubscribableTreeStore extends SubscribableTreeStore {}
// ^^ TODO: define this interface separate of the class, and have the class implement this interface
@injectable()
export abstract class SubscribableStore<SubscribableCoreInterface, ObjectInterface>
	extends SubscribableCore<IIdAndValUpdate>
	implements ISubscribableStore<SubscribableCoreInterface> {
	protected storeSource: ISubscribableStoreSource<ISubscribable<IValUpdate> & SubscribableCoreInterface & IDescendantPublisher & ObjectInterface>;
	private update: IIdAndValUpdate;
	private startedPublishing: boolean = false;

	constructor(
		{storeSource, updatesCallbacks}: {
			storeSource: ISubscribableStoreSource<ISubscribable<IValUpdate> & SubscribableCoreInterface & IDescendantPublisher & ObjectInterface>,
			updatesCallbacks: () => void,
		}
	) {
		super({updatesCallbacks});
		this.storeSource = storeSource;
	}

	public addItem(
		id: any, item: ISubscribable<IValUpdate> & SubscribableCoreInterface & IDescendantPublisher & ObjectInterface
	) {
		// TODO: make the arg type cleaner!
		if (!this.startedPublishing) {
			throw new Error('Can\'t add item to store,' + item +
				' until store has started publishing!');
		}
		this.storeSource.set(id, item);
	}

	public startPublishing() {
		this.subscribeToExistingItems();
		this.subscribeToFutureItems();
		this.startedPublishing = true;
	}

	protected callbackArguments(): IIdAndValUpdate {
		return this.update;
	}

	private subscribeToItem(id: any, item: ISubscribable<IValUpdate> & SubscribableCoreInterface) {
		const me = this;
		item.onUpdate((val: IValUpdate) => {
			me.update = {
				id,
				val
			};
			me.callCallbacks();
		});
	}

	private subscribeToExistingItems() {
		for (const [id, item] of this.storeSource.entries()) {
			this.subscribeToItem(id, item);
			item.startPublishing();
		}
	}

	private subscribeToFutureItems() {
		this.storeSource.onUpdate((update: IStoreObjectUpdate) => {
			const id = update.id;
			const item = update.obj;
			this.subscribeToItem(id, item);
			item.startPublishing();
		});
	}

}
