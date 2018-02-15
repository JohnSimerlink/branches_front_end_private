import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IHash, IMutableSubscribableUser, IUserData, CONTENT_TYPES,
    ISyncableMutableSubscribableUser, IUserDataFromDB, timestamp
} from '../../objects/interfaces';
import {SyncableMutableSubscribableUser} from '../../objects/user/SyncableMutableSubscribableUser';
import {isValidUserDataFromDB} from '../../objects/user/userValidator';
import {TreeDeserializer} from '../tree/TreeDeserializer';
import {log} from '../../core/log'

export class UserDeserializer {
   public static deserialize(
       {userData}: {userData: IUserData}
       ): ISyncableMutableSubscribableUser {
       const membershipExpirationDate
           = new MutableSubscribableField<timestamp>({field: userData.membershipExpirationDate})
       const everActivatedMembership = new MutableSubscribableField<boolean>({field: userData.everActivatedMembership})
       const user: ISyncableMutableSubscribableUser = new SyncableMutableSubscribableUser(
           {
               updatesCallbacks: [],
               membershipExpirationDate,
               everActivatedMembership,
           })
       return user
   }
   public static convertUserDataFromDBToApp(
       {userDataFromDB}: {userDataFromDB: IUserDataFromDB}): IUserData {
      const userData: IUserData = {
          membershipExpirationDate:
            userDataFromDB.membershipExpirationDate && userDataFromDB.membershipExpirationDate.val || 0,
          everActivatedMembership:
            userDataFromDB.everActivatedMembership && userDataFromDB.everActivatedMembership.val || false,
          // TODO: ensure that when a user is created,
          // that this field gets set in the DB to some value (e.g. 10 years ago,
          // or maybe even a 24 hour trial <<< NAH FOO )
      }
      return userData
   }
    public static deserializeFromDB(
        {userDataFromDB }: {userDataFromDB: IUserDataFromDB}
    ): ISyncableMutableSubscribableUser {
       if (!isValidUserDataFromDB(userDataFromDB)) {
           throw new Error('Cannot deserialize user from db with  value of ' + userDataFromDB)
       }
       const userData: IUserData = UserDeserializer.convertUserDataFromDBToApp({userDataFromDB})
       log('userData from db is', userData)
       const user: ISyncableMutableSubscribableUser
            = UserDeserializer.deserialize({userData})
       return user
    }
}
