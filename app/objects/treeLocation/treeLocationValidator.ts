import {ITreeLocationData} from '../interfaces';

export function isValidTreeLocation(treeLocation: ITreeLocationData) {
    return treeLocation && treeLocation.point
}
