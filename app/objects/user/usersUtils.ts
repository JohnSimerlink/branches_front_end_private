// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable, tagged} from 'inversify';
import {
    ISyncableMutableSubscribableUser,
    IUserData,
    IUserUtils,
    IObjectFirebaseAutoSaver,
} from '../interfaces';
import {TYPES} from '../types'
import {TAGS} from '../tags';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {ObjectFirebaseAutoSaver} from '../dbSync/ObjectAutoFirebaseSaver';
import {UserDeserializer} from '../../loaders/user/UserDeserializer';

@injectable()
export class UserUtils implements IUserUtils {
    private usersFirebaseRef: Reference
    constructor(@inject(TYPES.UserUtilsArgs) {
        firebaseRef,
    }: UserUtilsArgs ) {
        this.usersFirebaseRef = firebaseRef
    }
    public async userExistsInDB(userId: string): Promise<boolean> {
        const userRef = this.usersFirebaseRef.child(userId)
        return new Promise((resolve, reject) => {
            userRef.on('value', snapshot => {
                const userVal = snapshot.val()
                if (userVal) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        }) as Promise<boolean>
    }
    public async createUserInDB(userId: string) {
        const userExists = await this.userExistsInDB(userId)
        if (!userExists) {
            const userData: IUserData = {
                everActivatedMembership: false,
                membershipExpirationDate: null
            }
            const user: ISyncableMutableSubscribableUser = UserDeserializer.deserialize({userData})
            const userFirebaseRef = this.usersFirebaseRef.child(userId)
            const objectFirebaseAutoSaver: IObjectFirebaseAutoSaver = new ObjectFirebaseAutoSaver({
                syncableObject: user,
                syncableObjectFirebaseRef: userFirebaseRef
            })
            objectFirebaseAutoSaver.initialSave()
            objectFirebaseAutoSaver.start()

        }
    }
}

@injectable()
export class UserUtilsArgs {
    @inject(TYPES.FirebaseReference)
    @tagged(TAGS.USERS_REF, true) public firebaseRef: Reference
}
