import {inject, injectable, tagged} from 'inversify';
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
import {error, log} from '../../core/log';

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
		const load = this.sigmaNodeLoader.loadIfNotLoaded.bind(this.sigmaNodeLoader);
		sigmaIds.forEach(load);
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
