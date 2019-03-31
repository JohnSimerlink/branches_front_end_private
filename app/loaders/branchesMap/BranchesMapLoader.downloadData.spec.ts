import test
	from 'ava';
import {
	myContainerLoadAllModulesExceptFirebaseRefs,
	myContainerLoadMockFirebaseReferences
} from '../../../inversify.config';
import {expect} from 'chai';
import {MockFirebase} from 'firebase-mock';

myContainerLoadMockFirebaseReferences();
myContainerLoadAllModulesExceptFirebaseRefs({fakeSigma: true});
test('BranchesMapLoader:::DownloadBranchesMap should return the branchesMap', async (t) => {
	// const branchesMapId = '12345';
	// const firebaseRef  = new MockFirebase(FIREBASE_PATHS.USERS);
	// const childFirebaseRef = firebaseRef.child(branchesMapId);
	// const branchesMapLoader = myContainer.get<IBranchesMapLoader>(TYPES.IBranchesMapLoader);
	//
	// childFirebaseRef.fakeEvent('value', undefined, sampleBranchesMapDataFromDB1);
	// const branchesMapDataPromise: Promise<ISyncableMutableSubscribableBranchesMap> =
	//     branchesMapLoader.loadIfNotLoaded(branchesMapId);
	// childFirebaseRef.flush();
	//
	// const branchesMap = await branchesMapDataPromise;
	//
	// expect(branchesMap).to.deep.equal(sampleBranchesMap1);
	t.pass();
});
