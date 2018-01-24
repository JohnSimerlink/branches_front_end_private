import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    IMutableSubscribableTreeLocation, ISubscribableStoreSource, ISubscribableTreeLocationStoreSource, ITreeLocationData,
    ITreeLocationLoader
} from '../../objects/interfaces';
import {isValidTreeLocation} from '../../objects/treeLocation/treeLocationValidator';
import {TYPES} from '../../objects/types';
import {TreeLocationDeserializer} from './TreeLocationDeserializer';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
@injectable()
export class TreeLocationLoader implements ITreeLocationLoader {
    private storeSource: ISubscribableStoreSource<IMutableSubscribableTreeLocation>
    private firebaseRef
    constructor(@inject(TYPES.TreeLocationLoaderArgs){firebaseRef, storeSource}: TreeLocationLoaderArgs ) {
        this.storeSource = storeSource
        this.firebaseRef = firebaseRef
    }

    public getData(treeId): ITreeLocationData {
        if (!this.storeSource.get(treeId)) {
            throw new RangeError(treeId
                + ' does not exist in TreeLocationLoader storeSource. Use isLoaded(treeId) to check.')
        }
        return this.storeSource.get(treeId).val()
        // TODO: fix violoation of law of demeter
    }

    // TODO: this method violates SRP.
    // it returns data AND has the side effect of storing the data in the storeSource
    public async downloadData(treeId): Promise<ITreeLocationData> {
        const me = this
        return new Promise((resolve, reject) => {
            this.firebaseRef.child(treeId).once('value', (snapshot) => {
                const treeLocationData: ITreeLocationData = snapshot.val()
                if (isValidTreeLocation(treeLocationData)) {
                    const tree: IMutableSubscribableTreeLocation =
                        TreeLocationDeserializer.deserialize({treeLocationData})
                    me.storeSource.set(treeId, tree)
                    resolve(treeLocationData)
                } else {
                    reject(treeLocationData)
                }
            })
        }) as Promise<ITreeLocationData>
    }

    public isLoaded(treeId): boolean {
        return !!this.storeSource.get(treeId)
    }

}
@injectable()
export class TreeLocationLoaderArgs {
    @inject(TYPES.FirebaseReference) public firebaseRef: Reference

    @inject(TYPES.ISubscribableTreeLocationStoreSource) public storeSource: ISubscribableTreeLocationStoreSource
}
