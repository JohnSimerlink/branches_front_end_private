import * as firebase from 'firebase';
import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    IHash,
    IMutableSubscribableTree, IOneToManyMap, ISubscribableStoreSource, ISubscribableTreeStoreSource,
    ITreeDataFromFirebase,
    ITreeDataWithoutId,
    ITreeLoader
} from '../../objects/interfaces';
import {isValidTree} from '../../objects/tree/treeValidator';
import Reference = firebase.database.Reference;
import {TYPES} from '../../objects/types';
import {TreeDeserializer} from './TreeDeserializer';
import {setToStringArray} from '../../core/newUtils';

@injectable()
export class SpecialTreeLoader implements ITreeLoader {
    private treeLoader: ITreeLoader
    private contentIdSigmaIdsMap: IOneToManyMap<string>
    constructor(@inject(TYPES.SpecialTreeLoaderArgs){treeLoader, contentIdSigmaIdsMap}: {
        treeLoader: ITreeLoader,
        contentIdSigmaIdsMap: IOneToManyMap<string>
    }) {
        this.treeLoader = treeLoader
        this.contentIdSigmaIdsMap = contentIdSigmaIdsMap
    }

    public async downloadData(treeId: string): Promise<ITreeDataWithoutId> {
        log('specialTreeLoader download called')
        const treeDataWithoutId: ITreeDataWithoutId = await this.treeLoader.downloadData(treeId)
        log('treeLoader download finishedcalled')
        const contentId = treeDataWithoutId.contentId
        const sigmaId = treeId
        this.contentIdSigmaIdsMap.set(contentId, sigmaId)
        log('specialTreeLoader download called finished', this.contentIdSigmaIdsMap)
        return treeDataWithoutId
    }

    public isLoaded(treeId): boolean {
        return this.treeLoader.isLoaded(treeId)
    }
    public getData(treeId) {
        return this.treeLoader.getData(treeId)
    }

}

@injectable()
export class SpecialTreeLoaderArgs {
    @inject(TYPES.ITreeLoader) public treeLoader: ITreeLoader
    @inject(TYPES.IOneToManyMap) public contentIdSigmaIdsMap: IOneToManyMap<string>
}
