// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable, tagged} from 'inversify';
import {
    ISyncableMutableSubscribableBranchesMap,
    IBranchesMapData,
    IBranchesMapUtils,
    IObjectFirebaseAutoSaver, id,
} from '../interfaces';
import {TYPES} from '../types'
import {TAGS} from '../tags';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {ObjectFirebaseAutoSaver} from '../dbSync/ObjectAutoFirebaseSaver';
import {BranchesMapDeserializer} from '../../loaders/branchesMap/BranchesMapDeserializer';
import {NON_EXISTENT_ID} from '../../core/globals';

@injectable()
export class BranchesMapUtils implements IBranchesMapUtils {
    private branchesMapsFirebaseRef: Reference
    constructor(@inject(TYPES.BranchesMapUtilsArgs) {
        firebaseRef,
    }: BranchesMapUtilsArgs ) {
        this.branchesMapsFirebaseRef = firebaseRef
    }
    public async createInDBAndAutoSaveBranchesMap(mapId: id): Promise<ISyncableMutableSubscribableBranchesMap> {
        const branchesMapData: IBranchesMapData = {
            rootTreeId: NON_EXISTENT_ID  // Jun 1st 2017. <<< Already expired
        }
        const branchesMap: ISyncableMutableSubscribableBranchesMap
            = BranchesMapDeserializer.deserialize({branchesMapData})
        const userFirebaseRef = this.branchesMapsFirebaseRef.child(mapId)
        const objectFirebaseAutoSaver: IObjectFirebaseAutoSaver = new ObjectFirebaseAutoSaver({
            syncableObject: branchesMap,
            syncableObjectFirebaseRef: userFirebaseRef
        })
        objectFirebaseAutoSaver.initialSave()
        objectFirebaseAutoSaver.start()
        return branchesMap
    }
}

@injectable()
export class BranchesMapUtilsArgs {
    @inject(TYPES.FirebaseReference)
    @tagged(TAGS.BRANCHES_MAPS_REF, true)
        public firebaseRef: Reference
}
