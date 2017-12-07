import {IFirebaseRef, ITreeDataWithoutId, ITreeLoader} from '../objects/interfaces';

class TreeLoader implements ITreeLoader {
    private store: object
    private firebaseRef: IFirebaseRef
    constructor({firebaseRef, store}) {
        this.store = store
        this.firebaseRef = firebaseRef
    }
    public getData(treeId): ITreeDataWithoutId {
        return undefined;
    }

    public downloadData(treeId): ITreeDataWithoutId {
        return undefined;
    }

    public isLoaded(treeId): boolean {
        return !!this.store[treeId]
    }

}

export {TreeLoader}
