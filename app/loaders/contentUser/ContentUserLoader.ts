import * as firebase from 'firebase';
import {inject, injectable, tagged} from 'inversify';
import {error, log} from '../../../app/core/log';
import {
    IContentUserData,
    IContentUserDataFromDB,
    IContentUserLoader,
    ISubscribableContentUserStoreSource,
    ISyncableMutableSubscribableContentUser
} from '../../objects/interfaces';
import {isValidContentUserDataFromDB} from '../../objects/contentUser/ContentUserValidator';
import {TYPES} from '../../objects/types';
import {ContentUserDeserializer} from './ContentUserDeserializer';
import {getContentUserId, getContentUserRef} from './ContentUserLoaderUtils';
import {TAGS} from '../../objects/tags';
import Reference = firebase.database.Reference;

@injectable()
export class ContentUserLoader implements IContentUserLoader {
    private storeSource: ISubscribableContentUserStoreSource;
    private firebaseRef: Reference;
    constructor(@inject(TYPES.ContentUserLoaderArgs){firebaseRef, storeSource}: ContentUserLoaderArgs) {
        this.storeSource = storeSource;
        this.firebaseRef = firebaseRef;
    }

    public getData({contentId, userId}): IContentUserData {
        const contentUserId = getContentUserId({contentId, userId});
        if (!this.storeSource.get(contentUserId)) {
            throw new RangeError(contentUserId +
                ' does not exist in ContentUserLoader storeSource. Use isLoaded(contentUserId) to check.');
        }
        return this.storeSource.get(contentUserId).val();
        // TODO: fix violoation of law of demeter
    }

    public getItem({contentUserId}): ISyncableMutableSubscribableContentUser {
        const contentItem = this.storeSource.get(contentUserId);
        if (!contentItem) {
            throw new RangeError(contentUserId +
                ' does not exist in ContentUserLoader storeSource. Use isLoaded(contentUserId) to check.');
        }
        return contentItem;
        // TODO: fix violoation of law of demeter
    }

    // TODO: this method violates SRP.
    // it returns data AND has the side effect of storing the data in the storeSource
    public async downloadData({contentId, userId}): Promise<IContentUserData> {
        if (!contentId || ! userId ) {
          throw RangeError('No contentId or userId supplied for downloadData');
        }
        const contentUserId = getContentUserId({contentId, userId});
        if (this.isLoaded({contentId, userId})) {
            return this.getData({contentId, userId});
        }
        const contentUserRef: Reference =
            getContentUserRef({contentUsersRef: this.firebaseRef, contentId, userId});
        const me = this;
        return new Promise((resolve, reject) => {
            contentUserRef.once('value', (snapshot) => {
                const contentUserDataFromDB: IContentUserDataFromDB = snapshot.val();
                if (!contentUserDataFromDB) {
                    return;
                    /* return without resolving promise. The .on('value') triggers an event which
                     resolves with a snapshot right away.
                     Often this first snapshot is null, if firebase hasn't called the network yet,
                      or if the FirebaseMock hasn't flushed a mocked a fake event yet
                      Therefore we just return without resolving,
                       as the promise will actually get resolved in ideally a few more (dozen) milliseconds
                       Additionally it could be that we aren't in testing mode, and that rather no contentUserData
                        exists for this id . . .
                        in which case we should end this method
                         and not call the contentUserDeserializer any way
                       */
                } else {
                }
                contentUserDataFromDB.id = contentUserId;
                // let children = contentUser.children || {}
                // children = setToStringArray(children)
                // contentUser.children = children as string[]

                const contentUserData: IContentUserData =
                    ContentUserDeserializer.convertDBDataToObjectData({contentUserDataFromDB, id: contentUserId});
                if (isValidContentUserDataFromDB(contentUserDataFromDB)) {
                    const contentUser: ISyncableMutableSubscribableContentUser =
                        ContentUserDeserializer.deserializeFromDB({id: contentUserId, contentUserDataFromDB});
                    console.log('contentUser deserialized in ContentUserLoader.ts lastInteractionTime is ',
                        contentUser.lastInteractionTime.val(), 'nextReviewTIme is ', contentUser.nextReviewTime.val())
                    me.storeSource.set(contentUserId, contentUser);
                    resolve(contentUserData);
                } else {
                    setTimeout(() => {}, 0);
                    reject('contentUser is invalid! ! ' + JSON.stringify(contentUserData));
                }
            });
        }) as Promise<IContentUserData>;
        // TODO ^^ Figure out how to do this without casting
    }

    // TODO: violates the COMMAND, DON'T ASK PRINCIPLE
    public isLoaded({contentId, userId}): boolean {
        const contentUserId = getContentUserId({contentId, userId});
        return !!this.storeSource.get(contentUserId);
    }

}

@injectable()
export class ContentUserLoaderArgs {
    @inject(TYPES.FirebaseReference) @tagged(TAGS.CONTENT_USERS_REF, true) public firebaseRef: Reference;
    @inject(TYPES.ISubscribableContentUserStoreSource) public storeSource: ISubscribableContentUserStoreSource;
}
