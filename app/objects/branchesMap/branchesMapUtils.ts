// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable, tagged} from 'inversify';
import {
    ISyncableMutableSubscribableBranchesMap,
    IBranchesMapData,
    IBranchesMapUtils,
    IObjectFirebaseAutoSaver, id, ICreateMapMutationArgs, ICreateBranchesMapReturnObject,
} from '../interfaces';
import {TYPES} from '../types';
import {TAGS} from '../tags';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {ObjectFirebaseAutoSaver} from '../dbSync/ObjectAutoFirebaseSaver';
import {BranchesMapDeserializer} from '../../loaders/branchesMap/BranchesMapDeserializer';
import {NON_EXISTENT_ID} from '../../core/globals';

@injectable()
export class BranchesMapUtils implements IBranchesMapUtils {
    private branchesMapsFirebaseRef: Reference;
    constructor(@inject(TYPES.BranchesMapUtilsArgs) {
        firebaseRef,
    }: BranchesMapUtilsArgs ) {
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
