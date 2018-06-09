// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable, tagged} from 'inversify';
import {
	IBranchesMapData,
	IBranchesMapUtils,
	ICreateBranchesMapReturnObject,
	ICreateMapMutationArgs,
	IObjectFirebaseAutoSaver,
	ISyncableMutableSubscribableBranchesMap,
} from '../interfaces';
import {TYPES} from '../types';
import {TAGS} from '../tags';
import * as firebase from 'firebase';
import {ObjectFirebaseAutoSaver} from '../dbSync/ObjectAutoFirebaseSaver';
import {BranchesMapDeserializer} from '../../loaders/branchesMap/BranchesMapDeserializer';
import Reference = firebase.database.Reference;

@injectable()
export class BranchesMapUtils implements IBranchesMapUtils {
	private branchesMapsFirebaseRef: Reference;

	constructor(@inject(TYPES.BranchesMapUtilsArgs) {
		firebaseRef,
	}: BranchesMapUtilsArgs) {
		this.branchesMapsFirebaseRef = firebaseRef;
	}

	public createBranchesMapInDBAndAutoSave(
		{rootTreeId}: ICreateMapMutationArgs): ICreateBranchesMapReturnObject {
		const branchesMapData: IBranchesMapData = {
			rootTreeId
		};
		const branchesMap: ISyncableMutableSubscribableBranchesMap
			= BranchesMapDeserializer.deserialize({branchesMapData});
		const branchesMapFirebaseRef: Reference = this.branchesMapsFirebaseRef.push(branchesMapData);
		const branchesMapId = branchesMapFirebaseRef.key;
		const objectFirebaseAutoSaver: IObjectFirebaseAutoSaver = new ObjectFirebaseAutoSaver({
			syncableObject: branchesMap,
			syncableObjectFirebaseRef: branchesMapFirebaseRef
		});
		objectFirebaseAutoSaver.initialSave();
		objectFirebaseAutoSaver.start();
		const returnObject = {
			branchesMap,
			id: branchesMapId
		};
		return returnObject;
	}
}

@injectable()
export class BranchesMapUtilsArgs {
	@inject(TYPES.FirebaseReference)
	@tagged(TAGS.BRANCHES_MAPS_REF, true)
	public firebaseRef: Reference;
}
