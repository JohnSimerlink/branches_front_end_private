import {IUserDataFromDB} from '../interfaces';

export function isValidUserDataFromDB(userDataFromDB: IUserDataFromDB) {
    return userDataFromDB && userDataFromDB.membershipExpirationDate && userDataFromDB.membershipExpirationDate.val
}
