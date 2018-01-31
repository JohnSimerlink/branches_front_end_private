import {ICoordinate, ITreeLocationData} from '../interfaces';

/**
 *
 * These functions are for typechecking data that came from the database
 */
export function isValidTreeLocationData(treeLocation: ITreeLocationData) {
    return treeLocation && treeLocation.point && isValidCoordinate(treeLocation.point.val)
}

export function isValidCoordinate(coordinate: ICoordinate) {
    return coordinate && coordinate.x && coordinate.y
}
