// tslint:disable no-empty-interface
import {IContentData} from './contentItem/IContentData';
import {IContentUserData} from './contentUserData/IContentUserData';
import {ObjectDataTypes} from './dataStores/ObjectTypes';
import {ICoordinate} from './point/IPoint';
import {ISubscriber} from './subscribable/ISubscriber';
import {IBasicTreeDataWithoutId} from './tree/IBasicTreeData';
import {ITreeUserData} from './treeUserData/ITreeUserData';
import {ISubscribable} from './subscribable/ISubscribable';

// app
interface IApp {
    start()
}
// dataStores
interface ISubscribableGlobalDataStoreCore {
    startBroadcasting()
}

interface ISubscribableGlobalDataStore extends ISubscribable<ITypeAndIdAndValUpdates>,
    ISubscribableGlobalDataStoreCore {

}

////////
type IValUpdates = any
interface IIdAndValUpdates {
    id: any,
    val: any
}
interface ITypeAndIdAndValUpdates extends IIdAndValUpdates {
    type: ObjectDataTypes
}
type ObjectDataDataTypes = IBasicTreeDataWithoutId & ITreeUserData & IContentData & IContentUserData & ICoordinate

// sigmaNode
type fGetSigmaIdsForContentId = (id: string) => string[]
interface ISigmaNodeHandler {
    handleUpdate(update: ITypeAndIdAndValUpdates)
}
interface ISigmaNodeHandlerSubscriber extends ISubscriber<ITypeAndIdAndValUpdates> { }


export {
    // app
    IApp,
    ///
    ITypeAndIdAndValUpdates,
    IIdAndValUpdates,
    ISigmaNodeHandlerSubscriber,
    IValUpdates,
    ObjectDataDataTypes,
    // sigmaNode
    fGetSigmaIdsForContentId,
    ISigmaNodeHandler,
    ISubscribableGlobalDataStoreCore,
    ISubscribableGlobalDataStore,
}
