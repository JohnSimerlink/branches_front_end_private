import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as firebase from 'firebase'
import {MockFirebase} from 'firebase-mock'
import {log} from '../../../app/core/log'
import {myContainer} from '../../../inversify.config';
import {FirebaseRef} from '../../objects/dbSync/FirebaseRef';
import {
    IFirebaseRef, IMutableSubscribableContentUser, ISubscribableStoreSource, ISubscribableContentUserStoreSource,
    IContentUserData,
    IContentUserLoader
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import Reference = firebase.database.Reference;
import {injectionWorks} from '../../testHelpers/testHelpers';
import {FIREBASE_PATHS} from '../paths';
import {ContentUserDeserializer} from './ContentUserDeserializer';
import {ContentUserLoader, ContentUserLoaderArgs, getContentUserId} from './ContentUserLoader';
import {makeQuerablePromise, setToStringArray} from '../../core/newUtils';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
test('ContentUserLoader:::DI constructor should work', (t) => {
    const injects = injectionWorks<ContentUserLoaderArgs, IContentUserLoader>({
        container: myContainer,
        argsType: TYPES.ContentUserLoaderArgs,
        interfaceType: TYPES.IContentUserLoader,
    })
    expect(injects).to.equal(true)
    t.pass()
})
// test.beforeEach('create fresh container', t => {
//
// })
test('ContentUserLoader:::Should set the firebaseRef and storeSource for the loader', (t) => {
    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)

    const firebaseRef: IFirebaseRef =  new FirebaseRef()

    const contentUserLoader = new ContentUserLoader({ storeSource, firebaseRef})
    expect(contentUserLoader['storeSource']).to.deep.equal(storeSource)
    expect(contentUserLoader['firebaseRef']).to.deep.equal(firebaseRef) // TODO: why am I testing private properties
    t.pass()
})
test('ContentUserLoader:::Should mark an id as loaded if test exists in the injected storeSource', (t) => {
    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)

    const contentId = '987245'
    const userId = '43987234'
    const contentUserId = getContentUserId({contentId, userId})
    const contentUser = myContainer.get<IMutableSubscribableContentUser>(TYPES.IMutableSubscribableContentUser)
    const firebaseRef: IFirebaseRef =  new FirebaseRef()
    storeSource.set(contentUserId, contentUser)

    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})
    const isLoaded = contentUserLoader.isLoaded({contentId, userId})
    expect(isLoaded).to.deep.equal(true)
    t.pass()
})
test('ContentUserLoader:::Should mark an id as not loaded if test does not exist in the injected storeSource', (t) => {
    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)

    const contentUserId = '1234'
    const nonExistentContentUserContentId = '0123bdefa52344'
    const nonExistentContentUserUserId = '0123bdefa5234abc4'
    const contentUser = myContainer.get<IMutableSubscribableContentUser>(TYPES.IMutableSubscribableContentUser)
    const firebaseRef: IFirebaseRef = new FirebaseRef()

    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})
    const isLoaded =
        contentUserLoader.isLoaded({contentId: nonExistentContentUserContentId, userId: nonExistentContentUserUserId})
    expect(isLoaded).to.deep.equal(false)
    t.pass()
})
test('ContentUserLoader:::Should mark an id as loaded after being loaded', async (t) => {
    const contentId = '423487'
    const userId = '12476'
    const contentUserId = getContentUserId({contentId, userId})
    const overdueVal = true
    const lastRecordedStrengthVal = 30
    const proficiencyVal = PROFICIENCIES.TWO
    const timerVal = 30

    const contentUserData: IContentUserData = {
        id: contentUserId,
        overdue: overdueVal,
        lastRecordedStrength: lastRecordedStrengthVal,
        proficiency: proficiencyVal,
        timer: timerVal
    }

    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(contentId)
    const grandchildFirebaseRef = childFirebaseRef.child(userId)

    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})

    contentUserLoader.downloadData({contentId, userId})
    let isLoaded = contentUserLoader.isLoaded({contentId, userId})
    expect(isLoaded).to.equal(false)

    grandchildFirebaseRef.fakeEvent('value', undefined, contentUserData)
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

    const sampleContentUserData: IContentUserData = {
        id: contentUserId,
        overdue: overdueVal,
        lastRecordedStrength: lastRecordedStrengthVal,
        proficiency: proficiencyVal,
        timer: timerVal
    }

    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(contentId)
    const grandChildFirebaseRef = childFirebaseRef.child(userId)

    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
    // childFirebaseRef.flush()
    const contentUserLoader = new ContentUserLoader({ storeSource, firebaseRef})

    const contentUserDataPromise = contentUserLoader.downloadData({contentId, userId})
    const wrappedPromise = makeQuerablePromise(contentUserDataPromise)
    log('wrapped Promise is Fulfilled 1', wrappedPromise.isFulfilled())

    grandChildFirebaseRef.fakeEvent('value', undefined, sampleContentUserData)
    log('wrapped Promise is Fulfilled 2', wrappedPromise.isFulfilled())
    grandChildFirebaseRef.flush()
    log('wrapped Promise is Fulfilled 3', wrappedPromise.isFulfilled())

    const contentUserData = await contentUserDataPromise
    log('wrapped Promise is Fulfilled 4', wrappedPromise.isFulfilled())

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

    const sampleContentUserData: IContentUserData = {
        id: contentUserId,
        overdue: overdueVal,
        lastRecordedStrength: lastRecordedStrengthVal,
        proficiency: proficiencyVal,
        timer: timerVal
    }

    const firebaseRef = new MockFirebase(FIREBASE_PATHS.CONTENT_USERS)
    const childFirebaseRef = firebaseRef.child(contentId)
    const grandChildFirebaseRef = childFirebaseRef.child(userId)

    const sampleContentUser: IMutableSubscribableContentUser = ContentUserDeserializer.deserialize(
        {id: contentUserId, contentUserData: sampleContentUserData}
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

    const sampleContentUserData: IContentUserData = {
        id: contentUserId,
        overdue: overdueVal,
        lastRecordedStrength: lastRecordedStrengthVal,
        proficiency: proficiencyVal,
        timer: timerVal
    }
    const sampleContentUser: IMutableSubscribableContentUser =
        ContentUserDeserializer.deserialize({id: contentUserId, contentUserData: sampleContentUserData})
    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
    storeSource.set(contentUserId, sampleContentUser)

    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})
    const contentUserData = contentUserLoader.getData({contentId, userId})

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
