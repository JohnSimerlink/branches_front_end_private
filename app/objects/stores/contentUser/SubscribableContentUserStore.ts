import {
    IMutableSubscribableContentUser,
    ISubscribableContentUserCore, ISubscribableContentUserStore,
} from '../../interfaces';
import {SubscribableStore} from '../SubscribableStore';

class SubscribableContentUserStore extends
    SubscribableStore<ISubscribableContentUserCore, IMutableSubscribableContentUser>
    implements ISubscribableContentUserStore {}

export {SubscribableContentUserStore}
