import {
	inject,
	injectable,
	tagged
} from 'inversify';
import {
	IContentUserData,
	IContentUserLoader,
	IObjectFirebaseAutoSaver,
	ISyncableMutableSubscribableContentUser
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {
	getContentUserId,
	getContentUserRef
} from './ContentUserLoaderUtils';
import {error} from '../../core/log';
import {ObjectFirebaseAutoSaver} from '../../objects/dbSync/ObjectAutoFirebaseSaver';
import {TAGS} from '../../objects/tags';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;

// Use composition over inheritance. . . . a Penguin IS a bird . . . but penguins can't fly
@injectable()
export class ContentUserLoaderAndAutoSaver implements IContentUserLoader {
	private firebaseRef: Reference;
	private contentUserLoader: IContentUserLoader;

	constructor(@inject(TYPES.ContentUserLoaderAndAutoSaverArgs){
		firebaseRef, contentUserLoader,
	}: ContentUserLoaderAndAutoSaverArgs) {
		this.contentUserLoader = contentUserLoader;
		this.firebaseRef = firebaseRef;
	}

	public getData({contentId, userId}: { contentId: any; userId: any }): IContentUserData {
		return this.contentUserLoader.getData({
			contentId,
			userId
		});
		// return undefined;
	}

	public getItem({contentUserId}: { contentUserId: any }): ISyncableMutableSubscribableContentUser {
		return this.contentUserLoader.getItem({contentUserId});
		// return undefined;
	}

	public isLoaded({contentId, userId}: { contentId: any; userId: any }): boolean {
		return this.contentUserLoader.isLoaded({
			contentId,
			userId
		});
		// return undefined;
	}

	public async downloadData({contentId, userId}: { contentId: any; userId: any }): Promise<IContentUserData> {
		if (this.isLoaded({
			contentId,
			userId
		})) {
			// error('contentUserLoader:', contentId, userId, ' is already loaded! No need to download again');
			return;
		}
		const contentUserData: IContentUserData = await this.contentUserLoader.downloadData({
			contentId,
			userId
		});
		const contentUserId = getContentUserId({
			contentId,
			userId
		});
		const contentUser = this.getItem({contentUserId});
		const contentUserFirebaseRef = getContentUserRef({
			contentId,
			userId,
			contentUsersRef: this.firebaseRef
		});
		const contentUserAutoSaver: IObjectFirebaseAutoSaver =
			new ObjectFirebaseAutoSaver({
				syncableObjectFirebaseRef: contentUserFirebaseRef,
				syncableObject: contentUser
			});
		contentUserAutoSaver.start();

		return contentUserData;
	}
}

@injectable()
export class ContentUserLoaderAndAutoSaverArgs {
	@inject(TYPES.FirebaseReference) @tagged(TAGS.CONTENT_USERS_REF, true) public firebaseRef: Reference;
	@inject(TYPES.IContentUserLoader) public contentUserLoader: IContentUserLoader;
}
