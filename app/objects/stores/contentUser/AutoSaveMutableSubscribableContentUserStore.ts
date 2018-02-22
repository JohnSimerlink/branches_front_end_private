import {log} from '../../../core/log'
import {
    IContentUserData,
    IMutableSubscribableContentUserStore, IObjectFirebaseAutoSaver, ISyncableMutableSubscribableContentUser,
    ISyncableMutableSubscribableContentUserStore,
} from '../../interfaces';
import {inject, injectable, tagged} from 'inversify';
import {TYPES} from '../../types';
import {MutableSubscribableContentUserStore} from './MutableSubscribableContentUserStore';
import {ObjectFirebaseAutoSaver} from '../../dbSync/ObjectAutoFirebaseSaver';
import {getContentId, getUserId} from '../../../loaders/contentUser/ContentUserLoaderUtils';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {TAGS} from '../../tags';

@injectable()
export class AutoSaveMutableSubscribableContentUserStore extends MutableSubscribableContentUserStore
    implements ISyncableMutableSubscribableContentUserStore {
    // TODO: I sorta don't like how store is responsible for connecting the item to an auto saver
    private contentUsersFirebaseRef: Reference
    constructor(@inject(TYPES.AutoSaveMutableSubscribableContentUserStoreArgs){
        storeSource, updatesCallbacks, contentUsersFirebaseRef,
    }: AutoSaveMutableSubscribableContentUserStoreArgs) {
        super({storeSource, updatesCallbacks})
        // log('328pm AutoSaverMutableSubscribableContentUserStore created')
        this.contentUsersFirebaseRef = contentUsersFirebaseRef
    }
    public addAndSubscribeToItemFromData(
        {id, contentUserData}:
        { id: string; contentUserData: IContentUserData; })
    : ISyncableMutableSubscribableContentUser {
        log('AutoSaveMutableSubscribableContentStore addAndSubscribeToItemFromData', id, contentUserData)
        const contentUser: ISyncableMutableSubscribableContentUser =
            super.addAndSubscribeToItemFromData({id, contentUserData})
        log('contentUser just created is', contentUser)
        const contentId = getContentId({contentUserId: id})
        const userId = getUserId({contentUserId: id})
        const contentUsersContentFirebaseRef = this.contentUsersFirebaseRef.child(contentId)
        const contentUserFirebaseRef = contentUsersContentFirebaseRef.child(userId)
        log('contentUserFirebaseRef is', contentUserFirebaseRef)
        const objectFirebaseAutoSaver: IObjectFirebaseAutoSaver = new ObjectFirebaseAutoSaver({
            syncableObject: contentUser,
            syncableObjectFirebaseRef: contentUserFirebaseRef
        })
        /* TODO: there are two spots in our code (contentUserLoader and contentUserStore)
         where in our composed objects we create an auto saver and an overdueListener.
         It's essentially copied and pasted code. . . . Find some way to unify */
        objectFirebaseAutoSaver.initialSave()
        objectFirebaseAutoSaver.start()
        // TODO: this needs to add the actual value into the db
        return contentUser
    }
}
@injectable()
export class AutoSaveMutableSubscribableContentUserStoreArgs {
    @inject(TYPES.ISubscribableContentUserStoreSource)
        public storeSource;
    @inject(TYPES.Array)
        public updatesCallbacks;
    @inject(TYPES.FirebaseReference)
    @tagged(TAGS.CONTENT_USERS_REF, true)
        public contentUsersFirebaseRef: Reference;
}
