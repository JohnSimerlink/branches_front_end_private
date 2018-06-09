import * as firebase from 'firebase';
import {inject, injectable, tagged} from 'inversify';
import {log} from '../../../app/core/log';
import {
	IBranchesMapDataFromDB,
	IBranchesMapLoaderCore,
	id,
	ISyncableMutableSubscribableBranchesMap
} from '../../objects/interfaces';
import {isValidBranchesMapDataFromDB} from '../../objects/branchesMap/branchesMapValidator';
import {TYPES} from '../../objects/types';
import {BranchesMapDeserializer} from './BranchesMapDeserializer';
import {TAGS} from '../../objects/tags';
import Reference = firebase.database.Reference;

@injectable()
export class BranchesMapLoaderCore implements IBranchesMapLoaderCore {
	private firebaseRef: Reference;

	constructor(@inject(TYPES.BranchesMapLoaderCoreArgs){firebaseRef}: BranchesMapLoaderCoreArgs) {
		this.firebaseRef = firebaseRef;
	}

	// TODO: this method violates SRP.
	// it returns data AND has the side effect of storing the data in the storeSource
	public async load(branchesMapId: id): Promise<ISyncableMutableSubscribableBranchesMap> {
		return new Promise((resolve, reject) => {
			this.firebaseRef.child(branchesMapId).once('value', (snapshot) => {
				const branchesMapDataFromDB: IBranchesMapDataFromDB = snapshot.val();
				if (isValidBranchesMapDataFromDB(branchesMapDataFromDB)) {
					const branchesMap: ISyncableMutableSubscribableBranchesMap =
						BranchesMapDeserializer.deserializeFromDB({branchesMapDataFromDB});
					resolve(branchesMap);
				} else {
					reject('branchesMapDataFromDB is invalid! ! ' + JSON.stringify(branchesMapDataFromDB));
				}
			});
		}) as Promise<ISyncableMutableSubscribableBranchesMap>;
	}
}

@injectable()
export class BranchesMapLoaderCoreArgs {
	@inject(TYPES.FirebaseReference)
	@tagged(TAGS.BRANCHES_MAPS_REF, true) public firebaseRef: Reference;
}
