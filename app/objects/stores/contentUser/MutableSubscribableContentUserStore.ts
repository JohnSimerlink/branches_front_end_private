import {log} from '../../../core/log'
import {
    ContentUserPropertyMutationTypes,
    ContentUserPropertyNames,
    FieldMutationTypes,
    IIdProppedDatedMutation, IMutableSubscribableContentUser,
    IMutableSubscribableContentUserStore, IProppedDatedMutation,
} from '../../interfaces';
import {SubscribableContentUserStore} from './SubscribableContentUserStore';

class MutableSubscribableContentUserStore extends SubscribableContentUserStore
    implements IMutableSubscribableContentUserStore {
    public mutations(): Array<IIdProppedDatedMutation<FieldMutationTypes, ContentUserPropertyNames>> {
        throw new Error('Method not implemented.');
    }

    public addMutation(
        mutation: IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>
    ) {
        // TODO: what to do if object does not exist in store
        const id = mutation.id
        const contentUser: IMutableSubscribableContentUser
            = this.store[id]
        if (!contentUser) {
            throw new RangeError('Couldn\'t find contentUser for contentId' + id)
        }

        const proppedDatedMutation:
            IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
            data: mutation.data,
            propertyName: mutation.propertyName,
            timestamp: mutation.timestamp,
            type: mutation.type,
        }
        contentUser.addMutation(proppedDatedMutation)
        // throw new Error("Method not implemented.");
    }
}

export {MutableSubscribableContentUserStore}
