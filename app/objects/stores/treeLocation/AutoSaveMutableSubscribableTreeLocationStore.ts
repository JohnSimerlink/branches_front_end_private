import {log} from '../../../core/log'
import {
    IMutableSubscribableTreeLocationStore,
    IObjectFirebaseAutoSaver, ISyncableMutableSubscribableTreeLocation, ITreeLocationData,
} from '../../interfaces';
import {inject} from 'inversify';
import {TYPES} from '../../types';
import {ObjectFirebaseAutoSaver} from '../../dbSync/ObjectAutoFirebaseSaver';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {MutableSubscribableTreeLocationStore} from './MutableSubscribableTreeLocationStore';

export class AutoSaveMutableSubscribableTreeLocationStore extends MutableSubscribableTreeLocationStore
    implements IMutableSubscribableTreeLocationStore {
    // TODO: I sorta don't like how store is responsible for connecting the item to an auto saver
    private treeLocationsFirebaseRef: Reference
    constructor(@inject(TYPES.AutoSaveMutableSubscribableTreeLocationStoreArgs){
        storeSource, updatesCallbacks, treeLocationsFirebaseRef,
    }: AutoSaveMutableSubscribableTreeLocationStoreArgs) {
        super({storeSource, updatesCallbacks})
        this.treeLocationsFirebaseRef = treeLocationsFirebaseRef
    }
    public addAndSubscribeToItemFromData(
        {id, treeLocationData}:
        { id: string; treeLocationData: ITreeLocationData; })
    : ISyncableMutableSubscribableTreeLocation {
        log('AutoSaveMutableSubscribableTreeUserStore addAndSubscribeToItemFromData', id, treeLocationData)
        const treeLocationId = id
        const treeLocation: ISyncableMutableSubscribableTreeLocation =
            super.addAndSubscribeToItemFromData({id, treeLocationData})
        log('treeLocation just created is', treeLocation)
        const treeLocationFirebaseRef = this.treeLocationsFirebaseRef.child(treeLocationId)
        // const treeLocationFirebaseRef = treeLocationFirebaseRef.child(userId)
        const objectFirebaseAutoSaver: IObjectFirebaseAutoSaver = new ObjectFirebaseAutoSaver({
            syncableObject: treeLocation,
            syncableObjectFirebaseRef: treeLocationFirebaseRef
        })
        objectFirebaseAutoSaver.initialSave()
        objectFirebaseAutoSaver.start()
        // TODO: this needs to add the actual value into the db
        return treeLocation
    }
}
export class AutoSaveMutableSubscribableTreeLocationStoreArgs {
    @inject(TYPES.ISubscribableTreeLocationStoreSource) public storeSource;
    @inject(TYPES.Array) public updatesCallbacks;
    @inject(TYPES.IFirebaseRef) public treeLocationsFirebaseRef: Reference;
}
