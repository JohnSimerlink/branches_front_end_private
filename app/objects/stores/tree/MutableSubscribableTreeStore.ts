import {IIdDatedMutation, IMutableSubscribableTreeStore, TreeMutationTypes} from '../../interfaces';
import {SubscribableTreeStore} from './SubscribableTreeStore';

class MutableSubscribableTreeStore
    extends SubscribableTreeStore
    implements IMutableSubscribableTreeStore {
    public addMutation(mutation: IIdDatedMutation<TreeMutationTypes>) {
        // const treeId = mutation.id
        // treeId && this.stores[treeId].addMutation
        // mutation.id

    }

    public mutations(): Array<IIdDatedMutation<TreeMutationTypes>> {
        throw new Error('Not implemented!')
    }
}
