import {
	IMutableSubscribableContent,
	ISubscribableContentCore,
	ISubscribableContentStore,
} from '../../interfaces';
import {SubscribableStore} from '../SubscribableStore';
import {TYPES} from '../../types';
import {
	inject,
	injectable
} from 'inversify';

export class SubscribableContentStore extends SubscribableStore<ISubscribableContentCore, IMutableSubscribableContent>
	implements ISubscribableContentStore {
	constructor(
		@inject(TYPES.SubscribableContentStoreArgs){storeSource, updatesCallbacks}: SubscribableContentStoreArgs) {
		super({
			updatesCallbacks,
			storeSource
		});
	}
}

@injectable()
export class SubscribableContentStoreArgs {
	@inject(TYPES.ISubscribableContentStoreSource) public storeSource;
	@inject(TYPES.Array) public updatesCallbacks;
}
