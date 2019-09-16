import {
	inject,
	injectable,
	tagged
} from 'inversify';
import {TYPES} from '../../objects/types';
import {
	id,
	IFamilyLoaderCore,
	ISigmaNodeLoader,
	ISubscribableTreeStoreSource,
	ISyncableMutableSubscribableTree,
	ITreeDataWithoutId
} from '../../objects/interfaces';
import {Store} from 'vuex';
import {TAGS} from '../../objects/tags';
import {error} from '../../core/log';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';

@injectable()
export class FamilyLoaderCore implements IFamilyLoaderCore {
	private sigmaNodeLoader: ISigmaNodeLoader;
	private store: Store<any>;
	private treeStoreSource: ISubscribableTreeStoreSource;

	constructor(@inject(TYPES.FamilyLoaderCoreArgs){
		sigmaNodeLoader,
		store,
		treeStoreSource,
	}: FamilyLoaderCoreArgs) {
		this.sigmaNodeLoader = sigmaNodeLoader;
		this.store = store;
		this.treeStoreSource = treeStoreSource;
	}

	public loadFamily(sigmaId: id) {
		const treeId = sigmaId;
		const tree: ISyncableMutableSubscribableTree = this.treeStoreSource.get(treeId);
		if (!tree) {
			error('tree with treeId of', treeId, ' could not be found in ', this.treeStoreSource);
			return;
		}
		const treeDataWithoutId: ITreeDataWithoutId = tree.val();
		const children: id[] = treeDataWithoutId.children;
		const sigmaIds = [...children, treeDataWithoutId.parentId];
		// this.store.commit(MUTATION_NAMES.DISABLE_REFRESH)
		// TODO: make a server with like GraphQL or something to combine this all into one query. Yeah, use a sort of queryBuilder, rather than make X different requests at once
		const load = this.sigmaNodeLoader.loadIfNotLoaded.bind(this.sigmaNodeLoader);
		sigmaIds.forEach(load);
		// this.store.commit(MUTATION_NAMES.ENABLE_REFRESH)
		// this.store.commit(MUTATION_NAMES.REFRESH)
	}

}

@injectable()
export class FamilyLoaderCoreArgs {
	@inject(TYPES.ISigmaNodeLoader) public sigmaNodeLoader: ISigmaNodeLoader;
	@inject(TYPES.BranchesStore) public store: Store<any>;
	@inject(TYPES.ISubscribableTreeStoreSource)
	@tagged(TAGS.MAIN_APP, true)
	public treeStoreSource: ISubscribableTreeStoreSource;
}
