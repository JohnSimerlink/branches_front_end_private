import {IIdDatedMutation, IMutableSubscribableTreeDataStore, TreeMutationTypes} from '../interfaces';
import {SubscribableTreeDataStore} from './SubscribableTreeDataStore';

class MutableSubscribableTreeDataStore
    extends SubscribableTreeDataStore
    implements IMutableSubscribableTreeDataStore {
    public addMutation(mutation: IIdDatedMutation<TreeMutationTypes>) {
        const treeId = mutation.id
        treeId && this.store[treeId].addMutation
        mutation.id

    }

    public mutations(): Array<IIdDatedMutation<TreeMutationTypes>> {
        throw new Error('Not implemented!')
    }
    
}
