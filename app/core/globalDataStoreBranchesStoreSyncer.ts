import {inject, injectable, tagged} from 'inversify';
import {
    IGlobalDataStoreBranchesStoreSyncer, IMutableSubscribableGlobalStore,
    ISetContentDataMutationArgs,
    ISetContentUserDataMutationArgs, ISetTreeDataMutationArgs,
    ISetTreeLocationDataMutationArgs, ISetTreeUserDataMutationArgs,
    ITypeAndIdAndValUpdates,
    GlobalDataStoreObjectDataTypes,
} from '../objects/interfaces';
import {log} from './log'
import {TYPES} from '../objects/types';
import BranchesStore, {MUTATION_NAMES} from './store';
import {Store} from 'vuex';
@injectable()
export class GlobalDataStoreBranchesStoreSyncer implements IGlobalDataStoreBranchesStoreSyncer {
    private globalDataStore: IMutableSubscribableGlobalStore
    private branchesStore: Store<any>
    constructor(@inject(TYPES.GlobalDataStoreBranchesStoreSyncerArgs){
        globalDataStore, branchesStore}: GlobalDataStoreBranchesStoreSyncerArgs ) {
        this.globalDataStore = globalDataStore
        this.branchesStore = branchesStore
    }
    public start() {
        this.globalDataStore.onUpdate((update: ITypeAndIdAndValUpdates) => {
            switch (update.type) {
                case GlobalDataStoreObjectDataTypes.TREE_DATA: {
                    const mutationArgs: ISetTreeDataMutationArgs = {
                        treeId: update.id,
                        treeDataWithoutId: update.val,
                    }
                    this.branchesStore.commit(MUTATION_NAMES.SET_TREE_DATA, mutationArgs)
                    break;
                }
                case GlobalDataStoreObjectDataTypes.TREE_LOCATION_DATA: {
                    const mutationArgs: ISetTreeLocationDataMutationArgs = {
                        treeId: update.id,
                        treeLocationData: update.val,
                    }
                    this.branchesStore.commit(MUTATION_NAMES.SET_TREE_LOCATION_DATA, mutationArgs)
                    break;
                }
                case GlobalDataStoreObjectDataTypes.TREE_USER_DATA: {
                    const mutationArgs: ISetTreeUserDataMutationArgs = {
                        treeId: update.id,
                        treeUserData: update.val,
                    }
                    this.branchesStore.commit(MUTATION_NAMES.SET_TREE_USER_DATA, mutationArgs)
                    break;
                }
                case GlobalDataStoreObjectDataTypes.CONTENT_DATA: {
                    const mutationArgs: ISetContentDataMutationArgs = {
                        contentId: update.id,
                        contentData: update.val,
                    }
                    this.branchesStore.commit(MUTATION_NAMES.SET_CONTENT_DATA, mutationArgs)
                    break;
                }
                case GlobalDataStoreObjectDataTypes.CONTENT_USER_DATA: {
                    const mutationArgs: ISetContentUserDataMutationArgs = {
                        contentUserId: update.id,
                        contentUserData: update.val,
                    }
                    this.branchesStore.commit(MUTATION_NAMES.SET_CONTENT_USER_DATA, mutationArgs)
                    break;
                }
            }
        })
    }
}

@injectable()
export class GlobalDataStoreBranchesStoreSyncerArgs {
    @inject(TYPES.BranchesStore) public branchesStore: Store<any>
    @inject(TYPES.IMutableSubscribableGlobalStore) public globalDataStore: IMutableSubscribableGlobalStore
}
