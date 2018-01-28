import {log} from '../../../core/log'
import {
    IMutableSubscribableTreeStore, IObjectFirebaseAutoSaver, ISyncableMutableSubscribableTree, ITreeDataWithoutId,
} from '../../interfaces';
import {inject, injectable} from 'inversify';
import {TYPES} from '../../types';
import {ObjectFirebaseAutoSaver} from '../../dbSync/ObjectAutoFirebaseSaver';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {MutableSubscribableTreeStore} from './MutableSubscribableTreeStore';

@injectable()
export class AutoSaveMutableSubscribableTreeStore extends MutableSubscribableTreeStore
    implements IMutableSubscribableTreeStore {
    // TODO: I sorta don't like how store is responsible for connecting the item to an auto saver
    private treesFirebaseRef: Reference
    constructor(@inject(TYPES.AutoSaveMutableSubscribableTreeStoreArgs){
        storeSource, updatesCallbacks, treesFirebaseRef,
    }: AutoSaveMutableSubscribableTreeStoreArgs) {
        super({storeSource, updatesCallbacks})
        log('328pm AutoSaverMutableSubscribableTreeStore created')
        this.treesFirebaseRef = treesFirebaseRef
    }
    public addAndSubscribeToItemFromData(
        {id, treeDataWithoutId}:
        { id: string; treeDataWithoutId: ITreeDataWithoutId; })
    : ISyncableMutableSubscribableTree {
        log('AutoSaveMutableSubscribableTreeStore addAndSubscribeToItemFromData', id, treeDataWithoutId)
        const treeId = id
        const treeItem: ISyncableMutableSubscribableTree =
            super.addAndSubscribeToItemFromData({id, treeDataWithoutId})
        log('tree just created is', treeItem)
        const treeItemFirebaseRef = this.treesFirebaseRef.child(treeId)
        // const treeItemFirebaseRef = treeFirebaseRef.child(userId)
        const objectFirebaseAutoSaver: IObjectFirebaseAutoSaver = new ObjectFirebaseAutoSaver({
            syncableObject: treeItem,
            syncableObjectFirebaseRef: treeItemFirebaseRef
        })
        objectFirebaseAutoSaver.initialSave()
        objectFirebaseAutoSaver.start()
        // TODO: this needs to add the actual value into the db
        return treeItem
    }
}
@injectable()
export class AutoSaveMutableSubscribableTreeStoreArgs {
    @inject(TYPES.ISubscribableTreeStoreSource) public storeSource;
    @inject(TYPES.Array) public updatesCallbacks;
    @inject(TYPES.IFirebaseRef) public treesFirebaseRef: Reference;
}
