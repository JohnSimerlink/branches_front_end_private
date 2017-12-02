import {
    AllObjectMutationTypes, IGlobalDatedMutation, IMutableSubscribableGlobalStore,
    ObjectTypes
} from '../interfaces';
import {SubscribableGlobalDataStore} from './SubscribableGlobalDataStore';

class MutableSubscribableGlobalStore extends SubscribableGlobalDataStore implements IMutableSubscribableGlobalStore {
    constructor({treeStore, updatesCallbacks}) {
        super({subscribableTreeDataStore, updatesCallbacks})
    }
    public addMutation(mutation: IGlobalDatedMutation<AllObjectMutationTypes>) {
        switch (mutation.objectType) {
            case ObjectTypes.TREE:
                this.treeStore.addMutation(mutation)
        }
    }

    public mutations(): Array<IGlobalDatedMutation<AllObjectMutationTypes>> {
        throw new Error('Method not implemented.');
    }

}
