import {IUserDataFromDB} from '../interfaces';

export function isValidUserDataFromDB(userDataFromDB: IUserDataFromDB) {
    return true
    // return userDataFromDB && userDataFromDB.membershipExpirationDate && userDataFromDB.membershipExpirationDate.val
}
