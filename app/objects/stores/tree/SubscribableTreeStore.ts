import {
    IMutableSubscribableTree, ISubscribableTreeCore,
    ISubscribableTreeStore
} from '../../interfaces';
import {SubscribableStore} from '../SubscribableStore';

class SubscribableTreeStore extends SubscribableStore<ISubscribableTreeCore, IMutableSubscribableTree>
    implements ISubscribableTreeStore {}

export {SubscribableTreeStore}
