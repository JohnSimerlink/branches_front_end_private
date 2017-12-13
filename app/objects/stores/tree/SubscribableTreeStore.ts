import {inject, injectable} from 'inversify';
import {
    IMutableSubscribableTree, ISubscribableTreeCore,
    ISubscribableTreeStore
} from '../../interfaces';
import {TYPES} from '../../types';
import {SubscribableStore} from '../SubscribableStore';

export class SubscribableTreeStore extends SubscribableStore<ISubscribableTreeCore, IMutableSubscribableTree>
    implements ISubscribableTreeStore {

    constructor(@inject(TYPES.SubscribableTreeStoreArgs){ storeSource, updatesCallbacks}) {
        super({updatesCallbacks, storeSource})
    }
}

@injectable()
export class SubscribableTreeStoreArgs {
    @inject(TYPES.ISubscribableTreeStoreSource) public storeSource;
    @inject(TYPES.Array) public updatesCallbacks;
}
