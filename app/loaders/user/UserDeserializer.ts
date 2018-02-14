import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IHash, IMutableSubscribableUser, IUserData, CONTENT_TYPES,
    ISyncableMutableSubscribableUser, IUserDataFromDB, timestamp
} from '../../objects/interfaces';
import {SyncableMutableSubscribableUser} from '../../objects/user/SyncableMutableSubscribableUser';
import {isValidUserDataFromDB} from '../../objects/user/userValidator';
import {TreeDeserializer} from '../tree/TreeDeserializer';

export class UserDeserializer {
   public static deserialize(
       {userData, userId}: {userData: IUserData, userId: string}
       ): ISyncableMutableSubscribableUser {
       const membershipExpirationDate = new MutableSubscribableField<timestamp>({field: userData.membershipExpirationDate})
       const user: ISyncableMutableSubscribableUser = new SyncableMutableSubscribableUser(
           {updatesCallbacks: [], membershipExpirationDate}
           )
       return user
   }
   public static convertUserDataFromDBToApp(
       {userDataFromDB}: {userDataFromDB: IUserDataFromDB}): IUserData {
      const userData: IUserData = {
          membershipExpirationDate: userDataFromDB.membershipExpirationDate.val,
          // TODO: ensure that when a user is created,
          // that this field gets set in the DB to some value (e.g. 10 years ago,
          // or maybe even a 24 hour trial <<< NAH FOO )
      }
      return userData
   }
    public static deserializeFromDB(
        {userDataFromDB, userId}: {userDataFromDB: IUserDataFromDB, userId: string}
    ): ISyncableMutableSubscribableUser {
       if (!isValidUserDataFromDB(userDataFromDB)) {
           throw new Error('Cannot deserialize user from db with id of ' + userId
               + ' and value of ' + userDataFromDB)
       }
       const userData: IUserData = UserDeserializer.convertUserDataFromDBToApp({userDataFromDB})
       const user: ISyncableMutableSubscribableUser
            = UserDeserializer.deserialize({userData, userId})
       return user
    }
}
