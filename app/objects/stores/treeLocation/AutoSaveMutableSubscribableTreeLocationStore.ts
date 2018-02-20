import {log} from '../../../core/log'
import {
    IMutableSubscribableTreeLocationStore,
    IObjectFirebaseAutoSaver, ISyncableMutableSubscribableTreeLocation, ITreeLocationData,
} from '../../interfaces';
import {inject, injectable, tagged} from 'inversify';
import {TYPES} from '../../types';
import {ObjectFirebaseAutoSaver} from '../../dbSync/ObjectAutoFirebaseSaver';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {MutableSubscribableTreeLocationStore} from './MutableSubscribableTreeLocationStore';
import {TAGS} from '../../tags';

@injectable()
export class AutoSaveMutableSubscribableTreeLocationStore extends MutableSubscribableTreeLocationStore
    implements IMutableSubscribableTreeLocationStore {
    // TODO: I sorta don't like how store is responsible for connecting the item to an auto saver
    private treeLocationsFirebaseRef: Reference
    constructor(@inject(TYPES.AutoSaveMutableSubscribableTreeLocationStoreArgs){
        storeSource, updatesCallbacks, treeLocationsFirebaseRef,
    }: AutoSaveMutableSubscribableTreeLocationStoreArgs) {
        super({storeSource, updatesCallbacks})
        // log('328pm AutoSaverMutableSubscribableTreeLocationStore created')
        this.treeLocationsFirebaseRef = treeLocationsFirebaseRef
    }
    public addAndSubscribeToItemFromData(
        {id, treeLocationData}:
        { id: string; treeLocationData: ITreeLocationData; })
    : ISyncableMutableSubscribableTreeLocation {
        log('J14F1 AutoSaveMutableSubscribableTreeUserStore addAndSubscribeToItemFromData', id, treeLocationData)
        const treeLocationId = id
        const treeLocation: ISyncableMutableSubscribableTreeLocation =
            super.addAndSubscribeToItemFromData({id, treeLocationData})
        log('J14F1 treeLocation just created is', treeLocation)
        const treeLocationFirebaseRef = this.treeLocationsFirebaseRef.child(treeLocationId)
        log('J14F1 treeLocationFirebaseRef for this treeLocation is ', treeLocationFirebaseRef.path)
        // const treeLocationFirebaseRef = treeLocationFirebaseRef.child(userId)
        const objectFirebaseAutoSaver: IObjectFirebaseAutoSaver = new ObjectFirebaseAutoSaver({
            syncableObject: treeLocation,
            syncableObjectFirebaseRef: treeLocationFirebaseRef
        })
        log('J14F1 treeLocation initialSave aabout to be called ', treeLocation)
        objectFirebaseAutoSaver.initialSave()
        objectFirebaseAutoSaver.start()
        // TODO: this needs to add the actual value into the db
        return treeLocation
    }
}
@injectable()
export class AutoSaveMutableSubscribableTreeLocationStoreArgs {
    @inject(TYPES.ISubscribableTreeLocationStoreSource) public storeSource;
    @inject(TYPES.Array) public updatesCallbacks;
    @inject(TYPES.FirebaseReference)
    @tagged(TAGS.TREE_LOCATIONS_REF, true)
        public treeLocationsFirebaseRef: Reference;
}
