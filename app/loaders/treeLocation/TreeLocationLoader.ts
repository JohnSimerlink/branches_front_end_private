import {inject, injectable, tagged} from 'inversify';
import {log} from '../../../app/core/log'
import {
    ISubscribableStoreSource, ISubscribableTreeLocationStoreSource,
    ISyncableMutableSubscribableTreeLocation, ITreeLocationData, ITreeLocationDataFromFirebase,
    ITreeLocationLoader
} from '../../objects/interfaces';
import {isValidTreeLocationDataFromFirebase} from '../../objects/treeLocation/treeLocationValidator';
import {TYPES} from '../../objects/types';
import {TreeLocationDeserializer} from './TreeLocationDeserializer';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {TAGS} from '../../objects/tags';
@injectable()
export class TreeLocationLoader implements ITreeLocationLoader {
    private storeSource: ISubscribableStoreSource<ISyncableMutableSubscribableTreeLocation>
    private firebaseRef: Reference
    constructor(@inject(TYPES.TreeLocationLoaderArgs){firebaseRef, storeSource}: TreeLocationLoaderArgs ) {
        this.storeSource = storeSource
        this.firebaseRef = firebaseRef
    }

    public getData(treeId): ITreeLocationData {
        const treeLocation: ISyncableMutableSubscribableTreeLocation
             = this.storeSource.get(treeId)
        if (!treeLocation) {
            throw new RangeError(treeId
                + ' does not exist in TreeLocationLoader storeSource. Use isLoaded(treeId) to check.')
        }
        return treeLocation.val()
        // TODO: fix violoation of law of demeter
    }

    public getItem(treeId): ISyncableMutableSubscribableTreeLocation {
        const treeLocation: ISyncableMutableSubscribableTreeLocation
            = this.storeSource.get(treeId)
        if (!treeLocation) {
            throw new RangeError(treeId
                + ' does not exist in TreeLocationLoader storeSource. Use isLoaded(treeId) to check.')
        }
        return treeLocation
    }

    // TODO: this method violates SRP.
    // it returns data AND has the side effect of storing the data in the storeSource
    public async downloadData(treeId): Promise<ITreeLocationData> {
        const me = this
        return new Promise((resolve, reject) => {
            this.firebaseRef.child(treeId).once('value', (snapshot) => {
                const treeLocationDataFromFirebase: ITreeLocationDataFromFirebase = snapshot.val()
                if (isValidTreeLocationDataFromFirebase(treeLocationDataFromFirebase)) {
                    const tree: ISyncableMutableSubscribableTreeLocation =
                        TreeLocationDeserializer.deserializeFromFirebase({treeLocationDataFromFirebase})
                    const treeLocationData =
                        TreeLocationDeserializer.convertFromFirebaseToData({treeLocationDataFromFirebase})
                    me.storeSource.set(treeId, tree)
                    resolve(treeLocationData)
                } else {
                    reject('treeLocationData for ' + treeId + ' invalid!' + treeLocationDataFromFirebase )
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
    @inject(TYPES.FirebaseReference) @tagged(TAGS.TREE_LOCATIONS_REF, true) public firebaseRef: Reference

    @inject(TYPES.ISubscribableTreeLocationStoreSource) public storeSource: ISubscribableTreeLocationStoreSource
}
