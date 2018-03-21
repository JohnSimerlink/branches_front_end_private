import {injectFakeDom} from '../../testHelpers/injectFakeDom';

injectFakeDom()
import test from 'ava';
import {
    myContainer,
    myContainerLoadAllModulesExceptFirebaseRefs, myContainerLoadMockFirebaseReferences,
    myContainerUnloadAllModules
} from '../../../inversify.config';
import {FIREBASE_PATHS} from '../paths';
import {TYPES} from '../../objects/types';
import {IBranchesMapLoader, ISyncableMutableSubscribableBranchesMap} from '../../objects/interfaces';
import {sampleBranchesMap1, sampleBranchesMapDataFromDB1} from '../../objects/branchesMap/branchesMapTestHelpers';
import {expect} from 'chai';
import {MockFirebase} from 'firebase-mock';

myContainerLoadMockFirebaseReferences();
myContainerLoadAllModulesExceptFirebaseRefs({fakeSigma: true});
test('BranchesMapLoader:::DownloadBranchesMap should return the branchesMap', async (t) => {
    const branchesMapId = '12345';
    const firebaseRef  = new MockFirebase(FIREBASE_PATHS.USERS);
    const childFirebaseRef = firebaseRef.child(branchesMapId);
    const branchesMapLoader = myContainer.get<IBranchesMapLoader>(TYPES.IBranchesMapLoader);

    console.log('step 1text is getting run')
    childFirebaseRef.fakeEvent('value', undefined, sampleBranchesMapDataFromDB1);
    const branchesMapDataPromise: Promise<ISyncableMutableSubscribableBranchesMap> =
        branchesMapLoader.loadIfNotLoaded(branchesMapId);
    console.log('step 2text is getting run')
    childFirebaseRef.flush();
    console.log('step 3text is getting run')

    const branchesMap = await branchesMapDataPromise;
    console.log('step 4text is getting run')

    expect(branchesMap).to.deep.equal(sampleBranchesMap1);
    console.log('step 5text is getting run')
    t.pass();
});
