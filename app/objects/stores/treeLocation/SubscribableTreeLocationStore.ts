import {inject, injectable} from 'inversify';
import {
    IMutableSubscribableTreeLocation,
    ISubscribableTreeLocationCore,
    ISubscribableTreeLocationStore
} from '../../interfaces';
import {TYPES} from '../../types';
import {SubscribableStore} from '../SubscribableStore';
import {log} from '../../../core/log';

@injectable()
export class SubscribableTreeLocationStore
    extends SubscribableStore<ISubscribableTreeLocationCore, IMutableSubscribableTreeLocation>
    implements ISubscribableTreeLocationStore {
    constructor(
        @inject(TYPES.SubscribableTreeLocationStoreArgs){
            storeSource, updatesCallbacks}: SubscribableTreeLocationStoreArgs ) {
        super({updatesCallbacks, storeSource});
        // log('SubscribableTreeLocationStore constructor just called!. the storeSource in the args is', storeSource)
    }
}

@injectable()
export class SubscribableTreeLocationStoreArgs {
    @inject(TYPES.ISubscribableTreeLocationStoreSource) public storeSource;
    @inject(TYPES.Array) public updatesCallbacks;
}
