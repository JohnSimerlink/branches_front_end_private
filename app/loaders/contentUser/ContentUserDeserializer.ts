import {setToStringArray, stringArrayToSet} from '../../core/newUtils';
import {SubscribableMutableField} from '../../objects/field/SubscribableMutableField';
import {IContentUserData, IHash, IMutableSubscribableContentUser} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableContentUser} from '../../objects/contentUser/MutableSubscribableContentUser';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';

class ContentUserDeserializer {
   public static deserialize(
       {contentUserData, contentUserId}: {contentUserData: IContentUserData, contentUserId: string}
       ): IMutableSubscribableContentUser {

       const overdue = new SubscribableMutableField<boolean>({field: contentUserData.overdue})
       const lastRecordedStrength = new SubscribableMutableField<number>({field: contentUserData.lastRecordedStrength})
       const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: contentUserData.proficiency})
       const timer = new SubscribableMutableField<number>({field: contentUserData.timer})

       const contentUser: IMutableSubscribableContentUser = new MutableSubscribableContentUser(
           {updatesCallbacks: [], overdue, lastRecordedStrength, proficiency, timer}
           )
       return contentUser
   }
}
export {ContentUserDeserializer}
