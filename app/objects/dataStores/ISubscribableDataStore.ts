import {ISubscribable} from '../subscribable/ISubscribable';
import {IIdAndValUpdates} from './IIdAndValUpdates';

interface ISubscribableDataStore<UpdatesType, ObjectType> extends ISubscribable<IIdAndValUpdates> {
    addAndSubscribeToItem(id: any, item: ISubscribable<UpdatesType> & ObjectType)
    subscribeToAllItems()
}

export {ISubscribableDataStore}
