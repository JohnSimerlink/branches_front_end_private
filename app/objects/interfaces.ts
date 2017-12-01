// tslint:disable no-empty-interface
import {ObjectDataTypes} from './dataStores/ObjectTypes';
import {IBasicTreeDataWithoutId} from './tree/IBasicTreeData';
import {ITreeUserData} from './treeUserData/ITreeUserData';
import {IContentUserData} from './contentUserData/IContentUserData';
import {ICoordinate} from './point/IPoint';
import {IContentData} from './contentItem/IContentData';

type IValUpdates = any
interface IIdAndValUpdates {
    id: any,
    val: any
}
interface ITypeAndIdAndValUpdates extends IIdAndValUpdates {
    type: ObjectDataTypes
}
interface IIdSigmaNodeMap extends Object {}
type ObjectDataDataTypes = IBasicTreeDataWithoutId & ITreeUserData & IContentData & IContentUserData & ICoordinate

// sigmaNode
interface ISigmaNodeHandler {
    handleUpdate(update: ITypeAndIdAndValUpdates)
}

export {
    ITypeAndIdAndValUpdates,
    IIdAndValUpdates,
    IIdSigmaNodeMap,
    IValUpdates,
    ObjectDataDataTypes,
    // sigmaNode
    ISigmaNodeHandler
}
