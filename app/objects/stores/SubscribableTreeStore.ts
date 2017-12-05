import {ISubscribableTreeCore, ISubscribableTreeStore} from '../interfaces';
import {SubscribableStore} from './SubscribableStore';

class SubscribableTreeStore extends SubscribableStore<ISubscribableTreeCore> implements ISubscribableTreeStore {}

export {SubscribableTreeStore}
