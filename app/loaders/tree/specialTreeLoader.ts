import * as firebase from 'firebase';
import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    IHash,
    IMutableSubscribableTree, ISubscribableStoreSource, ISubscribableTreeStoreSource, ITreeDataFromFirebase,
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
    private contentIdSigmaIdsMap: IHash<IHash<boolean>>
    constructor(@inject(TYPES.SpecialTreeLoaderArgs){treeLoader, contentIdSigmaIdsMap}) {
        this.treeLoader = treeLoader
        this.contentIdSigmaIdsMap = contentIdSigmaIdsMap
    }

    public async downloadData(treeId: string): Promise<ITreeDataWithoutId> {
        log('specialTreeLoader download called')
        const treeDataWithoutId: ITreeDataWithoutId = await this.treeLoader.downloadData(treeId)
        log('treeLoader download finishedcalled')
        const contentId = treeDataWithoutId.contentId
        const sigmaId = treeId
        if (!this.contentIdSigmaIdsMap[contentId]) {
            this.contentIdSigmaIdsMap[contentId] = {}
        }
        this.contentIdSigmaIdsMap[contentId][sigmaId] = true
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
export class TreeLoaderArgs {
    @inject(TYPES.ITreeLoader) public treeLoader: ITreeLoader
    @inject(TYPES.Object) public contentIdSigmaIdsMap: IHash<IHash<boolean>>
}
