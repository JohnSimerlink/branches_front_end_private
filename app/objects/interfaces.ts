// tslint:disable no-empty-interface
import {ObjectDataTypes} from './dataStores/ObjectTypes';

type IValUpdates = any
interface IIdAndValUpdates {
    id: any,
    val: any
}
interface ITypeAndIdAndValUpdates extends IIdAndValUpdates {
    type: ObjectDataTypes
}
interface IIdSigmaNodeMap extends Object {}

export {
    ITypeAndIdAndValUpdates,
    IIdAndValUpdates,
    IIdSigmaNodeMap
    IValUpdates
}
