import {log} from '../../../core/log'
import {
    IContentUserData,
    IMutableSubscribableContentUserStore, IObjectFirebaseAutoSaver, ISyncableMutableSubscribableContentUser,
} from '../../interfaces';
import {inject, injectable} from 'inversify';
import {TYPES} from '../../types';
import {MutableSubscribableContentUserStore} from './MutableSubscribableContentUserStore';
import {ObjectFirebaseAutoSaver} from '../../dbSync/ObjectAutoFirebaseSaver';
import {getContentId, getUserId} from '../../../loaders/contentUser/ContentUserLoaderUtils';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;

@injectable()
export class AutoSaveMutableSubscribableContentUserStore extends MutableSubscribableContentUserStore
    implements IMutableSubscribableContentUserStore {
    // TODO: I sorta don't like how store is responsible for connecting the item to an auto saver
    private contentUsersFirebaseRef: Reference
    constructor(@inject(TYPES.AutoSaveMutableSubscribableContentUserStoreArgs){
        storeSource, updatesCallbacks, contentUsersFirebaseRef,
    }: AutoSaveMutableSubscribableContentUserStoreArgs) {
        super({storeSource, updatesCallbacks})
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
        objectFirebaseAutoSaver.initialSave()
        objectFirebaseAutoSaver.start()
        // TODO: this needs to add the actual value into the db
        return contentUser
    }
}
@injectable()
export class AutoSaveMutableSubscribableContentUserStoreArgs {
    @inject(TYPES.ISubscribableContentUserStoreSource) public storeSource;
    @inject(TYPES.Array) public updatesCallbacks;
    @inject(TYPES.IFirebaseRef) public contentUsersFirebaseRef: Reference;
}
