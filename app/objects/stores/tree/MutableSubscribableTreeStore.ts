import {
    IIdProppedDatedMutation, IMutableSubscribableTree,
    IMutableSubscribableTreeStore,
    IProppedDatedMutation, ISyncableMutableSubscribableTree, ITreeData,
    TreePropertyMutationTypes,
    TreePropertyNames
} from '../../interfaces';
import {SubscribableTreeStore} from './SubscribableTreeStore';
import {TreeDeserializer} from '../../../loaders/tree/TreeDeserializer';

class MutableSubscribableTreeStore
    extends SubscribableTreeStore
    implements IMutableSubscribableTreeStore {
    public addAndSubscribeToItemFromData({id, treeData}: { id: string; treeData: ITreeData }):
    IMutableSubscribableTree {
        const tree: ISyncableMutableSubscribableTree =
            TreeDeserializer.deserialize({treeId: id, treeData})
        this.addAndSubscribeToItem(id, tree)
        return undefined;
    }
    public addMutation(    mutation: IIdProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>) {
        // const treeId = mutation.id
        // treeId && this.stores[treeId].addMutation
        // mutation.id

        const id = mutation.id
        const tree: IMutableSubscribableTree
            = this.storeSource.get(id)
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
