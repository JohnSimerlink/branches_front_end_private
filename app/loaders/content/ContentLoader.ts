import * as firebase from 'firebase';
import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    IMutableSubscribableContent, ISubscribableStoreSource, ISubscribableContentStoreSource,
    IContentLoader, IContentData
} from '../../objects/interfaces';
import {isValidContent} from '../../objects/content/contentValidator';
import Reference = firebase.database.Reference;
import {TYPES} from '../../objects/types';
import {ContentDeserializer} from './ContentDeserializer';
import {setToStringArray} from '../../core/newUtils';

@injectable()
export class ContentLoader implements IContentLoader {
    private storeSource: ISubscribableContentStoreSource
    private firebaseRef: Reference
    constructor(@inject(TYPES.ContentLoaderArgs){firebaseRef, storeSource}: ContentLoaderArgs) {
        this.storeSource = storeSource
        this.firebaseRef = firebaseRef
    }

    public getData(contentId): IContentData {
        if (!this.storeSource.get(contentId)) {
            throw new RangeError(contentId +
                ' does not exist in ContentLoader storeSource. Use isLoaded(contentId) to check.')
        }
        return this.storeSource.get(contentId).val()
        // TODO: fix violoation of law of demeter
    }

    // TODO: this method violates SRP.
    // it returns data AND has the side effect of storing the data in the storeSource
    public async downloadData(contentId: string): Promise<IContentData> {
        log('contentLoader downloadData called')
        if (this.isLoaded(contentId)) {
            return this.getData(contentId)
        }
        const me = this
        return new Promise((resolve, reject) => {
            this.firebaseRef.child(contentId).once('value', (snapshot) => {
                const contentData: IContentData = snapshot.val()
                log('contentLoader data received', contentData)
                if (!contentData) {
                    return
                    /* return without resolving promise. The .on('value') triggers an event which
                     resolves with a snapshot right away.
                     Often this first snapshot is null, if firebase hasn't called the network yet,
                      or if the FirebaseMock hasn't flushed a mocked a fake event yet
                      Therefore we just return without resolving,
                       as the promise will actually get resolved in ideally a few more (dozen) milliseconds
                       */
                }
                // let children = contentData.children || {}
                // children = setToStringArray(children)
                // contentData.children = children as string[]

                if (isValidContent(contentData)) {
                    const content: IMutableSubscribableContent =
                        ContentDeserializer.deserialize({contentId, contentData})
                    log('Content storeSource about to be set with ', contentId, content, content.val())
                    me.storeSource.set(contentId, content)
                    resolve(contentData)
                } else {
                    reject('contentData is invalid! ! ' + JSON.stringify(contentData))
                }
            })
        }) as Promise<IContentData>
        // TODO ^^ Figure out how to do this without casting
    }

    public isLoaded(contentId): boolean {
        return !!this.storeSource.get(contentId)
    }

}

@injectable()
export class ContentLoaderArgs {
    @inject(TYPES.FirebaseReference) public firebaseRef: Reference
    @inject(TYPES.ISubscribableContentStoreSource) public storeSource: ISubscribableContentStoreSource
}
