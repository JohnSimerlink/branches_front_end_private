const fileStart = Date.now()
console.log('start: ', fileStart)
console.log('checkpoint0.9: ', Date.now() - fileStart)
// injectFakeDom();
console.log('checkpoint1: ', Date.now() - fileStart)

import test from 'ava';
console.log('checkpoint1.01: ', Date.now() - fileStart)
import {expect} from 'chai';
console.log('checkpoint1.02: ', Date.now() - fileStart)
import * as firebase from 'firebase';
console.log('checkpoint1.03: ', Date.now() - fileStart)
import {MockFirebase} from 'firebase-mock';
console.log('checkpoint1.04: ', Date.now() - fileStart)
import {log} from '../../../app/core/log';
console.log('checkpoint1.1: ', Date.now() - fileStart)
import {getMockRef, myContainer, myContainerLoadAllModules} from '../../../inversify.config';
console.log('checkpoint1.2: ', Date.now() - fileStart)
import {
    IContentUserData,
    IContentUserDataFromDB,
    IContentUserLoader,
    IMutableSubscribableContentUser,
    ISubscribableContentUserStoreSource,
    ISyncableMutableSubscribableContentUser
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {FIREBASE_PATHS} from '../paths';
import {ContentUserDeserializer} from './ContentUserDeserializer';
import {ContentUserLoader, ContentUserLoaderArgs} from './ContentUserLoader';
import {getContentUserId} from './ContentUserLoaderUtils';

import Reference = firebase.database.Reference;
import {
    getASampleContentUser1,
    sampleContentUser1ContentId, sampleContentUser1Id, sampleContentUser1UserId, sampleContentUserData1,
    sampleContentUserData1FromDB
} from '../../objects/contentUser/contentUserTestHelpers';
import {injectionWorks} from '../../testHelpers/testHelpers';
console.log('checkpoint2: ', Date.now() - fileStart)
myContainerLoadAllModules({fakeSigma: true});
console.log('checkpoint3: ', Date.now() - fileStart)
test('ContentUserLoader:::DI constructor should work', (t) => {
    const start1 = Date.now()
    console.log('checkpoint4: ', Date.now() - fileStart)
    console.log('start1: ', start1)
    const injects = injectionWorks<ContentUserLoaderArgs, IContentUserLoader>({
        container: myContainer,
        argsType: TYPES.ContentUserLoaderArgs,
        interfaceType: TYPES.IContentUserLoader,
    })
    expect(injects).to.equal(true)
    t.pass()
    const end1 = Date.now()
    console.log('end1: ', end1)
    console.log('duration: ', end1 - start1)
})
test('ContentUserLoader:::Should mark an id as not loaded if test does not exist in the injected storeSource', (t) => {
    const start2 = Date.now()
    console.log('start2: ', start2)
    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)

    const nonExistentContentUserContentId = '0123bdefa52344'
    const nonExistentContentUserUserId = '0123bdefa5234abc4'

    const contentUsersRef = getMockRef(FIREBASE_PATHS.CONTENT_USERS)
    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef: contentUsersRef})
    const isLoaded =
        contentUserLoader.isLoaded({contentId: nonExistentContentUserContentId, userId: nonExistentContentUserUserId})
    expect(isLoaded).to.deep.equal(false)
    t.pass()
    const end2 = Date.now()
    console.log('end2: ', end2)
    console.log('duration: ', end2 - start2)
})
test('ContentUserLoader:::Should mark an id as loaded after being loaded', async (t) => {
    const start3 = Date.now()
    console.log('start3: ', start3)
    const contentId = sampleContentUser1ContentId;
    const userId = sampleContentUser1UserId;

    const firebaseRef = new MockFirebase(FIREBASE_PATHS.CONTENT_USERS);
    const childFirebaseRef = firebaseRef.child(contentId);
    const grandchildFirebaseRef = childFirebaseRef.child(userId);

    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource);
    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef});

    let isLoaded = contentUserLoader.isLoaded({contentId, userId});
    expect(isLoaded).to.equal(false);

    /*
     if I put the downloadData before the fakeEvent,
      then downloadData will get called with a firebase event value of null,
       causing thes test to get failed.
        If I call the downloadDada method after the fakeEvent,
         then downloadData will get called with the actual value that I put in fake Event */
    grandchildFirebaseRef.fakeEvent('value', undefined, sampleContentUserData1FromDB);
    contentUserLoader.downloadData({contentId, userId});
    /* But I do have to call downloadData beofer .flush,
     or else the callback for the firebase .on() method never even gets called it seems. */
    grandchildFirebaseRef.flush();

    isLoaded = contentUserLoader.isLoaded({contentId, userId});
    expect(isLoaded).to.equal(true);
    t.pass();

    const end3 = Date.now()
    console.log('end3: ', end3)
    console.log('duration: ', end3 - start3)
});
test('ContentUserLoader:::DownloadData should return the data', async (t) => {
    const start4 = Date.now()
    console.log('start4: ', start4)
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES);
    const childFirebaseRef = firebaseRef.child(sampleContentUser1ContentId);
    const grandChildFirebaseRef = childFirebaseRef.child(sampleContentUser1UserId);

    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource);
    // childFirebaseRef.flush()
    const contentUserLoader = new ContentUserLoader({ storeSource, firebaseRef});

    grandChildFirebaseRef.fakeEvent('value', undefined, sampleContentUserData1FromDB);
    const contentUserDataPromise =
        contentUserLoader.downloadData({contentId: sampleContentUser1ContentId, userId: sampleContentUser1UserId});
    grandChildFirebaseRef.flush();

    const contentUserData = await contentUserDataPromise;

    expect(contentUserData).to.deep.equal(sampleContentUserData1);
    t.pass();
    const end4 = Date.now()
    console.log('end4: ', end4)
    console.log('duration: ', end4 - start4)
});
test('ContentUserLoader:::GetData on an existing contentUser should return the contentUser', async (t) => {
    const start5 = Date.now()
    console.log('start5: ', start5)
    const contentId = sampleContentUser1ContentId;
    const userId = sampleContentUser1UserId;
    const contentUserId = getContentUserId({contentId, userId});

    const firebaseRef = new MockFirebase(FIREBASE_PATHS.CONTENT_USERS);

    const sampleContentUser: ISyncableMutableSubscribableContentUser =
        ContentUserDeserializer.deserializeFromDB(
            {id: contentUserId, contentUserDataFromDB: sampleContentUserData1FromDB}
            );
    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource);
    storeSource.set(contentUserId, sampleContentUser);

    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef});
    const contentUserData: IContentUserData = contentUserLoader.getData({contentId, userId});

    expect(contentUserData).to.deep.equal(sampleContentUserData1);
    t.pass();
    const end5 = Date.now()
    console.log('end5: ', end5)
    console.log('duration: ', end5 - start5)
});
test('ContentUserLoader:::GetData on a non existing contentUser should throw a RangeError', async (t) => {
    const start6 = Date.now()
    console.log('start6: ', start6)
    const nonExistentContentUserContentId = 'abcdefgh4141234';
    const nonExistentContentUserUserId = 'abcdefgh4141234';
    const nonExistentContentUserId =
        getContentUserId({contentId: nonExistentContentUserContentId, userId: nonExistentContentUserUserId});
    const firebaseRef: Reference = new MockFirebase(FIREBASE_PATHS.TREES);

    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource);

    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef});

    expect(() => contentUserLoader.getData(
        {contentId: nonExistentContentUserContentId, userId: nonExistentContentUserContentId}
        )).to.throw(RangeError);
    t.pass();
    const end6 = Date.now()
    console.log('end6: ', end6)
    console.log('duration: ', end6 - start6)
});
test('ContentUserLoader:::GetData with an empty param should throw RangeError', async (t) => {
    const start7 = Date.now()
    console.log('start7: ', start7)
    const contentUserLoader = myContainer.get<IContentUserLoader>(TYPES.IContentUserLoader);

    expect(() => contentUserLoader.getData(
        {contentId: '', userId: ''}
    )).to.throw(RangeError);
    t.pass();

    const end7 = Date.now()
    console.log('end7: ', end7)
    console.log('duration: ', end7 - start7)
});
