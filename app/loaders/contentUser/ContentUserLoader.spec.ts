import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as firebase from 'firebase'
import {MockFirebase} from 'firebase-mock'
import {log} from '../../../app/core/log'
import {myContainer} from '../../../inversify.config';
import {
    IFirebaseRef, IMutableSubscribableContentUser, ISubscribableStoreSource, ISubscribableContentUserStoreSource,
    IContentUserData,
    IContentUserLoader, ISyncableMutableSubscribableContentUser, IContentUserDataFromDB
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import Reference = firebase.database.Reference;
import {injectionWorks} from '../../testHelpers/testHelpers';
import {FIREBASE_PATHS} from '../paths';
import {ContentUserDeserializer} from './ContentUserDeserializer';
import {ContentUserLoader, ContentUserLoaderArgs} from './ContentUserLoader';
import {makeQuerablePromise, setToStringArray} from '../../core/newUtils';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
import {getContentUserId} from './ContentUserLoaderUtils';
// test('ContentUserLoader:::DI constructor should work', (t) => {
//     const injects = injectionWorks<ContentUserLoaderArgs, IContentUserLoader>({
//         container: myContainer,
//         argsType: TYPES.ContentUserLoaderArgs,
//         interfaceType: TYPES.IContentUserLoader,
//     })
//     expect(injects).to.equal(true)
//     t.pass()
// })
// test.beforeEach('create fresh container', t => {
//
// })
// test('ContentUserLoader:::Should set the firebaseRef and storeSource for the loader', (t) => {
//     const storeSource: ISubscribableContentUserStoreSource =
//         myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
//
//     const firebaseRef: IFirebaseRef =  new MockFirebase()
//
//     const contentUserLoader = new ContentUserLoader({ storeSource, firebaseRef})
//     expect(contentUserLoader['storeSource']).to.deep.equal(storeSource)
//     expect(contentUserLoader['firebaseRef']).to.deep.equal(firebaseRef) // TODO: why am I testing private properties
//     t.pass()
// })
// test('ContentUserLoader:::Should mark an id as loaded if test exists in the injected storeSource', (t) => {
//     const storeSource: ISubscribableContentUserStoreSource =
//         myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
//
//     const contentId = '987245'
//     const userId = '43987234'
//     const contentUserId = getContentUserId({contentId, userId})
//     const contentUser = myContainer.get<ISyncableMutableSubscribableContentUser>
//     (TYPES.ISyncableMutableSubscribableContentUser)
//     const firebaseRef: IFirebaseRef =  new MockFirebase()
//     storeSource.set(contentUserId, contentUser)
//
//     const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})
//     const isLoaded = contentUserLoader.isLoaded({contentId, userId})
//     expect(isLoaded).to.deep.equal(true)
//     t.pass()
// })
// test('ContentUserLoader:::Should mark an id as not loaded if test does not exist in the injected storeSource', (t) => {
//     const storeSource: ISubscribableContentUserStoreSource =
//         myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
//
//     const contentUserId = '1234'
//     const nonExistentContentUserContentId = '0123bdefa52344'
//     const nonExistentContentUserUserId = '0123bdefa5234abc4'
//     const contentUser = myContainer.get<IMutableSubscribableContentUser>(TYPES.IMutableSubscribableContentUser)
//     const firebaseRef: IFirebaseRef = new MockFirebase()
//
//     const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})
//     const isLoaded =
//         contentUserLoader.isLoaded({contentId: nonExistentContentUserContentId, userId: nonExistentContentUserUserId})
//     expect(isLoaded).to.deep.equal(false)
//     t.pass()
// })
test('ContentUserLoader:::Should mark an id as loaded after being loaded', async (t) => {
    const contentId = '423487'
    const userId = '12476'
    const contentUserId = getContentUserId({contentId, userId})
    const overdueVal = true
    const lastRecordedStrengthVal = 30
    const proficiencyVal = PROFICIENCIES.TWO
    const timerVal = 30

    const contentUserData: IContentUserDataFromDB = {
        id: contentUserId,
        overdue: {
           val: overdueVal,
        },
        lastRecordedStrength: {
            val: lastRecordedStrengthVal,
        },
        proficiency: {
            val: proficiencyVal,
        },
        timer: {
            val: timerVal
        },
    }

    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(contentId)
    const grandchildFirebaseRef = childFirebaseRef.child(userId)

    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})

    let isLoaded = contentUserLoader.isLoaded({contentId, userId})
    expect(isLoaded).to.equal(false)

    /*
     if I put the downloadData before the fakeEvent,
      then downloadData will get called with a firebase event value of null,
       causing thes test to get failed.
        If I call the downloadDada method after the fakeEvent,
         then downloadData will get called with the actual value that I put in fake Event */
    grandchildFirebaseRef.fakeEvent('value', undefined, contentUserData)
    contentUserLoader.downloadData({contentId, userId})
    /* But I do have to call downloadData beofer .flush,
     or else the callback for the firebase .on() method never even gets called it seems. */
    grandchildFirebaseRef.flush()

    isLoaded = contentUserLoader.isLoaded({contentId, userId})
    expect(isLoaded).to.equal(true)
    t.pass()

})
test('ContentUserLoader:::DownloadData should return the data', async (t) => {
    const contentId = '423487234'
    const userId = '12476abc'
    const contentUserId = getContentUserId({contentId, userId})
    const overdueVal = true
    const lastRecordedStrengthVal = 30
    const proficiencyVal = PROFICIENCIES.TWO
    const timerVal = 30

    const sampleContentUserDataFromDB: IContentUserDataFromDB = {
        id: contentUserId,
        overdue: {
            val: overdueVal,
        },
        lastRecordedStrength: {
            val: lastRecordedStrengthVal,
        },
        proficiency: {
            val: proficiencyVal,
        },
        timer: {
            val: timerVal
        },
    }
    const sampleContentUserData: IContentUserData = {
        id: contentUserId,
        overdue: overdueVal,
        lastRecordedStrength: lastRecordedStrengthVal,
        proficiency: proficiencyVal,
        timer: timerVal,
    }

    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(contentId)
    const grandChildFirebaseRef = childFirebaseRef.child(userId)

    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
    // childFirebaseRef.flush()
    const contentUserLoader = new ContentUserLoader({ storeSource, firebaseRef})

    grandChildFirebaseRef.fakeEvent('value', undefined, sampleContentUserDataFromDB)
    const contentUserDataPromise = contentUserLoader.downloadData({contentId, userId})
    const wrappedPromise = makeQuerablePromise(contentUserDataPromise)
    // log('wrapped Promise is Fulfilled 1', wrappedPromise.isFulfilled())
    // log('wrapped Promise is Fulfilled 2', wrappedPromise.isFulfilled())
    grandChildFirebaseRef.flush()
    // log('wrapped Promise is Fulfilled 3', wrappedPromise.isFulfilled())

    const contentUserData = await contentUserDataPromise
    // log('wrapped Promise is Fulfilled 4', wrappedPromise.isFulfilled())

    expect(contentUserData).to.deep.equal(sampleContentUserData)
    t.pass()
})
test('ContentUserLoader:::DownloadData should have the side effect' +
    ' of storing the data in the storeSource', async (t) => {
    const contentId = '423487234'
    const userId = '12476abc'
    const contentUserId = getContentUserId({contentId, userId})
    const overdueVal = true
    const lastRecordedStrengthVal = 30
    const proficiencyVal = PROFICIENCIES.TWO
    const timerVal = 30

    const sampleContentUserData: IContentUserDataFromDB = {
        id: contentUserId,
        overdue: {
            val: overdueVal,
        },
        lastRecordedStrength: {
            val: lastRecordedStrengthVal,
        },
        proficiency: {
            val: proficiencyVal,
        },
        timer: {
            val: timerVal
        },
    }

    const firebaseRef = new MockFirebase(FIREBASE_PATHS.CONTENT_USERS)
    const childFirebaseRef = firebaseRef.child(contentId)
    const grandChildFirebaseRef = childFirebaseRef.child(userId)

    const sampleContentUser: IMutableSubscribableContentUser = ContentUserDeserializer.deserializeFromDB(
        {id: contentUserId, contentUserDataFromDB: sampleContentUserData}
        )
    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})
    grandChildFirebaseRef.fakeEvent('value', undefined, sampleContentUserData)
    contentUserLoader.downloadData({contentId, userId})
    // childFirebaseRef.flush()

    expect(storeSource.get(contentUserId)).to.deep.equal(sampleContentUser)
    t.pass()
})
test('ContentUserLoader:::GetData on an existing contentUser should return the contentUser', async (t) => {

    const contentId = '423487234'
    const userId = '12476abc'
    const contentUserId = getContentUserId({contentId, userId})
    const overdueVal = true
    const lastRecordedStrengthVal = 30
    const proficiencyVal = PROFICIENCIES.TWO
    const timerVal = 30

    const firebaseRef = new MockFirebase(FIREBASE_PATHS.CONTENT_USERS)
    const childFirebaseRef = firebaseRef.child(contentId)
    const grandChildFirebaseRef = childFirebaseRef.child(userId)

    // const sampleContentUserData: IContentUserData = {
    //     id: contentUserId,
    //     overdue: overdueVal,
    //     lastRecordedStrength: lastRecordedStrengthVal,
    //     proficiency: proficiencyVal,
    //     timer: timerVal
    // }

    const sampleContentUserDataFromDB: IContentUserDataFromDB = {
        id: contentUserId,
        overdue: {
            val: overdueVal,
        },
        lastRecordedStrength: {
            val: lastRecordedStrengthVal,
        },
        proficiency: {
            val: proficiencyVal,
        },
        timer: {
            val: timerVal
        },
    }

    const sampleContentUserData: IContentUserData = {
        id: contentUserId,
        overdue: overdueVal,
        lastRecordedStrength: lastRecordedStrengthVal,
        proficiency: proficiencyVal,
        timer: timerVal,
    }

    const sampleContentUser: ISyncableMutableSubscribableContentUser =
        ContentUserDeserializer.deserializeFromDB(
            {id: contentUserId, contentUserDataFromDB: sampleContentUserDataFromDB}
            )
    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
    storeSource.set(contentUserId, sampleContentUser)

    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})
    const contentUserData: IContentUserData = contentUserLoader.getData({contentId, userId})

    expect(contentUserData).to.deep.equal(sampleContentUserData)
    t.pass()
})
test('ContentUserLoader:::GetData on a non existing contentUser should throw a RangeError', async (t) => {
    const nonExistentContentUserContentId = 'abcdefgh4141234'
    const nonExistentContentUserUserId = 'abcdefgh4141234'
    const nonExistentContentUserId =
        getContentUserId({contentId: nonExistentContentUserContentId, userId: nonExistentContentUserUserId})
    const firebaseRef: Reference = new MockFirebase(FIREBASE_PATHS.TREES)

    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)

    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})

    expect(() => contentUserLoader.getData(
        {contentId: nonExistentContentUserContentId, userId: nonExistentContentUserContentId}
        )).to.throw(RangeError)
    t.pass()
})
test('ContentUserLoader:::GetData with an empty param should throw RangeError', async (t) => {
    const contentUserLoader = myContainer.get<IContentUserLoader>(TYPES.IContentUserLoader)

    expect(() => contentUserLoader.getData(
        {contentId: '', userId: ''}
    )).to.throw(RangeError)
    t.pass()
})
