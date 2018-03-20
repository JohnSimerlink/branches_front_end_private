import {inject, injectable} from 'inversify';
import {
    IMutableSubscribableContentUser,
    ISubscribableContentUserCore,
    ISubscribableContentUserStore,
    ISubscribableContentUserStoreSource,
} from '../../interfaces';
import {TYPES} from '../../types';
import {SubscribableStore} from '../SubscribableStore';

export class SubscribableContentUserStore extends
    SubscribableStore<ISubscribableContentUserCore, IMutableSubscribableContentUser>
    implements ISubscribableContentUserStore {

    constructor(@inject(TYPES.SubscribableContentUserStoreArgs){
        storeSource, updatesCallbacks
    }: SubscribableContentUserStoreArgs) {
        super({updatesCallbacks, storeSource});
    }
}

@injectable()
export class SubscribableContentUserStoreArgs {
    @inject(TYPES.ISubscribableContentUserStoreSource) public storeSource: ISubscribableContentUserStoreSource;
    @inject(TYPES.Array) public updatesCallbacks;
}
