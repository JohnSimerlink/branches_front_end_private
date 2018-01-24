import * as firebase from 'firebase';
import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    IMutableSubscribableContentUser, ISubscribableStoreSource, ISubscribableContentUserStoreSource,
    IContentUserLoader, IContentUserData, IContentUserDataFromDB, IFirebaseRef, ISyncableMutableSubscribableContentUser
} from '../../objects/interfaces';
import {isValidContentUser, isValidContentUserDataFromDB} from '../../objects/contentUser/contentUserValidator';
import Reference = firebase.database.Reference;
import {TYPES} from '../../objects/types';
import {ContentUserDeserializer} from './ContentUserDeserializer';
import {setToStringArray} from '../../core/newUtils';
import {getContentUserId, getContentUserRef} from './ContentUserLoaderUtils';

@injectable()
export class ContentUserLoader implements IContentUserLoader {
    private storeSource: ISubscribableContentUserStoreSource
    private firebaseRef: Reference
    constructor(@inject(TYPES.ContentUserLoaderArgs){firebaseRef, storeSource}: ContentUserLoaderArgs) {
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

    public getItem({contentUserId}): ISyncableMutableSubscribableContentUser {
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
        if (this.isLoaded({contentId, userId})) {
            return this.getData({contentId, userId})
        }
        const contentUserRef: IFirebaseRef =
            getContentUserRef({contentUsersRef: this.firebaseRef, contentId, userId})
        log('contentUserLoader downloadData called', contentId, userId)
        const me = this
        return new Promise((resolve, reject) => {
            contentUserRef.once('value', (snapshot) => {
                log('contentUserLoader data received', contentId, userId, snapshot.val())
                const contentUserDataFromDB: IContentUserDataFromDB = snapshot.val()
                log('contentUserLoader data - just valled data', contentUserDataFromDB)
                if (!contentUserDataFromDB) {
                    log('contentUserDataFromDB doesn\'t exist')
                    return
                    /* return without resolving promise. The .on('value') triggers an event which
                     resolves with a snapshot right away.
                     Often this first snapshot is null, if firebase hasn't called the network yet,
                      or if the FirebaseMock hasn't flushed a mocked a fake event yet
                      Therefore we just return without resolving,
                       as the promise will actually get resolved in ideally a few more (dozen) milliseconds
                       */
                } else {
                    log('contentUserDataFromDB exists')
                }
                contentUserDataFromDB.id = contentUserId
                // let children = contentUser.children || {}
                // children = setToStringArray(children)
                // contentUser.children = children as string[]

                const contentUserData: IContentUserData =
                    ContentUserDeserializer.convertDBDataToObjectData({contentUserDataFromDB, id: contentUserId})
                log('about to check if contentUserData valid')
                if (isValidContentUserDataFromDB(contentUserDataFromDB)) {
                    const contentUser: ISyncableMutableSubscribableContentUser =
                        ContentUserDeserializer.deserializeFromDB({id: contentUserId, contentUserDataFromDB})
                    log('ContentUser storeSource about to be set with ', contentUserId, contentUser, contentUser.val())
                    me.storeSource.set(contentUserId, contentUser)
                    resolve(contentUserData)
                } else {
                    log('ContentUserData invalid', contentUserData )
                    setTimeout(() => {}, 0)
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
