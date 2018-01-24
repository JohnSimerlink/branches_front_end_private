import {inject, injectable} from 'inversify';
import {
    IContentUserData, IContentUserLoader, IFirebaseRef, IMutableSubscribableContentUser, IObjectFirebaseAutoSaver,
    ISubscribableContentUserStoreSource, ISyncableMutableSubscribableContentUser
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {ContentUserLoader} from './ContentUserLoader';
import {getContentUserId, getContentUserRef} from './ContentUserLoaderUtils';
import {log} from '../../core/log'
import {ObjectFirebaseAutoSaver} from '../../objects/dbSync/ObjectAutoFirebaseSaver';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;

// Use composition over inheritance. . . . a Penguin IS a bird . . . but penguins can't fly
@injectable()
export class ContentUserLoaderAndAutoSaver extends ContentUserLoader implements IContentUserLoader {
    private firebaseRefCopy: Reference
    constructor(@inject(TYPES.ContentUserLoaderAndAutoSaverArgs){
        firebaseRef, storeSource, }: ContentUserLoaderAndAutoSaverArgs) {
        super({firebaseRef, storeSource})
        this.firebaseRefCopy = firebaseRef
    }

    public async downloadData({contentId, userId}: { contentId: any; userId: any }): Promise<IContentUserData> {
        if (this.isLoaded({contentId, userId})) {
            log('contentUserLoader:', contentId, userId, ' is already loaded! No need to download again')
            return
        }
        const contentUserData: IContentUserData = await super.downloadData({contentId, userId})
        const contentUserId = getContentUserId({contentId, userId})
        const contentUser = this.getItem({contentUserId})
        const contentUserFirebaseRef = getContentUserRef({contentId, userId, contentUsersRef: this.firebaseRefCopy})
        const contentUserAutoSaver: IObjectFirebaseAutoSaver =
            new ObjectFirebaseAutoSaver({
                    syncableObjectFirebaseRef: contentUserFirebaseRef, syncableObject: contentUser
            })
        log('contentUser.proficiency before autosaver start', contentUser.proficiency)
        contentUserAutoSaver.start()
        log('contentUser.proficiency after autosaver start', contentUser.proficiency)
        log('contentUserAutoSaver start just called')

        return contentUserData
    }
}

@injectable()
export class ContentUserLoaderAndAutoSaverArgs {
    @inject(TYPES.FirebaseReference) public firebaseRef: Reference
    @inject(TYPES.ISubscribableContentUserStoreSource) public storeSource: ISubscribableContentUserStoreSource
}
