import {inject, injectable, tagged} from 'inversify';
import {
	id,
	IObjectFirebaseAutoSaver,
	ISyncableMutableSubscribableTreeLocation,
	ITreeLocationData,
	ITreeLocationLoader
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {log} from '../../core/log';
import {ObjectFirebaseAutoSaver} from '../../objects/dbSync/ObjectAutoFirebaseSaver';
import * as firebase from 'firebase';
import {TAGS} from '../../objects/tags';
import Reference = firebase.database.Reference;

// Use composition over inheritance. . . . a Penguin IS a bird . . . but penguins can't fly
@injectable()
export class TreeLocationLoaderAndAutoSaver implements ITreeLocationLoader {
	private treeLocationsFirebaseRef: Reference;
	private treeLocationLoader: ITreeLocationLoader;

	constructor(@inject(TYPES.TreeLocationLoaderAndAutoSaverArgs){
		treeLocationsFirebaseRef, treeLocationLoader,
	}: TreeLocationLoaderAndAutoSaverArgs) {
		this.treeLocationLoader = treeLocationLoader;
		this.treeLocationsFirebaseRef = treeLocationsFirebaseRef;
	}

	public getData(treeLocationId: id): ITreeLocationData {
		return this.treeLocationLoader.getData(treeLocationId);
	}

	public getItem(treeLocationId: id): ISyncableMutableSubscribableTreeLocation {
		return this.treeLocationLoader.getItem(treeLocationId);
	}

	public isLoaded(treeLocationId: id): boolean {
		return this.treeLocationLoader.isLoaded(treeLocationId);
	}

	public async downloadData(treeLocationId: id): Promise<ITreeLocationData> {
		if (this.isLoaded(treeLocationId)) {
			log('treeLocationLoader:', treeLocationId, ' is already loaded! No need to download again');
			return;
		}
		const treeLocationData: ITreeLocationData = await this.treeLocationLoader.downloadData(treeLocationId);
		const treeLocation = this.getItem(treeLocationId);
		const treeLocationFirebaseRef = this.treeLocationsFirebaseRef.child(treeLocationId);
		const treeLocationAutoSaver: IObjectFirebaseAutoSaver =
			new ObjectFirebaseAutoSaver({
				syncableObjectFirebaseRef: treeLocationFirebaseRef,
				syncableObject: treeLocation
			});
		treeLocationAutoSaver.start();

		return treeLocationData;
	}
}

@injectable()
export class TreeLocationLoaderAndAutoSaverArgs {
	@inject(TYPES.FirebaseReference) @tagged(TAGS.TREE_LOCATIONS_REF, true) public treeLocationsFirebaseRef: Reference;
	@inject(TYPES.ITreeLocationLoader) public treeLocationLoader: ITreeLocationLoader;
}
