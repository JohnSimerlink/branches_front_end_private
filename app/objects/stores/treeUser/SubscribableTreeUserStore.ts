import {inject, injectable} from 'inversify';
import {IMutableSubscribableTreeUser, ISubscribableTreeUserCore, ISubscribableTreeUserStore} from '../../interfaces';
import {SubscribableStore} from '../SubscribableStore';
import {TYPES} from '../../types';

@injectable()
export class SubscribableTreeUserStore
	extends SubscribableStore<ISubscribableTreeUserCore, IMutableSubscribableTreeUser>
	implements ISubscribableTreeUserStore {

	constructor(
		@inject(TYPES.SubscribableTreeUserStoreArgs){storeSource, updatesCallbacks}: SubscribableTreeUserStoreArgs) {
		super({updatesCallbacks, storeSource});
	}
}

@injectable()
export class SubscribableTreeUserStoreArgs {
	@inject(TYPES.ISubscribableTreeUserStoreSource) public storeSource;
	@inject(TYPES.Array) public updatesCallbacks;
}
