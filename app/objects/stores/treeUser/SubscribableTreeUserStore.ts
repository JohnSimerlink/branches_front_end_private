import {ISubscribableTreeUserCore, ISubscribableTreeUserStore} from '../../interfaces';
import {SubscribableStore} from '../SubscribableStore';

class SubscribableTreeUserStore
    extends SubscribableStore<ISubscribableTreeUserCore> implements ISubscribableTreeUserStore {}

export {SubscribableTreeUserStore}
