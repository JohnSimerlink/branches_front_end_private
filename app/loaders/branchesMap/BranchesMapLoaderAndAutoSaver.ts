import {inject, injectable, tagged} from 'inversify';
import {
    IBranchesMapData, id, IMutableSubscribableBranchesMap, IObjectFirebaseAutoSaver,
    ISyncableMutableSubscribableBranchesMap, IBranchesMapLoader
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {log} from '../../core/log'
import {ObjectFirebaseAutoSaver} from '../../objects/dbSync/ObjectAutoFirebaseSaver';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {TAGS} from '../../objects/tags';

// Use composition over inheritance. . . . a Penguin IS a bird . . . but penguins can't fly
@injectable()
export class BranchesMapLoaderAndAutoSaver implements IBranchesMapLoader {
    private firebaseRef: Reference;
    private branchesMapLoader: IBranchesMapLoader;
    constructor(@inject(TYPES.BranchesMapLoaderAndAutoSaverArgs){
        firebaseRef, branchesMapLoader, }: BranchesMapLoaderAndAutoSaverArgs) {
        this.branchesMapLoader = branchesMapLoader;
        this.firebaseRef = firebaseRef
    }
    public async loadIfNotLoaded(branchesMapId: id): Promise<ISyncableMutableSubscribableBranchesMap> {
        const branchesMap = await this.branchesMapLoader.loadIfNotLoaded(branchesMapId);

        const branchesMapFirebaseRef = this.firebaseRef.child(branchesMapId);
        const branchesMapAutoSaver: IObjectFirebaseAutoSaver =
            new ObjectFirebaseAutoSaver({
                syncableObjectFirebaseRef: branchesMapFirebaseRef,
                syncableObject: branchesMap
            });
        branchesMapAutoSaver.start();

        return branchesMap
    }
}

@injectable()
export class BranchesMapLoaderAndAutoSaverArgs {
    @inject(TYPES.FirebaseReference) @tagged(TAGS.BRANCHES_MAPS_REF, true) public firebaseRef: Reference;
    @inject(TYPES.IBranchesMapLoader) public branchesMapLoader: IBranchesMapLoader
}
