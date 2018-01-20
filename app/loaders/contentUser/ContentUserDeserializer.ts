import {SubscribableMutableField} from '../../objects/field/SubscribableMutableField';
import {
    IContentUserData,
    ISyncableMutableSubscribableContentUser
} from '../../objects/interfaces';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
import {SyncableMutableSubscribableContentUser} from '../../objects/contentUser/SyncableMutableSubscribableContentUser';

class ContentUserDeserializer {
   public static deserialize(
       {contentUserData, id}: {id: string, contentUserData: IContentUserData}
       ): ISyncableMutableSubscribableContentUser {

       const overdue = new SubscribableMutableField<boolean>({field: contentUserData.overdue})
       const lastRecordedStrength = new SubscribableMutableField<number>({field: contentUserData.lastRecordedStrength})
       const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: contentUserData.proficiency})
       const timer = new SubscribableMutableField<number>({field: contentUserData.timer})

       const contentUser: ISyncableMutableSubscribableContentUser = new SyncableMutableSubscribableContentUser(
           {updatesCallbacks: [], id, overdue, lastRecordedStrength, proficiency, timer}
           )
       return contentUser
   }
}
export {ContentUserDeserializer}
