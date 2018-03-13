import {inject, injectable, tagged} from 'inversify';
import {
    IContentData, IContentLoader, id, IMutableSubscribableContent, IObjectFirebaseAutoSaver,
    ISubscribableContentStoreSource, ISyncableMutableSubscribableContent
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {ContentLoader} from './ContentLoader';
import {log} from '../../core/log'
import {ObjectFirebaseAutoSaver} from '../../objects/dbSync/ObjectAutoFirebaseSaver';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {TAGS} from '../../objects/tags';

// Use composition over inheritance. . . . a Penguin IS a bird . . . but penguins can't fly
@injectable()
export class ContentLoaderAndAutoSaver implements IContentLoader {
    private firebaseRef: Reference;
    private contentLoader: IContentLoader;
    constructor(@inject(TYPES.ContentLoaderAndAutoSaverArgs){
        firebaseRef, contentLoader, }: ContentLoaderAndAutoSaverArgs) {
        this.contentLoader = contentLoader;
        this.firebaseRef = firebaseRef
    }

    public getData(contentId: id): IContentData {
        return this.contentLoader.getData(contentId)
    }

    public getItem(treeId: any): ISyncableMutableSubscribableContent {
        return this.contentLoader.getItem(treeId)
    }

    public isLoaded(contentId: id): boolean {
        return this.contentLoader.isLoaded(contentId)
    }

    public async downloadData(contentId: id): Promise<IContentData> {
        if (this.isLoaded(contentId)) {
            log('contentLoader:', contentId,
                ' is already loaded! No need to download again');
            return
        }
        const contentData: IContentData = await this.contentLoader.downloadData(contentId);
        const content = this.getItem(contentId);

        const contentFirebaseRef = this.firebaseRef.child(contentId);
        const contentAutoSaver: IObjectFirebaseAutoSaver =
            new ObjectFirebaseAutoSaver({
                syncableObjectFirebaseRef: contentFirebaseRef,
                syncableObject: content
            });
        contentAutoSaver.start();

        return contentData
    }
}

@injectable()
export class ContentLoaderAndAutoSaverArgs {
    @inject(TYPES.FirebaseReference) @tagged(TAGS.CONTENT_REF, true) public firebaseRef: Reference;
    @inject(TYPES.IContentLoader) public contentLoader: IContentLoader
}
