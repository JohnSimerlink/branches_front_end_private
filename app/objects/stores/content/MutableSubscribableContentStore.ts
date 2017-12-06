import {log} from '../../../core/log'
import {
    ContentPropertyMutationTypes,
    ContentPropertyNames,
    FieldMutationTypes,
    IIdProppedDatedMutation, IMutableSubscribableContent,
    IMutableSubscribableContentStore, IProppedDatedMutation,
} from '../../interfaces';
import {SubscribableContentStore} from './SubscribableContentStore';

class MutableSubscribableContentStore extends SubscribableContentStore
    implements IMutableSubscribableContentStore {
    public mutations(): Array<IIdProppedDatedMutation<FieldMutationTypes, ContentPropertyNames>> {
        throw new Error('Method not implemented.');
    }

    public addMutation(
        mutation: IIdProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames>
    ) {
        // TODO: what to do if object does not exist in store
        const id = mutation.id
        const content: IMutableSubscribableContent
            = this.store[id]
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
