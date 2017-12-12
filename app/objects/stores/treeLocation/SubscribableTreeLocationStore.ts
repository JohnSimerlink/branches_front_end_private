import {
    IMutableSubscribableTreeLocation,
    ISubscribableTreeLocationCore,
    ISubscribableTreeLocationStore
} from '../../interfaces';
import {SubscribableStore} from '../SubscribableStore';

class SubscribableTreeLocationStore
    extends SubscribableStore<ISubscribableTreeLocationCore, IMutableSubscribableTreeLocation>
    implements ISubscribableTreeLocationStore {}

export {SubscribableTreeLocationStore}
