import {
	inject,
	injectable,
	tagged
} from 'inversify';
import {error} from '../../../app/core/log';
import {
	ISubscribableStoreSource,
	ISubscribableTreeLocationStoreSource,
	ISyncableMutableSubscribableTreeLocation,
	ITreeLocationData,
	ITreeLocationDataFromFirebase,
	ITreeLocationLoader
} from '../../objects/interfaces';
import {isValidTreeLocationDataFromDB} from '../../objects/treeLocation/treeLocationValidator';
import {TYPES} from '../../objects/types';
import {TreeLocationDeserializer} from './TreeLocationDeserializer';
import {TAGS} from '../../objects/tags';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;

@injectable()
export class TreeLocationLoader implements ITreeLocationLoader {
	private storeSource: ISubscribableStoreSource<ISyncableMutableSubscribableTreeLocation>;
	private firebaseRef: Reference;

	constructor(@inject(TYPES.TreeLocationLoaderArgs){firebaseRef, storeSource}: TreeLocationLoaderArgs) {
		this.storeSource = storeSource;
		this.firebaseRef = firebaseRef;
	}

	public getData(treeId): ITreeLocationData {
		const treeLocation: ISyncableMutableSubscribableTreeLocation
			= this.storeSource.get(treeId);
		if (!treeLocation) {
			throw new RangeError(treeId
				+ ' does not exist in TreeLocationLoader storeSource. Use isLoaded(treeId) to check.');
		}
		return treeLocation.val();
		// TODO: fix violoation of law of demeter
	}

	public getItem(treeId): ISyncableMutableSubscribableTreeLocation {
		const treeLocation: ISyncableMutableSubscribableTreeLocation
			= this.storeSource.get(treeId);
		if (!treeLocation) {
			throw new RangeError(treeId
				+ ' does not exist in TreeLocationLoader storeSource. Use isLoaded(treeId) to check.');
		}
		return treeLocation;
	}

	// TODO: this method violates SRP.
	// it returns data AND has the side effect of storing the data in the storeSource
	public async downloadData(treeId): Promise<ITreeLocationData> {
		const me = this;
		return new Promise((resolve, reject) => {
			this.firebaseRef.child(treeId).once('value', (snapshot) => {
				const treeLocationDataFromFirebase: ITreeLocationDataFromFirebase = snapshot.val();
				if (isValidTreeLocationDataFromDB(treeLocationDataFromFirebase)) {
					const tree: ISyncableMutableSubscribableTreeLocation =
						TreeLocationDeserializer.deserializeFromDB(
							{treeLocationDataFromDB: treeLocationDataFromFirebase}
						);
					const treeLocationData =
						TreeLocationDeserializer.convertFromDBToData(
							{treeLocationDataFromDB: treeLocationDataFromFirebase}
						);
					me.storeSource.set(treeId, tree);
					resolve(treeLocationData);
				} else {
					error('treeLocationData for ', treeId,
						' invalid!', treeLocationDataFromFirebase);
					reject('treeLocationData for ' + treeId +
						' invalid!' + JSON.stringify(treeLocationDataFromFirebase));
				}
			});
		}) as Promise<ITreeLocationData>;
	}

	public isLoaded(treeId): boolean {
		return !!this.storeSource.get(treeId);
	}

}

@injectable()
export class TreeLocationLoaderArgs {
	@inject(TYPES.FirebaseReference) @tagged(TAGS.TREE_LOCATIONS_REF, true) public firebaseRef: Reference;

	@inject(TYPES.ISubscribableTreeLocationStoreSource) public storeSource: ISubscribableTreeLocationStoreSource;
}
