import {IUserDataFromDB} from '../interfaces';

export function isValidUserDataFromDB(userDataFromDB: IUserDataFromDB) {
    return true
    // return userDataFromDB && userDataFromDB.sampleUser1MembershipExpirationDate && userDataFromDB.sampleUser1MembershipExpirationDate.val
}
