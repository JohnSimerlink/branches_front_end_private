import {
    IIdProppedDatedMutation, IMutableSubscribableTree,
    IMutableSubscribableTreeStore,
    IProppedDatedMutation, ISyncableMutableSubscribableTree, ITreeData, ITreeDataWithoutId,
    TreePropertyMutationTypes,
    TreePropertyNames
} from '../../interfaces';
import {SubscribableTreeStore} from './SubscribableTreeStore';
import {TreeDeserializer} from '../../../loaders/tree/TreeDeserializer';
import {log} from '../../../core/log'

export class MutableSubscribableTreeStore
    extends SubscribableTreeStore
    implements IMutableSubscribableTreeStore {
    public addAndSubscribeToItemFromData(
        {id, treeDataWithoutId}: { id: string; treeDataWithoutId: ITreeDataWithoutId }):
    ISyncableMutableSubscribableTree {
        const tree: ISyncableMutableSubscribableTree =
            TreeDeserializer.deserializeWithoutId({treeId: id, treeDataWithoutId})
        this.addAndSubscribeToItem(id, tree)
        return tree;
    }
    public addMutation(    mutation: IIdProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>) {
        // const treeId = mutation.id
        // treeId && this.stores[treeId].addMutation
        // mutation.id
        log('MutableSubscribableTreeStore addMutation ', mutation)

        const id = mutation.id
        const tree: IMutableSubscribableTree
            = this.storeSource.get(id)
        if (!tree) {
            throw new RangeError('Couldn\'t find tree for treeId: ' + id + ' in the following storeSource '
                + this.storeSource + ' ' + this.storeSource['_id'])
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
