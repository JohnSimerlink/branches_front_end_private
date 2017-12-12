import {
    IMutableSubscribableTreeUser,
    ISubscribableTreeUserCore,
    ISubscribableTreeUserStore
} from '../../interfaces';
import {SubscribableStore} from '../SubscribableStore';

class SubscribableTreeUserStore
    extends SubscribableStore<ISubscribableTreeUserCore, IMutableSubscribableTreeUser>
    implements ISubscribableTreeUserStore {}

export {SubscribableTreeUserStore}
