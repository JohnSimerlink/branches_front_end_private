import {IDetailedUpdates} from '../dbSync/IDetailedUpdates';
import {ISubscribable} from '../subscribable/ISubscribable';
import {IMutableId} from './IMutableId';

interface ISubscribableMutableId extends ISubscribable<IDetailedUpdates>, IMutableId {
}

export {ISubscribableMutableId}
