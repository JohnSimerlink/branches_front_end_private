import {IContentUserData, IContentUserDataFromDB, ITreeUserData} from '../interfaces';

export function isValidContentUser(contentUser: IContentUserData) {
    return contentUser
        && typeof contentUser.overdue !== 'undefined'
        && typeof contentUser.timer !== 'undefined'
        && typeof contentUser.proficiency !== 'undefined';
        // typeof contentUser.lastEstimatedStrength !== 'undefined'
}
export function isValidContentUserDataFromDB(contentUserDataFromDB: IContentUserDataFromDB) {
    return contentUserDataFromDB
        && typeof contentUserDataFromDB.overdue !== 'undefined'
            && typeof contentUserDataFromDB.overdue.val !== 'undefined'
        && typeof contentUserDataFromDB.timer !== 'undefined'
            && typeof contentUserDataFromDB.timer.val !== 'undefined'
        && typeof contentUserDataFromDB.proficiency !== 'undefined'
            && typeof contentUserDataFromDB.proficiency.val !== 'undefined';
    // typeof contentUser.lastEstimatedStrength !== 'undefined'
}
