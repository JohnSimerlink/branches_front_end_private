import {
	IMutableSubscribableTreeLocationStore,
	IObjectFirebaseAutoSaver,
	ISyncableMutableSubscribableTreeLocation,
	ITreeLocationData,
} from '../../interfaces';
import {
	inject,
	injectable,
	tagged
} from 'inversify';
import {TYPES} from '../../types';
import {ObjectFirebaseAutoSaver} from '../../dbSync/ObjectAutoFirebaseSaver';
import {MutableSubscribableTreeLocationStore} from './MutableSubscribableTreeLocationStore';
import {TAGS} from '../../tags';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;

@injectable()
export class AutoSaveMutableSubscribableTreeLocationStore extends MutableSubscribableTreeLocationStore
	implements IMutableSubscribableTreeLocationStore {
	// TODO: I sorta don't like how store is responsible for connecting the item to an auto saver
	private treeLocationsFirebaseRef: Reference;

	constructor(@inject(TYPES.AutoSaveMutableSubscribableTreeLocationStoreArgs){
		storeSource, updatesCallbacks, treeLocationsFirebaseRef,
	}: AutoSaveMutableSubscribableTreeLocationStoreArgs) {
		super({
			storeSource,
			updatesCallbacks
		});
		// log('328pm AutoSaverMutableSubscribableTreeLocationStore created')
		this.treeLocationsFirebaseRef = treeLocationsFirebaseRef;
	}

	public addAndSubscribeToItemFromData(
		{id, treeLocationData}:
			{ id: string; treeLocationData: ITreeLocationData; })
		: ISyncableMutableSubscribableTreeLocation {
		const treeLocationId = id;
		const treeLocation: ISyncableMutableSubscribableTreeLocation =
			super.addAndSubscribeToItemFromData({
				id,
				treeLocationData
			});
		const treeLocationFirebaseRef = this.treeLocationsFirebaseRef.child(treeLocationId);
		// const treeLocationFirebaseRef = treeLocationFirebaseRef.child(userId)
		const objectFirebaseAutoSaver: IObjectFirebaseAutoSaver = new ObjectFirebaseAutoSaver({
			syncableObject: treeLocation,
			syncableObjectFirebaseRef: treeLocationFirebaseRef
		});
		objectFirebaseAutoSaver.initialSave();
		objectFirebaseAutoSaver.start();
		// TODO: this needs to add the actual value into the db
		return treeLocation;
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
