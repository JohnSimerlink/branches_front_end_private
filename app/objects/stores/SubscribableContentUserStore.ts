import {
    ISubscribableContentUserCore, ISubscribableContentUserStore,
} from '../interfaces';
import {SubscribableStore} from './SubscribableStore';

class SubscribableContentUserStore extends SubscribableStore<ISubscribableContentUserCore>
    implements ISubscribableContentUserStore {}

export {SubscribableContentUserStore}
