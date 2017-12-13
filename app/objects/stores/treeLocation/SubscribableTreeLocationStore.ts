import {inject, injectable} from 'inversify';
import {
    IMutableSubscribableTreeLocation,
    ISubscribableTreeLocationCore,
    ISubscribableTreeLocationStore
} from '../../interfaces';
import {TYPES} from '../../types';
import {SubscribableStore} from '../SubscribableStore';

@injectable()
export class SubscribableTreeLocationStore
    extends SubscribableStore<ISubscribableTreeLocationCore, IMutableSubscribableTreeLocation>
    implements ISubscribableTreeLocationStore {
    constructor(@inject(TYPES.SubscribableTreeLocationStoreArgs){ storeSource, updatesCallbacks}) {
        super({updatesCallbacks, storeSource})
    }
}

@injectable()
export class SubscribableTreeLocationStoreArgs {
    @inject(TYPES.ISubscribableTreeLocationStoreSource) public storeSource;
    @inject(TYPES.Array) public updatesCallbacks;
}
