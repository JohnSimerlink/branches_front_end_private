import {log} from '../../../core/log'
import {
    ContentPropertyMutationTypes,
    ContentPropertyNames,
    FieldMutationTypes, IContentData, IContentUserData,
    IIdProppedDatedMutation, IMutableSubscribableContent,
    IMutableSubscribableContentStore, IProppedDatedMutation, ISyncableMutableSubscribableContent,
    ISyncableMutableSubscribableContentUser,
} from '../../interfaces';
import {SubscribableContentStore} from './SubscribableContentStore';
import {ContentDeserializer} from '../../../loaders/content/ContentDeserializer';

class MutableSubscribableContentStore extends SubscribableContentStore
    implements IMutableSubscribableContentStore {
    public addAndSubscribeToItemFromData(
        {id, contentData}:
            { id: string; contentData: IContentData; }): ISyncableMutableSubscribableContent {
        // content
        const content: ISyncableMutableSubscribableContent =
            ContentDeserializer.deserialize({contentId: id, contentData})
        this.addAndSubscribeToItem(id, content)
        return content
    }
    public mutations(): Array<IIdProppedDatedMutation<FieldMutationTypes, ContentPropertyNames>> {
        throw new Error('Method not implemented.');
    }

    public addMutation(
        mutation: IIdProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames>
    ) {
        // TODO: what to do if object does not exist in storeSource
        const id = mutation.id
        const content: IMutableSubscribableContent
            = this.storeSource.get(id)
        if (!content) {
            throw new RangeError('Couldn\'t find content for contentId' + id)
        }

        const proppedDatedMutation:
            IProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames> = {
            data: mutation.data,
            propertyName: mutation.propertyName,
            timestamp: mutation.timestamp,
            type: mutation.type,
        }
        content.addMutation(proppedDatedMutation)
        // throw new Error("Method not implemented.");
    }
}

export {MutableSubscribableContentStore}
