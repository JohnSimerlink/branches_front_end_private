// tslint:disable no-empty-interface
import {IContentData} from './contentItem/IContentData';
import {IContentUserData} from './contentUserData/IContentUserData';
import {ObjectDataTypes} from './dataStores/ObjectTypes';
import {ICoordinate} from './point/IPoint';
import {IBasicTreeDataWithoutId} from './tree/IBasicTreeData';
import {ITreeUserData} from './treeUserData/ITreeUserData';
import {ISubscriber} from './subscribable/ISubscriber';

// app
interface IApp {
    start()
}
// dataStores
interface ISubscribableGlobalDataStoreCore {
    startBroadcasting()
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
    ISigmaNodeHandler,
    ISubscribableGlobalDataStoreCore,
}
