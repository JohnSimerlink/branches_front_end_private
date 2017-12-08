import {log} from '../../app/core/log'
import {IFirebaseRef, ITreeDataWithoutId, ITreeLoader} from '../objects/interfaces';
import {isValidTree} from '../objects/tree/treeValidator';

class TreeLoader implements ITreeLoader {
    private store: object
    private firebaseRef: Firebase
    constructor({firebaseRef, store}) {
        this.store = store
        this.firebaseRef = firebaseRef
    }

    public getData(treeId): ITreeDataWithoutId {
        return undefined;
    }

    public async downloadData(treeId): Promise<ITreeDataWithoutId> {
        const me = this
        return new Promise((resolve, reject) => {
            this.firebaseRef.on('value', (snapshot) => {
                const treeData: ITreeDataWithoutId = snapshot.val()
                log('FIREBASE REF VALUE CALLED!!!!1' + JSON.stringify(treeData))
                if (isValidTree(treeData)) {
                    me.store[treeId] = treeData
                    resolve(treeData)
                } else {
                    reject(treeData)
                }
            })
        }) as Promise<ITreeDataWithoutId>
        // TODO ^^ Figure out how to do this without casting
    }

    public isLoaded(treeId): boolean {
        return !!this.store[treeId]
    }

}

export {TreeLoader}
