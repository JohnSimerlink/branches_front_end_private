import {setToStringArray, stringArrayToSet} from '../../core/newUtils';
import {SubscribableMutableField} from '../../objects/field/SubscribableMutableField';
import {IHash, IMutableSubscribableContent, IContentData, CONTENT_TYPES} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableContent} from '../../objects/content/MutableSubscribableContent';

class ContentDeserializer {
   public static deserialize(
       {contentData, contentId}: {contentData: IContentData, contentId: string}
       ): IMutableSubscribableContent {
       const type = new SubscribableMutableField<CONTENT_TYPES>({field: contentData.type})
       /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
        // TODO: figure out why DI puts in a bad updatesCallback!
       */
       const question = new SubscribableMutableField<string>({field: contentData.question})
       const answer = new SubscribableMutableField<string>({field: contentData.answer})
       const title = new SubscribableMutableField<string>({field: contentData.title})
       const content: IMutableSubscribableContent = new MutableSubscribableContent(
           {updatesCallbacks: [], type, question, answer, title}
           )
       return content
   }
}
export {ContentDeserializer}
