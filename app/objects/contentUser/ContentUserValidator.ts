import {IContentUserData, ITreeUserData} from '../interfaces';

export function isValidContentUser(contentUser: IContentUserData) {
    return contentUser
        && typeof contentUser.overdue !== 'undefined'
        && typeof contentUser.timer !== 'undefined'
        && typeof contentUser.proficiency !== 'undefined'
        // typeof contentUser.lastRecordedStrength !== 'undefined'
}
