import {ISubscribableTreeLocationCore, ISubscribableTreeLocationStore} from '../../interfaces';
import {SubscribableStore} from '../SubscribableStore';

class SubscribableTreeLocationStore
    extends SubscribableStore<ISubscribableTreeLocationCore> implements ISubscribableTreeLocationStore {}

export {SubscribableTreeLocationStore}
