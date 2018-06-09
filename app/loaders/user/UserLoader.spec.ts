import test from 'ava';
import {expect} from 'chai';
import {MockFirebase} from 'firebase-mock';
import {log} from '../../../app/core/log';
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {ISyncableMutableSubscribableUser, IUserDataFromDB, IUserLoader} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {FIREBASE_PATHS} from '../paths';
import {UserLoader, UserLoaderArgs} from './UserLoader';
import {sampleUserData1, sampleUserDataFromDB1} from '../../objects/user/UserTestHelpers';

test('UserLoader:::DownloadUser should return the user', async (t) => {
	const userId = '12345';
	/* cannot have the same userId as others in the same file
			because the tests run in parallet and will trigger firebase events for other tests . . .if the ids are the same */
	const firebaseRef = new MockFirebase(FIREBASE_PATHS.USERS);
	const childFirebaseRef = firebaseRef.child(userId);

	const sampleUserDataFromDB: IUserDataFromDB = sampleUserDataFromDB1;

	const userLoader = new UserLoader({firebaseRef});

	childFirebaseRef.fakeEvent('value', undefined, sampleUserDataFromDB);
	const userDataPromise: Promise<ISyncableMutableSubscribableUser> = userLoader.downloadUser(userId);
	childFirebaseRef.flush();

	const user = await userDataPromise;

	expect(user.val()).to.deep.equal(sampleUserData1);
	t.pass();
});
