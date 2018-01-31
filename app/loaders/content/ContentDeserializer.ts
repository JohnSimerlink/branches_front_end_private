import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IHash, IMutableSubscribableContent, IContentData, CONTENT_TYPES,
    ISyncableMutableSubscribableContent, IContentDataFromDB
} from '../../objects/interfaces';
import {SyncableMutableSubscribableContent} from '../../objects/content/SyncableMutableSubscribableContent';
import {isValidContentUserDataFromDB} from '../../objects/contentUser/ContentUserValidator';
import {isValidContentDataFromDB} from '../../objects/content/contentValidator';
import {TreeDeserializer} from '../tree/TreeDeserializer';

export class ContentDeserializer {
   public static deserialize(
       {contentData, contentId}: {contentData: IContentData, contentId: string}
       ): ISyncableMutableSubscribableContent {
       const type = new MutableSubscribableField<CONTENT_TYPES>({field: contentData.type})
       /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
        // TODO: figure out why DI puts in a bad IUpdatesCallback!
       */
       const question = new MutableSubscribableField<string>({field: contentData.question})
       const answer = new MutableSubscribableField<string>({field: contentData.answer})
       const title = new MutableSubscribableField<string>({field: contentData.title})
       const content: ISyncableMutableSubscribableContent = new SyncableMutableSubscribableContent(
           {updatesCallbacks: [], type, question, answer, title}
           )
       return content
   }
   public static convertContentDataFromDBToApp(
       {contentDataFromDB}: {contentDataFromDB: IContentDataFromDB}): IContentData {
      const contentData: IContentData = {
          type: contentDataFromDB.type.val,
          question: contentDataFromDB.question && contentDataFromDB.question.val,
          answer: contentDataFromDB.answer && contentDataFromDB.answer.val,
          title: contentDataFromDB.title && contentDataFromDB.title.val,
      }
      return contentData
   }
    public static deserializeFromDB(
        {contentDataFromDB, contentId}: {contentDataFromDB: IContentDataFromDB, contentId: string}
    ): ISyncableMutableSubscribableContent {
       if (!isValidContentDataFromDB(contentDataFromDB)) {
           throw new Error('Cannot deserialize content from db with id of ' + contentId
               + ' and value of ' + contentDataFromDB)
       }
       const contentData: IContentData = ContentDeserializer.convertContentDataFromDBToApp({contentDataFromDB})
       const content: ISyncableMutableSubscribableContent
            = ContentDeserializer.deserialize({contentData, contentId})
       return content
    }
}
