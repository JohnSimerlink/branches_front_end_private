import {inject, injectable, tagged} from 'inversify';
import {id, IObjectFirebaseAutoSaver, ISyncableMutableSubscribableUser, IUserLoader} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {log} from '../../core/log';
import {ObjectFirebaseAutoSaver} from '../../objects/dbSync/ObjectAutoFirebaseSaver';
import * as firebase from 'firebase';
import {TAGS} from '../../objects/tags';
import Reference = firebase.database.Reference;

// Use composition over inheritance. . . . a Penguin IS a bird . . . but penguins can't fly
@injectable()
export class UserLoaderAndAutoSaver implements IUserLoader {
	private firebaseRef: Reference;
	private userLoader: IUserLoader;

	constructor(@inject(TYPES.UserLoaderAndAutoSaverArgs){
		firebaseRef, userLoader,
	}: UserLoaderAndAutoSaverArgs) {
		this.userLoader = userLoader;
		this.firebaseRef = firebaseRef;
	}

	public async downloadUser(userId: id): Promise<ISyncableMutableSubscribableUser> {
		const user = await this.userLoader.downloadUser(userId);

		const userFirebaseRef = this.firebaseRef.child(userId);
		const userAutoSaver: IObjectFirebaseAutoSaver =
			new ObjectFirebaseAutoSaver({
				syncableObjectFirebaseRef: userFirebaseRef,
				syncableObject: user
			});
		userAutoSaver.start();

		return user;
	}
}

@injectable()
export class UserLoaderAndAutoSaverArgs {
	@inject(TYPES.FirebaseReference) @tagged(TAGS.USERS_REF, true) public firebaseRef: Reference;
	@inject(TYPES.IUserLoader) public userLoader: IUserLoader;
}
