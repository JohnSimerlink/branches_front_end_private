import {log} from '../../app/core/log'
import {
    IMutableSubscribableTree, ISubscribableStoreSource, ITreeDataWithoutId,
    ITreeLoader
} from '../../objects/interfaces';
import {isValidTree} from '../../objects/tree/treeValidator';
import {TreeDeserializer} from './TreeDeserializer';

class TreeLoader implements ITreeLoader {
    private store: ISubscribableStoreSource<IMutableSubscribableTree>
    private firebaseRef: Firebase
    constructor({firebaseRef, store}) {
        this.store = store
        this.firebaseRef = firebaseRef
    }

    public getData(treeId): ITreeDataWithoutId {
        if (!this.store.get(treeId)) {
            throw new RangeError(treeId + ' does not exist in TreeLoader store. Use isLoaded(treeId) to check.')
        }
        return this.store.get(treeId).val()
        // TODO: fix violoation of law of demeter
    }

    // TODO: this method violates SRP.
    // it returns data AND has the side effect of storing the data in the store
    public async downloadData(treeId): Promise<ITreeDataWithoutId> {
        const me = this
        return new Promise((resolve, reject) => {
            this.firebaseRef.on('value', (snapshot) => {
                const treeData: ITreeDataWithoutId = snapshot.val()
                log('FIREBASE REF VALUE CALLED!!!!1' + JSON.stringify(treeData))
                if (isValidTree(treeData)) {
                    const tree: IMutableSubscribableTree = TreeDeserializer.deserialize({treeId, treeData})
                    me.store.set(treeId, tree)
                    resolve(treeData)
                } else {
                    reject(treeData)
                }
            })
        }) as Promise<ITreeDataWithoutId>
        // TODO ^^ Figure out how to do this without casting
    }

    public isLoaded(treeId): boolean {
        return !!this.store.get(treeId)
    }

}

export {TreeLoader}
