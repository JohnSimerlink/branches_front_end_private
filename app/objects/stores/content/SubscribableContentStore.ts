import {
    IMutableSubscribableContent,
    ISubscribableContentCore, ISubscribableContentStore,
} from '../../interfaces';
import {SubscribableStore} from '../SubscribableStore';

class SubscribableContentStore extends SubscribableStore<ISubscribableContentCore, IMutableSubscribableContent>
    implements ISubscribableContentStore {}

export {SubscribableContentStore}
