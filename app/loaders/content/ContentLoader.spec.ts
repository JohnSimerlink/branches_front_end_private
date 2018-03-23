const start = Date.now()
console.log('check.3', Date.now() - start)
console.log('check.4', Date.now() - start)
console.log('check.5', Date.now() - start)
import test from 'ava';
console.log('check.505', Date.now() - start)
import {expect} from 'chai';
console.log('check.51', Date.now() - start)
import {log} from '../../../app/core/log';
console.log('check.52', Date.now() - start)
import {getMockRef, myContainer, myContainerLoadAllModules} from '../../../inversify.config';
console.log('check.6', Date.now() - start)
import {
    CONTENT_TYPES,
    IContentData,
    IContentDataFromDB,
    IContentLoader,
    ISubscribableContentStoreSource,
    ISyncableMutableSubscribableContent
} from '../../objects/interfaces';
console.log('check.6.1', Date.now() - start)
import {TYPES} from '../../objects/types';
console.log('check.7', Date.now() - start)
import {injectionWorks} from '../../testHelpers/testHelpers';
console.log('check.8', Date.now() - start)
import {FIREBASE_PATHS} from '../paths';
console.log('check.9', Date.now() - start)
import {ContentDeserializer} from './ContentDeserializer';
console.log('check.905', Date.now() - start)
import {ContentLoader, ContentLoaderArgs} from './ContentLoader';
console.log('check.91', Date.now() - start)
import * as sinon from 'sinon';
console.log('check.92', Date.now() - start)

console.log('check1', Date.now() - start)
myContainerLoadAllModules({fakeSigma: true});
test('ContentLoader:::DI constructor should work', (t) => {
    console.log('check1.1', Date.now() - start)
    const injects = injectionWorks<ContentLoaderArgs, IContentLoader>({
        container: myContainer,
        argsType: TYPES.ContentLoaderArgs,
        interfaceType: TYPES.IContentLoader,
    });
    expect(injects).to.equal(true);
    t.pass();
    console.log('check2', Date.now() - start)
});
// test.beforeEach('create fresh container', t => {
//
// })
test('ContentLoader:::Should mark an id as loaded if test exists in the injected storeSource', (t) => {
    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource);

    const contentId = '1234';
    const content = myContainer.get<ISyncableMutableSubscribableContent>(TYPES.ISyncableMutableSubscribableContent);
    const firebaseRef = getMockRef(FIREBASE_PATHS.CONTENT);
    storeSource.set(contentId, content);

    const contentLoader = new ContentLoader({storeSource, firebaseRef});
    const isLoaded = contentLoader.isLoaded(contentId);
    expect(isLoaded).to.deep.equal(true);
    t.pass();
    console.log('check3', Date.now() - start)
});
test('ContentLoader:::Should mark an id as not loaded if test does not exist in the injected storeSource', (t) => {
    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource);

    const nonExistentContentId = '0123bdefa52344';

    const firebaseRef = getMockRef(FIREBASE_PATHS.CONTENT);
    const contentLoader = new ContentLoader({storeSource, firebaseRef});
    const isLoaded = contentLoader.isLoaded(nonExistentContentId);
    expect(isLoaded).to.deep.equal(false);
    console.log('check4', Date.now() - start)
    t.pass();
});
test('ContentLoader:::Should mark an id as loaded after being loaded', async (t) => {
    const contentId = 'fedbadcaddac1234';
    const firebaseRef = getMockRef(FIREBASE_PATHS.CONTENT);
    const childFirebaseRef = firebaseRef.child(contentId);

    const typeVal = CONTENT_TYPES.FLASHCARD;
    const questionVal = 'What is the Capital of Ohio?';
    const answerVal = 'Columbus';
    const sampleContentData: IContentData = {
        type: typeVal,
        question: questionVal,
        answer: answerVal,
    };
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
    };

    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource);
    const contentLoader = new ContentLoader({storeSource, firebaseRef});

    let isLoaded = contentLoader.isLoaded(contentId);
    expect(isLoaded).to.equal(false);

    childFirebaseRef.fakeEvent('value', undefined, sampleContentDataFromDB);
    const contentLoaderPromise = contentLoader.downloadData(contentId);
    childFirebaseRef.flush();

    await contentLoaderPromise;
    isLoaded = contentLoader.isLoaded(contentId);
    expect(isLoaded).to.equal(true);
    console.log('check5', Date.now() - start)
    t.pass();

});
test('ContentLoader:::DownloadData should return the data', async (t) => {
    const contentId = '12345'; /* cannot have the same contentId as others in the same file
     because the tests run in parallet and will trigger firebase events for other tests . . .if the ids are the same */

    const firebaseRef = getMockRef(FIREBASE_PATHS.CONTENT);
    const childFirebaseRef = firebaseRef.child(contentId);

    const typeVal = CONTENT_TYPES.FLASHCARD;
    const questionVal = 'What is the Capital of Ohio?';
    const answerVal = 'Columbus';
    const sampleContentData: IContentData = {
        type: typeVal,
        question: questionVal,
        answer: answerVal,
    };
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
    };
    const expectedContentData: IContentData = sampleContentData;
    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource);
    // childFirebaseRef.flush()
    const contentLoader = new ContentLoader({storeSource, firebaseRef});

    // log('wrapped Promise is Fulfilled 1', wrappedPromise.isFulfilled())

    childFirebaseRef.fakeEvent('value', undefined, sampleContentDataFromDB);
    const contentDataPromise = contentLoader.downloadData(contentId);
    childFirebaseRef.flush();

    const contentData = await contentDataPromise;

    expect(contentData.type).to.deep.equal(expectedContentData.type);
    expect(contentData.question).to.deep.equal(expectedContentData.question);
    expect(contentData.answer).to.deep.equal(expectedContentData.answer);
    console.log('check6', Date.now() - start)
    t.pass();
});
test('ContentLoader:::DownloadData should have the side effect of storing the data in the storeSource', async (t) => {
    const contentId = '123456da';
    const firebaseRef = getMockRef(FIREBASE_PATHS.CONTENT);
    const childFirebaseRef = firebaseRef.child(contentId);

    const typeVal = CONTENT_TYPES.FLASHCARD;
    const questionVal = 'What is the Capital of Ohio?';
    const answerVal = 'Columbus';
    const sampleContentData: IContentData = {
        type: typeVal,
        question: questionVal,
        answer: answerVal,
    };
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
    };
    const sampleContent: ISyncableMutableSubscribableContent =
        ContentDeserializer.deserialize({contentId, contentData: sampleContentData});
    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource);
    const contentLoader = new ContentLoader({storeSource, firebaseRef});
    childFirebaseRef.fakeEvent('value', undefined, sampleContentDataFromDB);
    const contentLoadPromise = contentLoader.downloadData(contentId);
    childFirebaseRef.flush();

    await contentLoadPromise;
    expect(storeSource.get(contentId)).to.deep.equal(sampleContent);

    console.log('check7', Date.now() - start)
    t.pass();
});
test('ContentLoader:::DownloadData twice in a row on the same contentId' +
    ' should fetch the contentId from the storeSource', async (t) => {
    const contentId = '123456bed';
    const firebaseRef = getMockRef(FIREBASE_PATHS.CONTENT);
    const childFirebaseRef = firebaseRef.child(contentId);

    const typeVal = CONTENT_TYPES.FLASHCARD;
    const questionVal = 'What is the Capital of Ohio?';
    const answerVal = 'Columbus';
    const sampleContentData: IContentData = {
        type: typeVal,
        question: questionVal,
        answer: answerVal,
    };
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
    };
    const sampleContent: ISyncableMutableSubscribableContent =
        ContentDeserializer.deserialize({contentId, contentData: sampleContentData});
    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource);
    const contentLoader = new ContentLoader({storeSource, firebaseRef});
    childFirebaseRef.fakeEvent('value', undefined, sampleContentDataFromDB);
    const contentLoaderGetDataSpy = sinon.spy(contentLoader, 'getData');
    let contentLoadPromise = contentLoader.downloadData(contentId);
    childFirebaseRef.flush();
    await contentLoadPromise;
    const contentLoaderGetDataSpyCount = contentLoaderGetDataSpy.callCount;
    contentLoadPromise = contentLoader.downloadData(contentId);
    await contentLoadPromise;
    expect(contentLoaderGetDataSpy.callCount).to.equal(contentLoaderGetDataSpyCount + 1);

    expect(storeSource.get(contentId)).to.deep.equal(sampleContent);

    console.log('check8', Date.now() - start)
    t.pass();
});
test('ContentLoader:::GetData on an existing content should return the content', async (t) => {
    const contentId = '1234';
    const firebaseRef = getMockRef(FIREBASE_PATHS.CONTENT);
    const childFirebaseRef = firebaseRef.child(contentId);

    const typeVal = CONTENT_TYPES.FLASHCARD;
    const questionVal = 'What is the Capital of Ohio?';
    const answerVal = 'Columbus';
    const sampleContentData: IContentData = {
        type: typeVal,
        question: questionVal,
        answer: answerVal,
        title: null,
    };
    const expectedContentData = sampleContentData;
    const sampleContent: ISyncableMutableSubscribableContent =
        ContentDeserializer.deserialize({contentId, contentData: sampleContentData});
    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource);
    storeSource.set(contentId, sampleContent);

    const contentLoader = new ContentLoader({storeSource, firebaseRef});
    const contentData = contentLoader.getData(contentId);

    expect(contentData).to.deep.equal(expectedContentData);
    console.log('check9', Date.now() - start)
    t.pass();
});
test('ContentLoader:::GetData on a non existing content should throw a RangeError', async (t) => {
    const contentId = 'abcdefgh4141234';

    const firebaseRef = getMockRef(FIREBASE_PATHS.CONTENT);

    const storeSource: ISubscribableContentStoreSource =
        myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource);

    const contentLoader = new ContentLoader({storeSource, firebaseRef});

    expect(() => contentLoader.getData(contentId)).to.throw(RangeError);
    console.log('check10', Date.now() - start)
    t.pass();
});
