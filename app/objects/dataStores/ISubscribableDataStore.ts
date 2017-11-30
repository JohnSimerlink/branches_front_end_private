import {ISubscribable} from '../subscribable/ISubscribable';
import {IIdAndValUpdates} from './IIdAndValUpdates';

interface ICoreSubscribableDataStore<UpdatesType, ObjectType> {
    addAndSubscribeToItem(id: any, item: ISubscribable<UpdatesType> & ObjectType)
    subscribeToAllItems()
}
interface ISubscribableDataStore<UpdatesType, ObjectType>
    extends ISubscribable<IIdAndValUpdates>, ICoreSubscribableDataStore<UpdatesType, ObjectType> {
}

export {ISubscribableDataStore, ICoreSubscribableDataStore}
