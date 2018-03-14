import {inject, injectable, tagged} from 'inversify';
import {
    ITreeData, ITreeLoader, IMutableSubscribableTree, IObjectFirebaseAutoSaver,
    ISubscribableTreeStoreSource, ISyncableMutableSubscribableTree, ITreeDataWithoutId, id
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {log} from '../../core/log';
import {ObjectFirebaseAutoSaver} from '../../objects/dbSync/ObjectAutoFirebaseSaver';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {TAGS} from '../../objects/tags';

// Use composition over inheritance. . . . a Penguin IS a bird . . . but penguins can't fly
@injectable()
export class TreeLoaderAndAutoSaver implements ITreeLoader {
    private firebaseRef: Reference;
    private treeLoader: ITreeLoader;
    constructor(@inject(TYPES.TreeLoaderAndAutoSaverArgs){
        firebaseRef, treeLoader, }: TreeLoaderAndAutoSaverArgs) {
        this.treeLoader = treeLoader;
        this.firebaseRef = firebaseRef;
    }

    public getData(treeId: id): ITreeDataWithoutId {
        return this.treeLoader.getData(treeId);
    }

    public getItem(treeId: id): ISyncableMutableSubscribableTree {
        return this.treeLoader.getItem(treeId);
    }

    public isLoaded(treeId: id): boolean {
        return this.treeLoader.isLoaded(treeId);
    }

    public async downloadData(treeId: id): Promise<ITreeDataWithoutId> {
        if (this.isLoaded(treeId)) {
            log('treeLoader:', treeId, ' is already loaded! No need to download again');
            return;
        }
        const treeData: ITreeDataWithoutId = await this.treeLoader.downloadData(treeId);
        const tree = this.getItem(treeId);
        const treeFirebaseRef = this.firebaseRef.child(treeId);
        const treeAutoSaver: IObjectFirebaseAutoSaver =
            new ObjectFirebaseAutoSaver({
                syncableObjectFirebaseRef: treeFirebaseRef,
                syncableObject: tree
            });
        treeAutoSaver.start();

        return treeData;
    }
}

@injectable()
export class TreeLoaderAndAutoSaverArgs {
    @inject(TYPES.FirebaseReference) @tagged(TAGS.TREES_REF, true) public firebaseRef: Reference;
    @inject(TYPES.ITreeLoader) @tagged(TAGS.SPECIAL_TREE_LOADER, true) public treeLoader: ITreeLoader;
}
