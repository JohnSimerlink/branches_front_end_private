import {log} from '../../../core/log'
import {
    IContentData,
    IMutableSubscribableContentStore, IObjectFirebaseAutoSaver, ISyncableMutableSubscribableContent,
} from '../../interfaces';
import {inject, injectable, tagged} from 'inversify';
import {TYPES} from '../../types';
import {ObjectFirebaseAutoSaver} from '../../dbSync/ObjectAutoFirebaseSaver';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {MutableSubscribableContentStore} from './MutableSubscribableContentStore';
import {TAGS} from '../../tags';

export class AutoSaveMutableSubscribableContentStore extends MutableSubscribableContentStore
    implements IMutableSubscribableContentStore {
    // TODO: I sorta don't like how store is responsible for connecting the item to an auto saver
    private contentFirebaseRef: Reference
    constructor(@inject(TYPES.AutoSaveMutableSubscribableContentStoreArgs){
        storeSource, updatesCallbacks, contentFirebaseRef,
    }: AutoSaveMutableSubscribableContentStoreArgs) {
        super({storeSource, updatesCallbacks})
        // log('328pm AutoSaverMutableSubscribableContentStore created')
        this.contentFirebaseRef = contentFirebaseRef
    }
    public addAndSubscribeToItemFromData(
        {id, contentData}:
        { id: string; contentData: IContentData; })
    : ISyncableMutableSubscribableContent {
        log('AutoSaveMutableSubscribableContentStore addAndSubscribeToItemFromData', id, contentData)
        const contentId = id
        const contentItem: ISyncableMutableSubscribableContent =
            super.addAndSubscribeToItemFromData({id, contentData})
        log('content just created is', contentItem)
        const contentItemFirebaseRef = this.contentFirebaseRef.child(contentId)
        // const contentItemFirebaseRef = contentFirebaseRef.child(userId)
        const objectFirebaseAutoSaver: IObjectFirebaseAutoSaver = new ObjectFirebaseAutoSaver({
            syncableObject: contentItem,
            syncableObjectFirebaseRef: contentItemFirebaseRef
        })
        objectFirebaseAutoSaver.initialSave()
        objectFirebaseAutoSaver.start()
        // TODO: this needs to add the actual value into the db
        return contentItem
    }
}
@injectable()
export class AutoSaveMutableSubscribableContentStoreArgs {
    @inject(TYPES.ISubscribableContentStoreSource) public storeSource;
    @inject(TYPES.Array) public updatesCallbacks;
    @inject(TYPES.FirebaseReference)
    @tagged(TAGS.CONTENT_REF, true)
        public contentFirebaseRef: Reference;
}
