import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IHash, IMutableSubscribableContent, IContentData, CONTENT_TYPES,
    ISyncableMutableSubscribableContent
} from '../../objects/interfaces';
import {SyncableMutableSubscribableContent} from '../../objects/content/SyncableMutableSubscribableContent';

class ContentDeserializer {
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
}
export {ContentDeserializer}
