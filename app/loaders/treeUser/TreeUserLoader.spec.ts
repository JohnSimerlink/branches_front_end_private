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
    IFirebaseRef, IMutableSubscribableTreeUser, ISubscribableStoreSource, ISubscribableTreeUserStoreSource,
    ITreeUserLoader
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import Reference = firebase.database.Reference;
import {injectionWorks} from '../../testHelpers/testHelpers';
import {FIREBASE_PATHS} from '../paths';
import {TreeUserDeserializer} from './TreeUserDeserializer';
import {TreeUserLoader, TreeUserLoaderArgs} from './TreeUserLoader';
import {makeQuerablePromise, setToStringArray} from '../../core/newUtils';
test('TreeUserLoader:::DI constructor should work', (t) => {
    const injects = injectionWorks<TreeUserLoaderArgs, ITreeUserLoader>({
        container: myContainer,
        argsType: TYPES.TreeUserLoaderArgs,
        interfaceType: TYPES.ITreeUserLoader,
    })
    expect(injects).to.equal(true)
    t.pass()
})
// test.beforeEach('create fresh container', t => {
//
// })
test('TreeUserLoader:::Should set the firebaseRef and storeSource for the loader', (t) => {
    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource)

    const firebaseRef: IFirebaseRef =  new FirebaseRef()

    const treeUserLoader = new TreeUserLoader({ storeSource, firebaseRef})
    expect(treeUserLoader['storeSource']).to.deep.equal(storeSource)
    expect(treeUserLoader['firebaseRef']).to.deep.equal(firebaseRef) // TODO: why am I testing private properties
    t.pass()
})
test('TreeUserLoader:::Should mark an id as loaded if test exists in the injected storeSource', (t) => {
    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource)

    const treeUserId = '1234'
    const treeUser = myContainer.get<IMutableSubscribableTreeUser>(TYPES.IMutableSubscribableTreeUser)
    const firebaseRef: IFirebaseRef =  new FirebaseRef()
    storeSource.set(treeUserId, treeUser)

    const treeUserLoader = new TreeUserLoader({storeSource, firebaseRef})
    const isLoaded = treeUserLoader.isLoaded(treeUserId)
    expect(isLoaded).to.deep.equal(true)
    t.pass()
})
test('TreeUserLoader:::Should mark an id as not loaded if test does not exist in the injected storeSource', (t) => {
    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource)

    const treeUserId = '1234'
    const nonExistentTreeUserId = '0123bdefa52344'
    const treeUser = myContainer.get<IMutableSubscribableTreeUser>(TYPES.IMutableSubscribableTreeUser)
    const firebaseRef: IFirebaseRef = new FirebaseRef()

    const treeUserLoader = new TreeUserLoader({storeSource, firebaseRef})
    const isLoaded = treeUserLoader.isLoaded(nonExistentTreeUserId)
    expect(isLoaded).to.deep.equal(false)
    t.pass()
})
test('TreeUserLoader:::Should mark an id as loaded after being loaded', async (t) => {
    const treeUserId = 'fedbadcaddac1234'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(treeUserId)

    const sampleTreeUserData: ITreeUserDataFromFirebase = {
        contentId: '12345532',
        parentId: '493284',
        children: {
            2948: true,
            2947: true,
        }
    }

    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource)
    const treeUserLoader = new TreeUserLoader({storeSource, firebaseRef})

    treeUserLoader.downloadData(treeUserId)
    let isLoaded = treeUserLoader.isLoaded(treeUserId)
    expect(isLoaded).to.equal(false)

    childFirebaseRef.fakeEvent('value', undefined, sampleTreeUserData)
    childFirebaseRef.flush()

    isLoaded = treeUserLoader.isLoaded(treeUserId)
    expect(isLoaded).to.equal(true)
    t.pass()

})
test('TreeUserLoader:::DownloadData should return the data', async (t) => {
    const treeUserId = '1234'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(treeUserId)

    const contentId = '12345532'
    const parentId = '493284'
    const sampleTreeUserData: ITreeUserDataFromFirebase = {
        contentId,
        parentId,
        children: {
            2948: true,
            2947: true
        }
    }
    const expectedTreeUserData: ITreeUserDataWithoutId = {
        contentId,
        parentId,
        children: ['2947', '2948']
    }
    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource)
    // childFirebaseRef.flush()
    const treeUserLoader = new TreeUserLoader({ storeSource, firebaseRef})

    const treeUserDataPromise = treeUserLoader.downloadData(treeUserId)
    const wrappedPromise = makeQuerablePromise(treeUserDataPromise)
    log('wrapped Promise is Fulfilled 1', wrappedPromise.isFulfilled())

    childFirebaseRef.fakeEvent('value', undefined, sampleTreeUserData)
    log('wrapped Promise is Fulfilled 2', wrappedPromise.isFulfilled())
    childFirebaseRef.flush()
    log('wrapped Promise is Fulfilled 3', wrappedPromise.isFulfilled())

    const treeUserData = await treeUserDataPromise
    log('wrapped Promise is Fulfilled 4', wrappedPromise.isFulfilled())

    expect(treeUserData).to.deep.equal(expectedTreeUserData)
    t.pass()
})
test('TreeUserLoader:::DownloadData should have the side effect of storing the data in the storeSource', async (t) => {
    const treeUserId = '1234'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(treeUserId)

    const sampleTreeUserData: ITreeUserDataFromFirebase = {
        contentId: '12345532',
        parentId: '493284',
        children: {
            2948: true,
            2947: true,
        }
    }
    const sampleTreeUser: IMutableSubscribableTreeUser = TreeUserDeserializer.deserialize({treeUserId, treeUserData: sampleTreeUserData})
    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource)
    const treeUserLoader = new TreeUserLoader({storeSource, firebaseRef})
    childFirebaseRef.fakeEvent('value', undefined, sampleTreeUserData)
    treeUserLoader.downloadData(treeUserId)
    // childFirebaseRef.flush()

    expect(storeSource.get(treeUserId)).to.deep.equal(sampleTreeUser)
    t.pass()
})
test('TreeUserLoader:::GetData on an existing treeUser should return the treeUser', async (t) => {
    const treeUserId = '1234'
    const firebaseRef: Reference = new MockFirebase().child(treeUserId)

    const contentId = '12345532'
    const parentId = '493284'
    const sampleTreeUserData: ITreeUserDataFromFirebase = {
        contentId,
        parentId,
        children: {
            2948: true,
            2947: true,
        }
    }
    const childrenArray = setToStringArray(sampleTreeUserData.children)
    const expectedTreeUserData: ITreeUserDataWithoutId = {
        contentId,
        parentId,
        children: childrenArray,
    }
    const sampleTreeUser: IMutableSubscribableTreeUser = TreeUserDeserializer.deserialize({treeUserId, treeUserData: sampleTreeUserData})
    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource)
    storeSource.set(treeUserId, sampleTreeUser)

    const treeUserLoader = new TreeUserLoader({storeSource, firebaseRef})
    const treeUserData = treeUserLoader.getData(treeUserId)

    expect(treeUserData).to.deep.equal(expectedTreeUserData)
    t.pass()
})
test('TreeUserLoader:::GetData on a non existing treeUser should throw a RangeError', async (t) => {
    const treeUserId = 'abcdefgh4141234'
    const firebaseRef: Reference = new MockFirebase(FIREBASE_PATHS.TREES)

    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource)

    const treeUserLoader = new TreeUserLoader({storeSource, firebaseRef})

    expect(() => treeUserLoader.getData(treeUserId)).to.throw(RangeError)
    t.pass()
})
