import {
	ICoordinate,
	ITreeLocationDataFromFirebase
} from '../interfaces';

/**
 *
 * These functions are for typechecking data that came from the database
 */
export function isValidTreeLocationDataFromDB(treeLocationDataFromFirebase: ITreeLocationDataFromFirebase) {
	return treeLocationDataFromFirebase && treeLocationDataFromFirebase.point
		&& isValidCoordinate(treeLocationDataFromFirebase.point.val)
		&& treeLocationDataFromFirebase.level && treeLocationDataFromFirebase.level.val
		&& treeLocationDataFromFirebase.mapId && treeLocationDataFromFirebase.mapId.val;
}

export function isValidCoordinate(coordinate: ICoordinate) {
	return coordinate && !isNaN(coordinate.x) && !isNaN(coordinate.y);
}
