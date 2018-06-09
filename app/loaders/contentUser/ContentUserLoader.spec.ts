const fileStart = Date.now()
// injectFakeDom();

import test from 'ava';
import {expect} from 'chai';
import * as firebase from 'firebase';
import {MockFirebase} from 'firebase-mock';
import {log} from '../../../app/core/log';
import {getMockRef, myContainer, myContainerLoadAllModules, myContainerLoadLoaders} from '../../../inversify.config';
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

myContainerLoadLoaders();
test('ContentUserLoader:::DI constructor should work', (t) => {
	const injects = injectionWorks<ContentUserLoaderArgs, IContentUserLoader>({
		container: myContainer,
		argsType: TYPES.ContentUserLoaderArgs,
		interfaceType: TYPES.IContentUserLoader,
	})
	expect(injects).to.equal(true)
	t.pass()
})
test('ContentUserLoader:::Should mark an id as not loaded if test does not exist in the injected storeSource', (t) => {
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
})
test('ContentUserLoader:::Should mark an id as loaded after being loaded', async (t) => {
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
});
test('ContentUserLoader:::DownloadData should return the data', async (t) => {
	const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES);
	const childFirebaseRef = firebaseRef.child(sampleContentUser1ContentId);
	const grandChildFirebaseRef = childFirebaseRef.child(sampleContentUser1UserId);

	const storeSource: ISubscribableContentUserStoreSource =
		myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource);
	// childFirebaseRef.flush()
	const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef});

	grandChildFirebaseRef.fakeEvent('value', undefined, sampleContentUserData1FromDB);
	const contentUserDataPromise =
		contentUserLoader.downloadData({contentId: sampleContentUser1ContentId, userId: sampleContentUser1UserId});
	grandChildFirebaseRef.flush();

	const contentUserData = await contentUserDataPromise;

	expect(contentUserData).to.deep.equal(sampleContentUserData1);
	t.pass();
});
test('ContentUserLoader:::GetData on an existing contentUser should return the contentUser', async (t) => {
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
});
test('ContentUserLoader:::GetData on a non existing contentUser should throw a RangeError', async (t) => {
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
});
test('ContentUserLoader:::GetData with an empty param should throw RangeError', async (t) => {
	const contentUserLoader = myContainer.get<IContentUserLoader>(TYPES.IContentUserLoader);

	expect(() => contentUserLoader.getData(
		{contentId: '', userId: ''}
	)).to.throw(RangeError);
	t.pass();
});
