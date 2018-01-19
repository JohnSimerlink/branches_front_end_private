import {log} from '../../../core/log'
import {
    IContentUserData, IFirebaseRef, IMutableSubscribableContentUser,
    IMutableSubscribableContentUserStore, IObjectFirebaseAutoSaver,
} from '../../interfaces';
import {inject} from 'inversify';
import {TYPES} from '../../types';
import {MutableSubscribableContentUserStore} from './MutableSubscribableContentUserStore';
import {ObjectFirebaseAutoSaver} from '../../dbSync/ObjectAutoFirebaseSaver';

export class AutoSaveMutableSubscribableContentUserStore extends MutableSubscribableContentUserStore
    implements IMutableSubscribableContentUserStore {
    // TODO: I sorta don't like how store is responsible for connecting the item to an auto saver
    private contentUsersFirebaseRef: IFirebaseRef
    constructor(@inject(TYPES.AutoSaveMutableSubscribableContentUserStoreArgs){
        storeSource, updatesCallbacks, contentUsersFirebaseRef,
    }) {
        super({storeSource, updatesCallbacks})
        this.contentUsersFirebaseRef = contentUsersFirebaseRef
    }
    public addAndSubscribeToItemFromData(
        {id, contentUserData}:
        { id: string; contentUserData: IContentUserData; })
    : IMutableSubscribableContentUser {
        const contentUser: IMutableSubscribableContentUser =
            super.addAndSubscribeToItemFromData({id, contentUserData})
        const contentUserFirebaseRef = this.contentUsersFirebaseRef.child(id)
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
