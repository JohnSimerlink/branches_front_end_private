import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IHash, IMutableSubscribableUser, IUserData, CONTENT_TYPES,
    ISyncableMutableSubscribableUser, IUserDataFromDB, timestamp
} from '../../objects/interfaces';
import {SyncableMutableSubscribableUser} from '../../objects/user/SyncableMutableSubscribableUser';
import {isValidUserDataFromDB} from '../../objects/user/userValidator';
import {TreeDeserializer} from '../tree/TreeDeserializer';
import {log} from '../../core/log'
import {DEFAULT_MEMBERSHIP_EXPIRATION_DATE} from '../../objects/user/usersUtils';

export class UserDeserializer {
   public static deserialize(
       {userData}: {userData: IUserData}
       ): ISyncableMutableSubscribableUser {
       const membershipExpirationDate
           = new MutableSubscribableField<timestamp>({field: userData.membershipExpirationDate})
       const everActivatedMembership = new MutableSubscribableField<boolean>({field: userData.everActivatedMembership})
       const points = new MutableSubscribableField<number>({field: userData.points})

       const user: ISyncableMutableSubscribableUser = new SyncableMutableSubscribableUser(
           {
               updatesCallbacks: [],
               membershipExpirationDate,
               everActivatedMembership,
               points,
           })
       return user
   }
   public static convertUserDataFromDBToApp(
       {userDataFromDB}: {userDataFromDB: IUserDataFromDB}): IUserData {
      const userData: IUserData = {
          membershipExpirationDate:
            userDataFromDB.membershipExpirationDate && userDataFromDB.membershipExpirationDate.val || DEFAULT_MEMBERSHIP_EXPIRATION_DATE,
          everActivatedMembership:
            userDataFromDB.everActivatedMembership && userDataFromDB.everActivatedMembership.val || false,
          points:
            userDataFromDB.points && userDataFromDB.points.val || 0
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
       const user: ISyncableMutableSubscribableUser
            = UserDeserializer.deserialize({userData})
       return user
    }
}
