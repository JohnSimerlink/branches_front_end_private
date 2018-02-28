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

@injectable()
export class BranchesMapUtils implements IBranchesMapUtils {
    private usersFirebaseRef: Reference
    constructor(@inject(TYPES.BranchesMapUtilsArgs) {
        firebaseRef,
    }: BranchesMapUtilsArgs ) {
        this.usersFirebaseRef = firebaseRef
    }
    public async userExistsInDB(userId: string): Promise<boolean> {
        const userRef = this.usersFirebaseRef.child(userId)
        return new Promise((resolve, reject) => {
            userRef.once('value', snapshot => {
                const userVal = snapshot.val()
                if (userVal) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        }) as Promise<boolean>
    }
    public async createBranchesMapInDB(mapId: id): Promise<ISyncableMutableSubscribableBranchesMap> {
        // const userExists = await this.userExistsInDB(userId)
        // if (userExists) {
        //     console.error('not creating user. user already existsb')
        //     return
        // }
        // const userData: IBranchesMapData = {
        //     everActivatedMembership: false,
        //     membershipExpirationDate: 1496340000  // Jun 1st 2017. <<< Already expired
        // }
        // const user: ISyncableMutableSubscribableBranchesMap = BranchesMapDeserializer.deserialize({userData})
        // const userFirebaseRef = this.usersFirebaseRef.child(userId)
        // const objectFirebaseAutoSaver: IObjectFirebaseAutoSaver = new ObjectFirebaseAutoSaver({
        //     syncableObject: user,
        //     syncableObjectFirebaseRef: userFirebaseRef
        // })
        // objectFirebaseAutoSaver.initialSave()
        // objectFirebaseAutoSaver.start()
        // return user
    }
}

@injectable()
export class BranchesMapUtilsArgs {
    @inject(TYPES.FirebaseReference)
    @tagged(TAGS.USERS_REF, true) public firebaseRef: Reference
}
