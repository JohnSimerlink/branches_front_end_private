import {
    ContentUserPropertyMutationTypes, ContentUserPropertyNames,
    IIdDatedMutation, IIdProppedDatedMutation, IMutableSubscribableContentUser, IMutableSubscribableTree,
    IMutableSubscribableTreeStore,
    IProppedDatedMutation,
    TreeMutationTypes,
    TreePropertyMutationTypes,
    TreePropertyNames
} from '../../interfaces';
import {SubscribableTreeStore} from './SubscribableTreeStore';

class MutableSubscribableTreeStore
    extends SubscribableTreeStore
    implements IMutableSubscribableTreeStore {
    public addMutation(    mutation: IIdProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>) {
        // const treeId = mutation.id
        // treeId && this.stores[treeId].addMutation
        // mutation.id

        const id = mutation.id
        const tree: IMutableSubscribableTree
            = this.store[id]
        if (!tree) {
            throw new RangeError('Couldn\'t find tree for treeId: ' + id)
        }

        const proppedDatedMutation:
            IProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames> = {
            data: mutation.data,
            propertyName: mutation.propertyName,
            timestamp: mutation.timestamp,
            type: mutation.type,
        }
        tree.addMutation(proppedDatedMutation)
        // throw new Error("Method not implemented.");
    }

    public mutations(): Array<IIdProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>> {
        throw new Error('Not implemented!')
    }
}

export {MutableSubscribableTreeStore}
