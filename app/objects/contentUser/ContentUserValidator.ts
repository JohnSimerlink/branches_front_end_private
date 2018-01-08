import {IContentUserData, ITreeUserData} from '../interfaces';

export function isValidContentUser(contentUser: IContentUserData) {
    return contentUser && contentUser.overdue
        && contentUser.timer && contentUser.proficiency
        && contentUser.lastRecordedStrength
}
