import {inject, injectable, tagged} from 'inversify';
import {
    IMutableSubscribableTree, ISubscribableTreeCore,
    ISubscribableTreeStore
} from '../../interfaces';
import {TYPES} from '../../types';
import {SubscribableStore} from '../SubscribableStore';
import {log} from '../../../core/log'
import {TAGS} from '../../tags';

export class SubscribableTreeStore extends SubscribableStore<ISubscribableTreeCore, IMutableSubscribableTree>
    implements ISubscribableTreeStore {

    constructor(@inject(TYPES.SubscribableTreeStoreArgs){ storeSource, updatesCallbacks}: SubscribableTreeStoreArgs ) {
        super({updatesCallbacks, storeSource})
    }
}

@injectable()
export class SubscribableTreeStoreArgs {
    @inject(TYPES.ISubscribableTreeStoreSource)
    @tagged(TAGS.MAIN_APP, true)
        public storeSource;
    @inject(TYPES.Array) public updatesCallbacks;
}
