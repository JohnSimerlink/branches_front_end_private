import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as firebase from 'firebase'
import {MockFirebase} from 'firebase-mock'
import {log} from '../../../app/core/log'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {
    IMutableSubscribableContent, ISubscribableContentStoreSource,
    IContentData,
    IContentLoader, CONTENT_TYPES, ISyncableMutableSubscribableContent, IContentDataFromDB
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import Reference = firebase.database.Reference;
import {injectionWorks} from '../../testHelpers/testHelpers';
import {FIREBASE_PATHS} from '../paths';
import {ContentDeserializer} from './ContentDeserializer';
import {ContentLoader, ContentLoaderArgs} from './ContentLoader';
import {makeQuerablePromise, setToStringArray} from '../../core/newUtils';
import * as sinon from 'sinon'
myContainerLoadAllModules({fakeSigma: true})
test('ContentLoader:::DI constructor should work', (t) => {
    const injects = injectionWorks<ContentLoaderArgs, IContentLoader>({
        container: myContainer,
        argsType: TYPES.ContentLoaderArgs,
        interfaceType: TYPES.IContentLoader,
    })
    expect(injects).to.equal(true)
    t.pass()
})
// test.beforeEach('create fresh container', t => {
//
// })
test('ContentLoader:::Should set the treeLocationsFirebaseRef and storeSource for the loader', (t) => {
    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource)

    const firebaseRef: Reference =  new MockFirebase()

    const contentLoader = new ContentLoader({ storeSource, firebaseRef})
    expect(contentLoader['storeSource']).to.deep.equal(storeSource)
    expect(contentLoader['firebaseRef']).to.deep.equal(firebaseRef) // TODO: why am I testing private properties
    t.pass()
})
test('ContentLoader:::Should mark an id as loaded if test exists in the injected storeSource', (t) => {
    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource)

    const contentId = '1234'
    const content = myContainer.get<ISyncableMutableSubscribableContent>(TYPES.ISyncableMutableSubscribableContent)
    const firebaseRef: Reference =  new MockFirebase()
    storeSource.set(contentId, content)

    const contentLoader = new ContentLoader({storeSource, firebaseRef})
    const isLoaded = contentLoader.isLoaded(contentId)
    expect(isLoaded).to.deep.equal(true)
    t.pass()
})
test('ContentLoader:::Should mark an id as not loaded if test does not exist in the injected storeSource', (t) => {
    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource)

    const nonExistentContentId = '0123bdefa52344'
    const firebaseRef: Reference = new MockFirebase()

    const contentLoader = new ContentLoader({storeSource, firebaseRef})
    const isLoaded = contentLoader.isLoaded(nonExistentContentId)
    expect(isLoaded).to.deep.equal(false)
    t.pass()
})
test('ContentLoader:::Should mark an id as loaded after being loaded', async (t) => {
    const contentId = 'fedbadcaddac1234'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.CONTENT)
    const childFirebaseRef = firebaseRef.child(contentId)

    const typeVal = CONTENT_TYPES.FACT
    const questionVal = 'What is the Capital of Ohio?'
    const answerVal = 'Columbus'
    const sampleContentData: IContentData = {
        type: typeVal,
        question: questionVal,
        answer: answerVal,
    }
    const sampleContentDataFromDB: IContentDataFromDB = {
        type: {
            val: typeVal,
        },
        question: {
            val: questionVal,
        },
        answer: {
            val: answerVal
        },
    }

    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource)
    const contentLoader = new ContentLoader({storeSource, firebaseRef})

    let isLoaded = contentLoader.isLoaded(contentId)
    expect(isLoaded).to.equal(false)

    childFirebaseRef.fakeEvent('value', undefined, sampleContentDataFromDB)
    const contentLoaderPromise = contentLoader.downloadData(contentId)
    childFirebaseRef.flush()

    await contentLoaderPromise
    isLoaded = contentLoader.isLoaded(contentId)
    expect(isLoaded).to.equal(true)
    t.pass()

})
test('ContentLoader:::DownloadData should return the data', async (t) => {
    const contentId = '12345' /* cannot have the same contentId as others in the same file
     because the tests run in parallet and will trigger firebase events for other tests . . .if the ids are the same */
    const firebaseRef  = new MockFirebase(FIREBASE_PATHS.CONTENT)
    const childFirebaseRef = firebaseRef.child(contentId)

    const typeVal = CONTENT_TYPES.FACT
    const questionVal = 'What is the Capital of Ohio?'
    const answerVal = 'Columbus'
    const sampleContentData: IContentData = {
        type: typeVal,
        question: questionVal,
        answer: answerVal,
    }
    const sampleContentDataFromDB: IContentDataFromDB = {
        type: {
            val: typeVal,
        },
        question: {
            val: questionVal,
        },
        answer: {
            val: answerVal
        },
    }
    const expectedContentData: IContentData = sampleContentData
    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource)
    // childFirebaseRef.flush()
    const contentLoader = new ContentLoader({storeSource, firebaseRef})

    // log('wrapped Promise is Fulfilled 1', wrappedPromise.isFulfilled())

    childFirebaseRef.fakeEvent('value', undefined, sampleContentDataFromDB)
    const contentDataPromise = contentLoader.downloadData(contentId)
    const wrappedPromise = makeQuerablePromise(contentDataPromise)
    // log('wrapped Promise is Fulfilled 2', wrappedPromise.isFulfilled())
    childFirebaseRef.flush()
    // log('wrapped Promise is Fulfilled 3', wrappedPromise.isFulfilled())

    const contentData = await contentDataPromise
    // log('wrapped Promise is Fulfilled 4', wrappedPromise.isFulfilled())

    expect(contentData.type).to.deep.equal(expectedContentData.type)
    expect(contentData.question).to.deep.equal(expectedContentData.question)
    expect(contentData.answer).to.deep.equal(expectedContentData.answer)
    t.pass()
})
test('ContentLoader:::DownloadData should have the side effect of storing the data in the storeSource', async (t) => {
    const contentId = '123456da'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.CONTENT)
    const childFirebaseRef = firebaseRef.child(contentId)

    const typeVal = CONTENT_TYPES.FACT
    const questionVal = 'What is the Capital of Ohio?'
    const answerVal = 'Columbus'
    const sampleContentData: IContentData = {
        type: typeVal,
        question: questionVal,
        answer: answerVal,
    }
    const sampleContentDataFromDB: IContentDataFromDB = {
        type: {
            val: typeVal,
        },
        question: {
            val: questionVal,
        },
        answer: {
            val: answerVal
        },
    }
    const sampleContent: ISyncableMutableSubscribableContent =
        ContentDeserializer.deserialize({contentId, contentData: sampleContentData})
    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource)
    const contentLoader = new ContentLoader({storeSource, firebaseRef})
    childFirebaseRef.fakeEvent('value', undefined, sampleContentDataFromDB)
    const contentLoadPromise = contentLoader.downloadData(contentId)
    childFirebaseRef.flush()

    await contentLoadPromise
    expect(storeSource.get(contentId)).to.deep.equal(sampleContent)
    t.pass()
})
test('ContentLoader:::DownloadData twice in a row on the same contentId' +
    ' should fetch the contentId from the storeSource', async (t) => {
    const contentId = '123456bed'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.CONTENT)
    const childFirebaseRef = firebaseRef.child(contentId)

    const typeVal = CONTENT_TYPES.FACT
    const questionVal = 'What is the Capital of Ohio?'
    const answerVal = 'Columbus'
    const sampleContentData: IContentData = {
        type: typeVal,
        question: questionVal,
        answer: answerVal,
    }
    const sampleContentDataFromDB: IContentDataFromDB = {
        type: {
            val: typeVal,
        },
        question: {
            val: questionVal,
        },
        answer: {
            val: answerVal
        },
    }
    const sampleContent: ISyncableMutableSubscribableContent =
        ContentDeserializer.deserialize({contentId, contentData: sampleContentData})
    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource)
    const contentLoader = new ContentLoader({storeSource, firebaseRef})
    childFirebaseRef.fakeEvent('value', undefined, sampleContentDataFromDB)
    const contentLoaderGetDataSpy = sinon.spy(contentLoader, 'getData')
    let contentLoadPromise = contentLoader.downloadData(contentId)
    childFirebaseRef.flush()
    await contentLoadPromise
    const contentLoaderGetDataSpyCount = contentLoaderGetDataSpy.callCount
    contentLoadPromise = contentLoader.downloadData(contentId)
    await contentLoadPromise
    expect(contentLoaderGetDataSpy.callCount).to.equal(contentLoaderGetDataSpyCount + 1)

    expect(storeSource.get(contentId)).to.deep.equal(sampleContent)
    t.pass()
})
test('ContentLoader:::GetData on an existing content should return the content', async (t) => {
    const contentId = '1234'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.CONTENT)
    const childFirebaseRef: Reference = new MockFirebase().child(contentId)

    const typeVal = CONTENT_TYPES.FACT
    const questionVal = 'What is the Capital of Ohio?'
    const answerVal = 'Columbus'
    const sampleContentData: IContentData = {
        type: typeVal,
        question: questionVal,
        answer: answerVal,
        title: null,
    }
    const expectedContentData = sampleContentData
    const sampleContent: ISyncableMutableSubscribableContent =
        ContentDeserializer.deserialize({contentId, contentData: sampleContentData})
    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource)
    storeSource.set(contentId, sampleContent)

    const contentLoader = new ContentLoader({storeSource, firebaseRef})
    const contentData = contentLoader.getData(contentId)

    expect(contentData).to.deep.equal(expectedContentData)
    t.pass()
})
test('ContentLoader:::GetData on a non existing content should throw a RangeError', async (t) => {
    const contentId = 'abcdefgh4141234'
    const firebaseRef: Reference = new MockFirebase(FIREBASE_PATHS.CONTENT)

    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource)

    const contentLoader = new ContentLoader({storeSource, firebaseRef})

    expect(() => contentLoader.getData(contentId)).to.throw(RangeError)
    t.pass()
})
