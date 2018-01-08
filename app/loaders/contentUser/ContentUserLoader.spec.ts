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
import {ContentUserLoader, ContentUserLoaderArgs} from './ContentUserLoader';
import {makeQuerablePromise, setToStringArray} from '../../core/newUtils';
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

    const contentUserId = '1234'
    const contentUser = myContainer.get<IMutableSubscribableContentUser>(TYPES.IMutableSubscribableContentUser)
    const firebaseRef: IFirebaseRef =  new FirebaseRef()
    storeSource.set(contentUserId, contentUser)

    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})
    const isLoaded = contentUserLoader.isLoaded(contentUserId)
    expect(isLoaded).to.deep.equal(true)
    t.pass()
})
test('ContentUserLoader:::Should mark an id as not loaded if test does not exist in the injected storeSource', (t) => {
    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)

    const contentUserId = '1234'
    const nonExistentContentUserId = '0123bdefa52344'
    const contentUser = myContainer.get<IMutableSubscribableContentUser>(TYPES.IMutableSubscribableContentUser)
    const firebaseRef: IFirebaseRef = new FirebaseRef()

    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})
    const isLoaded = contentUserLoader.isLoaded(nonExistentContentUserId)
    expect(isLoaded).to.deep.equal(false)
    t.pass()
})
test('ContentUserLoader:::Should mark an id as loaded after being loaded', async (t) => {
    const contentUserId = 'fedbadcaddac1234'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(contentUserId)

    const sampleContentUserData: IContentUserData = {
        contentId: '12345532',
        parentId: '493284',
        children: {
            2948: true,
            2947: true,
        }
    }

    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})

    contentUserLoader.downloadData(contentUserId)
    let isLoaded = contentUserLoader.isLoaded(contentUserId)
    expect(isLoaded).to.equal(false)

    childFirebaseRef.fakeEvent('value', undefined, sampleContentUserData)
    childFirebaseRef.flush()

    isLoaded = contentUserLoader.isLoaded(contentUserId)
    expect(isLoaded).to.equal(true)
    t.pass()

})
test('ContentUserLoader:::DownloadData should return the data', async (t) => {
    const contentUserId = '1234'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(contentUserId)

    const contentId = '12345532'
    const parentId = '493284'
    const sampleContentUserData: IContentUserData = {
        contentId,
        parentId,
        children: {
            2948: true,
            2947: true
        }
    }
    const expectedContentUserData: IContentUserData = {
        contentId,
        parentId,
        children: ['2947', '2948']
    }
    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
    // childFirebaseRef.flush()
    const contentUserLoader = new ContentUserLoader({ storeSource, firebaseRef})

    const contentUserDataPromise = contentUserLoader.downloadData(contentUserId)
    const wrappedPromise = makeQuerablePromise(contentUserDataPromise)
    log('wrapped Promise is Fulfilled 1', wrappedPromise.isFulfilled())

    childFirebaseRef.fakeEvent('value', undefined, sampleContentUserData)
    log('wrapped Promise is Fulfilled 2', wrappedPromise.isFulfilled())
    childFirebaseRef.flush()
    log('wrapped Promise is Fulfilled 3', wrappedPromise.isFulfilled())

    const contentUserData = await contentUserDataPromise
    log('wrapped Promise is Fulfilled 4', wrappedPromise.isFulfilled())

    expect(contentUserData).to.deep.equal(expectedContentUserData)
    t.pass()
})
test('ContentUserLoader:::DownloadData should have the side effect of storing the data in the storeSource', async (t) => {
    const contentUserId = '1234'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(contentUserId)

    const sampleContentUserData: IContentUserData = {
        contentId: '12345532',
        parentId: '493284',
        children: {
            2948: true,
            2947: true,
        }
    }
    const sampleContentUser: IMutableSubscribableContentUser = ContentUserDeserializer.deserialize({contentUserId, contentUserData: sampleContentUserData})
    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})
    childFirebaseRef.fakeEvent('value', undefined, sampleContentUserData)
    contentUserLoader.downloadData(contentUserId)
    // childFirebaseRef.flush()

    expect(storeSource.get(contentUserId)).to.deep.equal(sampleContentUser)
    t.pass()
})
test('ContentUserLoader:::GetData on an existing contentUser should return the contentUser', async (t) => {
    const contentUserId = '1234'
    const firebaseRef: Reference = new MockFirebase().child(contentUserId)

    const contentId = '12345532'
    const parentId = '493284'
    const sampleContentUserData: IContentUserData = {
        contentId,
        parentId,
        children: {
            2948: true,
            2947: true,
        }
    }
    const childrenArray = setToStringArray(sampleContentUserData.children)
    const expectedContentUserData: IContentUserData = {
        contentId,
        parentId,
        children: childrenArray,
    }
    const sampleContentUser: IMutableSubscribableContentUser = ContentUserDeserializer.deserialize({contentUserId, contentUserData: sampleContentUserData})
    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
    storeSource.set(contentUserId, sampleContentUser)

    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})
    const contentUserData = contentUserLoader.getData(contentUserId)

    expect(contentUserData).to.deep.equal(expectedContentUserData)
    t.pass()
})
test('ContentUserLoader:::GetData on a non existing contentUser should throw a RangeError', async (t) => {
    const contentUserId = 'abcdefgh4141234'
    const firebaseRef: Reference = new MockFirebase(FIREBASE_PATHS.TREES)

    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)

    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef})

    expect(() => contentUserLoader.getData(contentUserId)).to.throw(RangeError)
    t.pass()
})
