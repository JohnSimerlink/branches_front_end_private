import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IContentUserData, IContentUserDataFromDB,
    ISyncableMutableSubscribableContentUser
} from '../../objects/interfaces';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
import {SyncableMutableSubscribableContentUser} from '../../objects/contentUser/SyncableMutableSubscribableContentUser';

class ContentUserDeserializer {
   public static deserialize(
       {contentUserData, id}: {id: string, contentUserData: IContentUserData}
       ): ISyncableMutableSubscribableContentUser {

       const overdue = new MutableSubscribableField<boolean>({field: contentUserData.overdue})
       const lastRecordedStrength = new MutableSubscribableField<number>({field: contentUserData.lastRecordedStrength})
       const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: contentUserData.proficiency})
       const timer = new MutableSubscribableField<number>({field: contentUserData.timer})

       const contentUser: ISyncableMutableSubscribableContentUser = new SyncableMutableSubscribableContentUser(
           {updatesCallbacks: [], id, overdue, lastRecordedStrength, proficiency, timer}
           )
       return contentUser
   }
    public static deserializeFromDB(
        {contentUserDataFromDB, id}: {id: string, contentUserDataFromDB: IContentUserDataFromDB}
    ): ISyncableMutableSubscribableContentUser {
        const contentUserData: IContentUserData
            = ContentUserDeserializer.convertDBDataToObjectData({id, contentUserDataFromDB})

        const overdue = new MutableSubscribableField<boolean>({field: contentUserData.overdue})
        const lastRecordedStrength = new MutableSubscribableField<number>({field: contentUserData.lastRecordedStrength})
        const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: contentUserData.proficiency})
        const timer = new MutableSubscribableField<number>({field: contentUserData.timer})

        const contentUser: ISyncableMutableSubscribableContentUser = new SyncableMutableSubscribableContentUser(
            {updatesCallbacks: [], id, overdue, lastRecordedStrength, proficiency, timer}
        )
        return contentUser
    }
    public static convertDBDataToObjectData(
        {contentUserDataFromDB, id}: {contentUserDataFromDB: IContentUserDataFromDB, id: string}
    ): IContentUserData {
        const overdue = contentUserDataFromDB.overdue && contentUserDataFromDB.overdue.val
        const lastRecordedStrength =
            contentUserDataFromDB.lastRecordedStrength && contentUserDataFromDB.lastRecordedStrength.val
        const proficiency = contentUserDataFromDB.proficiency && contentUserDataFromDB.proficiency.val
        const timer = contentUserDataFromDB.timer && contentUserDataFromDB.timer.val
        const contentUserData: IContentUserData = {
            id,
            overdue,
            lastRecordedStrength,
            proficiency,
            timer,
        }
        return contentUserData
    }
}
export {ContentUserDeserializer}
