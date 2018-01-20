import * as firebase from 'firebase';
import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    IMutableSubscribableContentUser, ISubscribableStoreSource, ISubscribableContentUserStoreSource,
    IContentUserLoader, IContentUserData
} from '../../objects/interfaces';
import {isValidContentUser} from '../../objects/contentUser/contentUserValidator';
import Reference = firebase.database.Reference;
import {TYPES} from '../../objects/types';
import {ContentUserDeserializer} from './ContentUserDeserializer';
import {setToStringArray} from '../../core/newUtils';
import {getContentUserId} from './ContentUserLoaderUtils';

@injectable()
export class ContentUserLoader implements IContentUserLoader {
    private storeSource: ISubscribableContentUserStoreSource
    private firebaseRef: Reference
    constructor(@inject(TYPES.ContentUserLoaderArgs){firebaseRef, storeSource}) {
        this.storeSource = storeSource
        this.firebaseRef = firebaseRef
    }

    public getData({contentId, userId}): IContentUserData {
        const contentUserId = getContentUserId({contentId, userId})
        if (!this.storeSource.get(contentUserId)) {
            throw new RangeError(contentUserId +
                ' does not exist in ContentUserLoader storeSource. Use isLoaded(contentUserId) to check.')
        }
        return this.storeSource.get(contentUserId).val()
        // TODO: fix violoation of law of demeter
    }

    public getItem({contentUserId}): IMutableSubscribableContentUser {
        const contentItem = this.storeSource.get(contentUserId)
        if (!contentItem) {
            throw new RangeError(contentUserId +
                ' does not exist in ContentUserLoader storeSource. Use isLoaded(contentUserId) to check.')
        }
        return contentItem
        // TODO: fix violoation of law of demeter
    }

    // TODO: this method violates SRP.
    // it returns data AND has the side effect of storing the data in the storeSource
    public async downloadData({contentId, userId}): Promise<IContentUserData> {
        if (!contentId || ! userId ) {
          throw RangeError('No contentId or userId supplied for downloadData')
        }
        const contentUserId = getContentUserId({contentId, userId})
        const contentUsersFirebaseRefForContentId = this.firebaseRef.child(contentId)
        const contentUserRef = contentUsersFirebaseRefForContentId.child(userId)
        log('contentUserLoader downloadData called')
        const me = this
        return new Promise((resolve, reject) => {
            contentUserRef.on('value', (snapshot) => {
                log('contentUserLoader data received', snapshot.val(), contentUserRef)
                const contentUserData: IContentUserData = snapshot.val()
                if (!contentUserData) {
                    return
                    /* return without resolving promise. The .on('value') triggers an event which
                     resolves with a snapshot right away.
                     Often this first snapshot is null, if firebase hasn't called the network yet,
                      or if the FirebaseMock hasn't flushed a mocked a fake event yet
                      Therefore we just return without resolving,
                       as the promise will actually get resolved in ideally a few more (dozen) milliseconds
                       */
                }
                contentUserData.id = contentUserId
                // let children = contentUser.children || {}
                // children = setToStringArray(children)
                // contentUser.children = children as string[]

                if (isValidContentUser(contentUserData)) {
                    const contentUser: IMutableSubscribableContentUser =
                        ContentUserDeserializer.deserialize({id: contentUserId, contentUserData})
                    me.storeSource.set(contentUserId, contentUser)
                    resolve(contentUserData)
                } else {
                    reject('contentUser is invalid! ! ' + JSON.stringify(contentUserData))
                }
            })
        }) as Promise<IContentUserData>
        // TODO ^^ Figure out how to do this without casting
    }

    // TODO: violates the COMMAND, DON'T ASK PRINCIPLE
    public isLoaded({contentId, userId}): boolean {
        const contentUserId = getContentUserId({contentId, userId})
        return !!this.storeSource.get(contentUserId)
    }

}

@injectable()
export class ContentUserLoaderArgs {
    @inject(TYPES.FirebaseReference) public firebaseRef: Reference
    @inject(TYPES.ISubscribableContentUserStoreSource) public storeSource: ISubscribableContentUserStoreSource
}
