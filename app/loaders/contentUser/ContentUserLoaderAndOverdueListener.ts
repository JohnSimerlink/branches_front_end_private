import {inject, injectable, tagged} from 'inversify';
import {
	IContentData,
	IContentLoader,
	IContentUserData,
	IContentUserLoader,
	id,
	IStoreGetters,
	ISyncableMutableSubscribableContentUser,
	IVuexStore,
	STORE_MUTATION_TYPES
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {
	getContentId,
	getContentUserId
} from './ContentUserLoaderUtils';
import {error, log} from '../../core/log';
import * as firebase from 'firebase';
import {TAGS} from '../../objects/tags';
import {OverdueListener, OverdueListenerCore} from '../../objects/contentUser/overdueListener';
import Reference = firebase.database.Reference;
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {Store} from 'vuex';
import {IDisplayOverdueMessageMutationArgs} from '../../core/store/store_interfaces';

// Use composition over inheritance. . . . a Penguin IS a bird . . . but penguins can't fly
@injectable()
export class ContentUserLoaderAndOverdueListener implements IContentUserLoader {
	private firebaseRef: Reference;
	private contentUserLoader: IContentUserLoader;
	private getters: IStoreGetters;
	// private contentLoader: IContentLoader;

	constructor(@inject(TYPES.ContentUserLoaderAndOverdueListenerArgs){
		firebaseRef,
		contentUserLoader,
		getters,
	}: ContentUserLoaderAndOverdueListenerArgs) {
		this.contentUserLoader = contentUserLoader;
		this.firebaseRef = firebaseRef;
		this.getters = getters;
	}

	public getData({contentId, userId}: { contentId: any; userId: any }): IContentUserData {
		return this.contentUserLoader.getData({contentId, userId});
		// return undefined;
	}

	public getItem({contentUserId}: { contentUserId: any }): ISyncableMutableSubscribableContentUser {
		return this.contentUserLoader.getItem({contentUserId});
		// return undefined;
	}

	public isLoaded({contentId, userId}: { contentId: any; userId: any }): boolean {
		return this.contentUserLoader.isLoaded({contentId, userId});
	}

	public async downloadData({contentId, userId}: { contentId: any; userId: any }): Promise<IContentUserData> {
		if (this.isLoaded({contentId, userId})) {
			error('contentUserLoader:', contentId, userId, ' is already loaded! No need to download again');
			return;
		}
		const contentUserData: IContentUserData = await this.contentUserLoader.downloadData({contentId, userId});
		const contentUserId = getContentUserId({contentId, userId});
		const contentUser = this.getItem({contentUserId});
		const store = this.getters.getStore()
		const overdueListenerCore = new OverdueListenerCore(
			{
				overdue: contentUser.overdue,
				nextReviewTime: contentUser.nextReviewTime,
				timeoutId: null,
				onOverdue: () => onOverdue(contentUserId, store)
			}
		); // = getContentUserRef({contentId, userId, contentUsersRef: this.firebaseRef})
		const overdueListener = new OverdueListener({overdueListenerCore});
		overdueListener.start();

		return contentUserData;
	}
}

@injectable()
export class ContentUserLoaderAndOverdueListenerArgs {
	@inject(TYPES.FirebaseReference) @tagged(TAGS.CONTENT_USERS_REF, true) public firebaseRef: Reference;
	@inject(TYPES.IContentUserLoader) @tagged(TAGS.AUTO_SAVER, true) public contentUserLoader: IContentUserLoader;
	@inject(TYPES.IStoreGetters) public getters: IStoreGetters;
}

export function getOverdueMessageFromContent(content: IContentData) {
	return `Time to review ${content.question}`
}

export function onOverdue(contentUserId: id, store: IVuexStore) {
	const contentId = getContentId({contentUserId})
	const mutation: IDisplayOverdueMessageMutationArgs = {
		contentId,
	}
	store.commit(MUTATION_NAMES.DISPLAY_OVERDUE_MESSAGE, mutation)
}
