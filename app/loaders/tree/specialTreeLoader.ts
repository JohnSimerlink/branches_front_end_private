import {
	inject,
	injectable,
	tagged
} from 'inversify';
import {log} from '../../../app/core/log';
import {
	id,
	IOneToManyMap,
	ISyncableMutableSubscribableTree,
	ITreeDataWithoutId,
	ITreeLoader
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {TAGS} from '../../objects/tags';

@injectable()
export class SpecialTreeLoader implements ITreeLoader {
	private treeLoader: ITreeLoader;
	private contentIdSigmaIdsMap: IOneToManyMap<string>;

	constructor(@inject(TYPES.SpecialTreeLoaderArgs){treeLoader, contentIdSigmaIdsMap}: SpecialTreeLoaderArgs) {
		this.treeLoader = treeLoader;
		this.contentIdSigmaIdsMap = contentIdSigmaIdsMap;
	}

	public async downloadData(treeId: string): Promise<ITreeDataWithoutId> {
		const treeDataWithoutId: ITreeDataWithoutId = await this.treeLoader.downloadData(treeId);
		const contentId = treeDataWithoutId.contentId;
		const sigmaId = treeId;
		this.contentIdSigmaIdsMap.set(contentId, sigmaId);
		return treeDataWithoutId;
	}

	public isLoaded(treeId): boolean {
		return this.treeLoader.isLoaded(treeId);
	}

	public getData(treeId) {
		return this.treeLoader.getData(treeId);
	}

	public getItem(treeId): ISyncableMutableSubscribableTree {
		return this.treeLoader.getItem(treeId);
	}

}

@injectable()
export class SpecialTreeLoaderArgs {
	@inject(TYPES.ITreeLoader) public treeLoader: ITreeLoader;
	@inject(TYPES.IOneToManyMap) @tagged(TAGS.CONTENT_ID_SIGMA_IDS_MAP, true) public contentIdSigmaIdsMap: IOneToManyMap<id>;
}
