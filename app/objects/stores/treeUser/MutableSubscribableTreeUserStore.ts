import {
    IIdProppedDatedMutation, IMutableSubscribableTreeUser,
    IMutableSubscribableTreeUserStore,
    IProppedDatedMutation,
    TreeUserPropertyMutationTypes,
    TreeUserPropertyNames
} from '../../interfaces';
import {SubscribableTreeUserStore} from './SubscribableTreeUserStore';

export class MutableSubscribableTreeUserStore
    extends SubscribableTreeUserStore
    implements IMutableSubscribableTreeUserStore {
    public addMutation(    mutation: IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames>) {
        // const treeUserId = mutation.id
        // treeUserId && this.stores[treeUserId].addMutation
        // mutation.id

        const id = mutation.id
        const treeUser: IMutableSubscribableTreeUser
            = this.storeSource.get(id)
        if (!treeUser) {
            throw new RangeError('Couldn\'t find treeUser for treeUserId: ' + id)
        }

        const proppedDatedMutation:
            IProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
            data: mutation.data,
            propertyName: mutation.propertyName,
            timestamp: mutation.timestamp,
            type: mutation.type,
        }
        treeUser.addMutation(proppedDatedMutation)
        // throw new Error("Method not implemented.");
    }

    public mutations(): Array<IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames>> {
        throw new Error('Not implemented!')
    }
}
