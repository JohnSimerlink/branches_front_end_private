import {inject, injectable, tagged} from 'inversify';
import {
    IContentUserData, IContentUserLoader, IMutableSubscribableContentUser, IObjectFirebaseAutoSaver,
    ISubscribableContentUserStoreSource, ISyncableMutableSubscribableContentUser
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {ContentUserLoader} from './ContentUserLoader';
import {getContentUserId, getContentUserRef} from './ContentUserLoaderUtils';
import {log, error} from '../../core/log'
import {ObjectFirebaseAutoSaver} from '../../objects/dbSync/ObjectAutoFirebaseSaver';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {TAGS} from '../../objects/tags';
import {OverdueListener, OverdueListenerCore} from "../../objects/contentUser/overdueListener";

// Use composition over inheritance. . . . a Penguin IS a bird . . . but penguins can't fly
@injectable()
export class ContentUserLoaderAndOverdueListener implements IContentUserLoader {
    private firebaseRef: Reference
    private contentUserLoader: IContentUserLoader
    constructor(@inject(TYPES.ContentUserLoaderAndOverdueListenerArgs){
    firebaseRef, contentUserLoader, }: ContentUserLoaderAndOverdueListenerArgs) {
        this.contentUserLoader = contentUserLoader
        this.firebaseRef = firebaseRef
    }

    public getData({contentId, userId}: { contentId: any; userId: any }): IContentUserData {
        return this.contentUserLoader.getData({contentId, userId})
        // return undefined;
    }

    public getItem({contentUserId}: { contentUserId: any }): ISyncableMutableSubscribableContentUser {
        return this.contentUserLoader.getItem({contentUserId})
        // return undefined;
    }

    public isLoaded({contentId, userId}: { contentId: any; userId: any }): boolean {
        return this.contentUserLoader.isLoaded({contentId, userId})
        // return undefined;
    }

    public async downloadData({contentId, userId}: { contentId: any; userId: any }): Promise<IContentUserData> {
        if (this.isLoaded({contentId, userId})) {
            error('contentUserLoader:', contentId, userId, ' is already loaded! No need to download again')
            return
        }
        const contentUserData: IContentUserData = await this.contentUserLoader.downloadData({contentId, userId})
        const contentUserId = getContentUserId({contentId, userId})
        const contentUser = this.getItem({contentUserId})
        const overdueListenerCore = new OverdueListenerCore(
            {overdue: contentUser.overdue, nextReviewTime: contentUser.nextReviewTime, timeoutId: null}
        ) // = getContentUserRef({contentId, userId, contentUsersRef: this.firebaseRef})
        const overdueListener = new OverdueListener({overdueListenerCore})
        overdueListener.start()

        return contentUserData
    }
}

@injectable()
export class ContentUserLoaderAndOverdueListenerArgs {
    @inject(TYPES.FirebaseReference) @tagged(TAGS.CONTENT_USERS_REF, true) public firebaseRef: Reference
    @inject(TYPES.IContentUserLoader) @tagged(TAGS.AUTO_SAVER, true) public contentUserLoader: IContentUserLoader
}
