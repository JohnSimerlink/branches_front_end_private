import {ITreeUserData} from '../interfaces';

export function isContentUserValid(treeUser: ITreeUserData) {
    return treeUser && treeUser.proficiencyStats && Object.keys(treeUser.proficiencyStats).length
        && treeUser.aggregationTimer
}
