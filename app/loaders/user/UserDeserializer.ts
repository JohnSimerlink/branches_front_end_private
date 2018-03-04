import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IHash, IMutableSubscribableUser, IUserData, CONTENT_TYPES,
    ISyncableMutableSubscribableUser, IUserDataFromDB, timestamp, id
} from '../../objects/interfaces';
import {SyncableMutableSubscribableUser} from '../../objects/user/SyncableMutableSubscribableUser';
import {isValidUserDataFromDB} from '../../objects/user/userValidator';
import {TreeDeserializer} from '../tree/TreeDeserializer';
import {log} from '../../core/log'
import {DEFAULT_MEMBERSHIP_EXPIRATION_DATE} from '../../objects/user/usersUtils';
import * as firebase from "firebase";
import {DEFAULT_USER_INFO} from "../../core/globals";

export class UserDeserializer {
   public static deserialize(
       {userData}: {userData: IUserData}
       ): ISyncableMutableSubscribableUser {
       const membershipExpirationDate
           = new MutableSubscribableField<timestamp>({field: userData.membershipExpirationDate})
       const everActivatedMembership = new MutableSubscribableField<boolean>({field: userData.everActivatedMembership})
       const points = new MutableSubscribableField<number>({field: userData.points})
       const rootMapId = new MutableSubscribableField<id>({field: userData.rootMapId})
       const userInfo = new MutableSubscribableField<firebase.UserInfo>({field: userData.userInfo})
       const openMapId = new MutableSubscribableField<id>({field: userData.openMapId})
       const currentHoveredTreeId = new MutableSubscribableField<id>({field: userData.currentHoveredTreeId})

       const user: ISyncableMutableSubscribableUser = new SyncableMutableSubscribableUser(
           {
               updatesCallbacks: [],
               membershipExpirationDate,
               everActivatedMembership,
               points,
               rootMapId,
               userInfo,
               openMapId,
               currentHoveredTreeId,
           })
       return user
   }
   public static convertUserDataFromDBToApp(
       {userDataFromDB}: {userDataFromDB: IUserDataFromDB}): IUserData {
      const userData: IUserData = {
          membershipExpirationDate:
            userDataFromDB.membershipExpirationDate && userDataFromDB.membershipExpirationDate.val
            || DEFAULT_MEMBERSHIP_EXPIRATION_DATE,
          everActivatedMembership:
            userDataFromDB.everActivatedMembership && userDataFromDB.everActivatedMembership.val || false,
          points:
            userDataFromDB.points && userDataFromDB.points.val || 0,
          rootMapId:
            userDataFromDB.rootMapId && userDataFromDB.rootMapId.val || null,
          openMapId:
            userDataFromDB.openMapId && userDataFromDB.openMapId.val || null,
          currentHoveredTreeId:
            userDataFromDB.currentHoveredTreeId && userDataFromDB.currentHoveredTreeId.val || null,
          userInfo: userDataFromDB.userInfo && userDataFromDB.userInfo.val || DEFAULT_USER_INFO
       // TODO: catch that error and display it in some sort of toast at the bottom of the screen
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
