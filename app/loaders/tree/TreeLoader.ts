import * as firebase from 'firebase';
import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    IMutableSubscribableTree, ISubscribableStoreSource, ISubscribableTreeStoreSource, ITreeDataWithoutId,
    ITreeLoader
} from '../../objects/interfaces';
import {isValidTree} from '../../objects/tree/treeValidator';
import Reference = firebase.database.Reference;
import {TYPES} from '../../objects/types';
import {TreeDeserializer} from './TreeDeserializer';

@injectable()
export class TreeLoader implements ITreeLoader {
    private storeSource: ISubscribableTreeStoreSource
    private firebaseRef: Reference
    constructor(@inject(TYPES.TreeLoaderArgs){firebaseRef, storeSource}) {
        this.storeSource = storeSource
        this.firebaseRef = firebaseRef
    }

    public getData(treeId): ITreeDataWithoutId {
        if (!this.storeSource.get(treeId)) {
            throw new RangeError(treeId + ' does not exist in TreeLoader storeSource. Use isLoaded(treeId) to check.')
        }
        return this.storeSource.get(treeId).val()
        // TODO: fix violoation of law of demeter
    }

    // TODO: this method violates SRP.
    // it returns data AND has the side effect of storing the data in the storeSource
    public async downloadData(treeId): Promise<ITreeDataWithoutId> {
        const me = this
        return new Promise((resolve, reject) => {
            this.firebaseRef.child(treeId).on('value', (snapshot) => {
                const treeData: ITreeDataWithoutId = snapshot.val()
                log('FIREBASE REF VALUE CALLED!!!!1' + JSON.stringify(treeData))
                if (isValidTree(treeData)) {
                    const tree: IMutableSubscribableTree = TreeDeserializer.deserialize({treeId, treeData})
                    me.storeSource.set(treeId, tree)
                    resolve(treeData)
                } else {
                    reject(treeData)
                }
            })
        }) as Promise<ITreeDataWithoutId>
        // TODO ^^ Figure out how to do this without casting
    }

    public isLoaded(treeId): boolean {
        return !!this.storeSource.get(treeId)
    }

}

@injectable()
export class TreeLoaderArgs {
    @inject(TYPES.Reference) public firebaseRef: Reference
    @inject(TYPES.ISubscribableTreeStoreSource) public storeSource: ISubscribableTreeStoreSource
}
