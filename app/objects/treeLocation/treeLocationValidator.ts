import {ICoordinate, ITreeLocationData, ITreeLocationDataFromFirebase} from '../interfaces';

/**
 *
 * These functions are for typechecking data that came from the database
 */
export function isValidTreeLocationDataFromFirebase(treeLocationDataFromFirebase: ITreeLocationDataFromFirebase) {
    return treeLocationDataFromFirebase && treeLocationDataFromFirebase.point
        && isValidCoordinate(treeLocationDataFromFirebase.point.val)
}

export function isValidCoordinate(coordinate: ICoordinate) {
    return coordinate && coordinate.x && coordinate.y
}
