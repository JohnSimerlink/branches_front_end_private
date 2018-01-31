import {inject, injectable} from 'inversify';
import {TYPES} from '../../objects/types';
import {
    IFamilyLoader, ISigmaNodeLoader, ISubscribableTreeStoreSource, id,
    ISyncableMutableSubscribableTree, ITreeDataWithoutId
} from '../../objects/interfaces';
import {Store} from 'vuex';

@injectable()
export class FamilyLoader implements IFamilyLoader {
    private sigmaNodeLoader: ISigmaNodeLoader
    private store: Store<any>
    private treeStoreSource: ISubscribableTreeStoreSource
    constructor(@inject(TYPES.FamilyLoaderArgs){
        sigmaNodeLoader,
        store,
        treeStoreSource,
    }: FamilyLoaderArgs) {
        this.sigmaNodeLoader = sigmaNodeLoader
        this.store = store
        this.treeStoreSource = treeStoreSource
    }
    public loadFamily(sigmaId: id) {
        const treeId = sigmaId
        const tree: ISyncableMutableSubscribableTree = this.treeStoreSource.get(treeId)
        const treeDataWithoutId: ITreeDataWithoutId = tree.val()
        const children: id[] = treeDataWithoutId.children
        const sigmaIds = [...children, treeDataWithoutId.parentId]
        const load = this.sigmaNodeLoader.loadIfNotLoaded.bind(this.sigmaNodeLoader)
        sigmaIds.forEach(load)
    }

}

@injectable()
export class FamilyLoaderArgs {
    @inject(TYPES.ISigmaNodeLoader) public sigmaNodeLoader: ISigmaNodeLoader
    @inject(TYPES.BranchesStore) public store: Store<any>
    @inject(TYPES.ISubscribableTreeStoreSource) public treeStoreSource: ISubscribableTreeStoreSource

}
