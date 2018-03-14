import * as firebase from 'firebase';
import {inject, injectable, tagged} from 'inversify';
import {log} from '../../../app/core/log';
import {
    ISubscribableContentStoreSource,
    IContentLoader, IContentData, ISyncableMutableSubscribableContent, IContentDataFromDB
} from '../../objects/interfaces';
import {isValidContent, isValidContentDataFromDB} from '../../objects/content/contentValidator';
import Reference = firebase.database.Reference;
import {TYPES} from '../../objects/types';
import {ContentDeserializer} from './ContentDeserializer';
import {TAGS} from '../../objects/tags';

@injectable()
export class ContentLoader implements IContentLoader {
    private storeSource: ISubscribableContentStoreSource;
    private firebaseRef: Reference;
    constructor(@inject(TYPES.ContentLoaderArgs){firebaseRef, storeSource}: ContentLoaderArgs) {
        this.storeSource = storeSource;
        this.firebaseRef = firebaseRef;
    }

    public getData(contentId): IContentData {
        const contentItem = this.storeSource.get(contentId);
        if (!contentItem) {
            throw new RangeError(contentId +
                ' does not exist in ContentLoader storeSource. Use isLoaded(contentId) to check.');
        }
        return contentItem.val();
        // TODO: fix violoation of law of demeter
    }
    public getItem(contentId: any): ISyncableMutableSubscribableContent {
        const contentItem = this.storeSource.get(contentId);
        if (!contentItem) {
            throw new RangeError(contentId +
                ' does not exist in ContentLoader storeSource. Use isLoaded(contentId) to check.');
        }
        return contentItem;
    }

    // TODO: this method violates SRP.
    // it returns data AND has the side effect of storing the data in the storeSource
    public async downloadData(contentId: string): Promise<IContentData> {
        if (this.isLoaded(contentId)) {
            return this.getData(contentId);
        }
        const me = this;
        return new Promise((resolve, reject) => {
            this.firebaseRef.child(contentId).once('value', (snapshot) => {
                const contentDataFromDB: IContentDataFromDB = snapshot.val();
                if (!contentDataFromDB) {
                    return;
                    /* return without resolving promise. The .on('value') triggers an event which
                     resolves with a snapshot right away.
                     Often this first snapshot is null, if firebase hasn't called the network yet,
                      or if the FirebaseMock hasn't flushed a mocked a fake event yet
                      Therefore we just return without resolving,
                       as the promise will actually get resolved in ideally a few more (dozen) milliseconds
                       */
                }
                // let children = contentDataFromDB.children || {}
                // children = setToStringArray(children)
                // contentDataFromDB.children = children as string[]

                if (isValidContentDataFromDB(contentDataFromDB)) {
                    const content: ISyncableMutableSubscribableContent =
                        ContentDeserializer.deserializeFromDB({contentId, contentDataFromDB});
                    const contentData: IContentData
                        = ContentDeserializer.convertContentDataFromDBToApp({contentDataFromDB});
                    me.storeSource.set(contentId, content);
                    resolve(contentData);
                } else {
                    reject('contentDataFromDB is invalid! ! ' + JSON.stringify(contentDataFromDB));
                }
            });
        }) as Promise<IContentData>;
        // TODO ^^ Figure out how to do this without casting
    }

    public isLoaded(contentId): boolean {
        return !!this.storeSource.get(contentId);
    }

}

@injectable()
export class ContentLoaderArgs {
    @inject(TYPES.FirebaseReference) @tagged(TAGS.CONTENT_REF, true) public firebaseRef: Reference;
    @inject(TYPES.ISubscribableContentStoreSource) public storeSource: ISubscribableContentStoreSource;
}
