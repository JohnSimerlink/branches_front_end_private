import * as firebase from 'firebase';
import {inject, injectable, tagged} from 'inversify';
import {log} from '../../../app/core/log';
import {id, ISyncableMutableSubscribableUser, IUserDataFromDB, IUserLoader} from '../../objects/interfaces';
import {isValidUserDataFromDB} from '../../objects/user/userValidator';
import {TYPES} from '../../objects/types';
import {UserDeserializer} from './UserDeserializer';
import {TAGS} from '../../objects/tags';
import Reference = firebase.database.Reference;

@injectable()
export class UserLoader implements IUserLoader {
    private firebaseRef: Reference;
    constructor(@inject(TYPES.UserLoaderArgs){firebaseRef}: UserLoaderArgs) {
        this.firebaseRef = firebaseRef;
    }

    // TODO: this method violates SRP.
    // it returns data AND has the side effect of storing the data in the storeSource
    public async downloadUser(userId: id): Promise<ISyncableMutableSubscribableUser> {
        return new Promise((resolve, reject) => {
            this.firebaseRef.child(userId).once('value', (snapshot) => {
                const userDataFromDB: IUserDataFromDB = snapshot.val();

                if (isValidUserDataFromDB(userDataFromDB)) {
                    const user: ISyncableMutableSubscribableUser =
                        UserDeserializer.deserializeFromDB({userDataFromDB});
                    resolve(user);
                } else {
                    reject('userDataFromDB is invalid! ! ' + JSON.stringify(userDataFromDB));
                }
            });
        }) as Promise<ISyncableMutableSubscribableUser>;
    }
}

@injectable()
export class UserLoaderArgs {
    @inject(TYPES.FirebaseReference)
    @tagged(TAGS.USERS_REF, true) public firebaseRef: Reference;
}
