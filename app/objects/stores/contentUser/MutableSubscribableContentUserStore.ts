import {log} from '../../../core/log'
import {
    ContentUserPropertyMutationTypes,
    ContentUserPropertyNames, IContentUserData,
    IIdProppedDatedMutation, IMutableSubscribableContentUser,
    IMutableSubscribableContentUserStore, IProppedDatedMutation,
} from '../../interfaces';
import {SubscribableContentUserStore} from './SubscribableContentUserStore';
import {ContentUserDeserializer} from '../../../loaders/contentUser/ContentUserDeserializer';

class MutableSubscribableContentUserStore extends SubscribableContentUserStore
    implements IMutableSubscribableContentUserStore {
    public addItem({id, contentUserData}: { id: string; contentUserData: IContentUserData; }) {
        const contentUser: IMutableSubscribableContentUser =
            ContentUserDeserializer.deserialize({id, contentUserData})
        this.storeSource.set(id, contentUser)

    }

    public addMutation(
        mutation: IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>
    ) {
        // TODO: what to do if object does not exist in storeSource
        const id = mutation.id
        const contentUser: IMutableSubscribableContentUser
            = this.storeSource.get(id)
        if (!contentUser) {
            throw new RangeError('Couldn\'t find contentuser for contentUserId' + id)
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
    public mutations(): Array<IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>> {
        // return [] as Array<IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>>
        throw new Error('Not Implemented')
    }
}

export {MutableSubscribableContentUserStore}
