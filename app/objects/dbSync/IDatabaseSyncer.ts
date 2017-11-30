/* tslint:disable no-empty-interface */
import {ISubscriber} from '../subscribable/ISubscriber';
import {IDetailedUpdates} from './IDetailedUpdates';

interface IDatabaseSyncer extends ISubscriber<IDetailedUpdates> {
}

export {IDatabaseSyncer}
