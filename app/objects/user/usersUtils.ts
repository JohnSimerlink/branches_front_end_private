// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable, tagged} from 'inversify';
import {
    ISyncableMutableSubscribableUser,
    IUserData,
    IUserUtils,
    IObjectFirebaseAutoSaver, ICreateUserInDBArgs,
} from '../interfaces';
import {TYPES} from '../types';
import {TAGS} from '../tags';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {ObjectFirebaseAutoSaver} from '../dbSync/ObjectAutoFirebaseSaver';
import {UserDeserializer} from '../../loaders/user/UserDeserializer';
import {DEFAULT_USER_INFO} from '../../core/globals';
export const DEFAULT_MEMBERSHIP_EXPIRATION_DATE = 1496340000; // Jun 1st 2017. <<< Already expired

@injectable()
export class UserUtils implements IUserUtils {
    private usersFirebaseRef: Reference;
    constructor(@inject(TYPES.UserUtilsArgs) {
        firebaseRef,
    }: UserUtilsArgs ) {
        this.usersFirebaseRef = firebaseRef;
    }
    public async userExistsInDB(userId: string): Promise<boolean> {
        const userRef = this.usersFirebaseRef.child(userId);
        return new Promise((resolve, reject) => {
            userRef.once('value', snapshot => {
                const userVal = snapshot.val();
                if (userVal) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        }) as Promise<boolean>;
    }
    public async createUserInDB({userId, userInfo}: ICreateUserInDBArgs): Promise<ISyncableMutableSubscribableUser> {
        const userExists = await this.userExistsInDB(userId);
        if (userExists) {
            console.error('not creating user. user already existsb');
            return;
        }
        const userData: IUserData = {
            everActivatedMembership: false,
            membershipExpirationDate: DEFAULT_MEMBERSHIP_EXPIRATION_DATE,
            points: 0,
            rootMapId: null,
            userInfo: DEFAULT_USER_INFO,
            openMapId: null,
            currentHoveredTreeId: null,
        };
        const user: ISyncableMutableSubscribableUser = UserDeserializer.deserialize({userData});
        const userFirebaseRef = this.usersFirebaseRef.child(userId);
        const objectFirebaseAutoSaver: IObjectFirebaseAutoSaver = new ObjectFirebaseAutoSaver({
            syncableObject: user,
            syncableObjectFirebaseRef: userFirebaseRef
        });
        objectFirebaseAutoSaver.initialSave();
        objectFirebaseAutoSaver.start();
        return user;
    }
}

@injectable()
export class UserUtilsArgs {
    @inject(TYPES.FirebaseReference)
    @tagged(TAGS.USERS_REF, true) public firebaseRef: Reference;
}
