import {
    ISubscribableContentCore, ISubscribableContentStore,
} from '../../interfaces';
import {SubscribableStore} from '../SubscribableStore';

class SubscribableContentStore extends SubscribableStore<ISubscribableContentCore>
    implements ISubscribableContentStore {}

export {SubscribableContentStore}
