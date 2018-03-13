import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import * as firebase from 'firebase'
import {MockFirebase} from 'firebase-mock'
import {log} from '../../../app/core/log'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {
    IMutableSubscribableTreeUser, IProficiencyStats, ISubscribableStoreSource,
    ISubscribableTreeUserStoreSource, ISyncableMutableSubscribableTreeUser,
    ITreeUserData,
    ITreeUserLoader
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import Reference = firebase.database.Reference;
import {injectionWorks} from '../../testHelpers/testHelpers';
import {FIREBASE_PATHS} from '../paths';
import {TreeUserDeserializer} from './TreeUserDeserializer';
import {getTreeUserId, TreeUserLoader, TreeUserLoaderArgs} from './TreeUserLoader';
import {makeQuerablePromise, setToStringArray} from '../../core/newUtils';
myContainerLoadAllModules();
test('TreeUserLoader:::DI constructor should work', (t) => {
    const injects = injectionWorks<TreeUserLoaderArgs, ITreeUserLoader>({
        container: myContainer,
        argsType: TYPES.TreeUserLoaderArgs,
        interfaceType: TYPES.ITreeUserLoader,
    });
    expect(injects).to.equal(true);
    t.pass()
});
// test.beforeEach('create fresh container', t => {
//
// })
test('TreeUserLoader:::Should set the treeLocationsFirebaseRef and storeSource for the loader', (t) => {
    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource);

    const firebaseRef: Reference =  new MockFirebase();

    const treeUserLoader = new TreeUserLoader({ storeSource, firebaseRef});
    expect(treeUserLoader['storeSource']).to.deep.equal(storeSource);
    expect(treeUserLoader['firebaseRef']).to.deep.equal(firebaseRef); // TODO: why am I testing private properties
    t.pass()
});
test('TreeUserLoader:::Should mark an id as loaded if test exists in the injected storeSource', (t) => {
    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource);

    const treeId = '1234';
    const userId = '5432';
    const treeUserId = getTreeUserId({treeId, userId});
    const treeUser = myContainer.get<ISyncableMutableSubscribableTreeUser>(TYPES.ISyncableMutableSubscribableTreeUser);
    const firebaseRef: Reference =  new MockFirebase();
    storeSource.set(treeUserId, treeUser);

    const treeUserLoader = new TreeUserLoader({storeSource, firebaseRef});
    const isLoaded = treeUserLoader.isLoaded({treeId, userId});
    expect(isLoaded).to.deep.equal(true);
    t.pass()
});
test('TreeUserLoader:::Should mark an id as not loaded if test does not exist in the injected storeSource', (t) => {
    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource);

    const nonExistentTreeUserTreeId = '12345666';
    const nonExistentTreeUserUserId = '4329875325';
    const firebaseRef: Reference = new MockFirebase();

    const treeUserLoader = new TreeUserLoader({storeSource, firebaseRef});
    const isLoaded = treeUserLoader.isLoaded({treeId: nonExistentTreeUserTreeId, userId: nonExistentTreeUserUserId});
    expect(isLoaded).to.deep.equal(false);
    t.pass()
});
test('TreeUserLoader:::Should mark an id as loaded after being loaded', async (t) => {
    const treeId = '943827';
    const userId = 'fedbac432';
    const treeUserId = getTreeUserId({treeId, userId});
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES);
    const childFirebaseRef = firebaseRef.child(treeUserId);

    const proficiencyStatsVal = {
        ONE: 3,
    } as IProficiencyStats;
    const aggregationTimerVal = 87;

    const sampleTreeUserData: ITreeUserData = {
        proficiencyStats: proficiencyStatsVal,
        aggregationTimer: aggregationTimerVal,
    };

    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource);
    const treeUserLoader = new TreeUserLoader({storeSource, firebaseRef});

    let isLoaded = treeUserLoader.isLoaded({treeId, userId});
    expect(isLoaded).to.equal(false);

    childFirebaseRef.fakeEvent('value', undefined, sampleTreeUserData);
    const treeUserLoaderPromise = treeUserLoader.downloadData({treeId, userId});
    childFirebaseRef.flush();

    await treeUserLoaderPromise;
    isLoaded = treeUserLoader.isLoaded({treeId, userId});
    expect(isLoaded).to.equal(true);
    t.pass()

});
test('TreeUserLoader:::DownloadData should return the data', async (t) => {
    const treeId = '943827';
    const userId = 'fedbac432';
    const treeUserId = getTreeUserId({treeId, userId});
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES);
    const childFirebaseRef = firebaseRef.child(treeUserId);

    const proficiencyStatsVal = {
        ONE: 3,
    } as IProficiencyStats;
    const aggregationTimerVal = 87;

    const expectedTreeUserData: ITreeUserData = {
        proficiencyStats: proficiencyStatsVal,
        aggregationTimer: aggregationTimerVal,
    };

    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource);
    // childFirebaseRef.flush()
    const treeUserLoader = new TreeUserLoader({ storeSource, firebaseRef});

    const treeUserDataPromise = treeUserLoader.downloadData({treeId, userId});
    const wrappedPromise = makeQuerablePromise(treeUserDataPromise);
    log('wrapped Promise is Fulfilled 1', wrappedPromise.isFulfilled());

    childFirebaseRef.fakeEvent('value', undefined, expectedTreeUserData);
    log('wrapped Promise is Fulfilled 2', wrappedPromise.isFulfilled());
    childFirebaseRef.flush();
    log('wrapped Promise is Fulfilled 3', wrappedPromise.isFulfilled());

    const treeUserData = await treeUserDataPromise;
    log('wrapped Promise is Fulfilled 4', wrappedPromise.isFulfilled());

    expect(treeUserData).to.deep.equal(expectedTreeUserData);
    t.pass()
});
test('TreeUserLoader:::DownloadData should have the side effect of storing the data in the storeSource', async (t) => {
    const treeId = '943827';
    const userId = 'fedbac432';
    const treeUserId = getTreeUserId({treeId, userId});
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES);
    const childFirebaseRef = firebaseRef.child(treeUserId);

    const proficiencyStatsVal = {
        ONE: 3,
    } as IProficiencyStats;
    const aggregationTimerVal = 87;

    const expectedTreeUserData: ITreeUserData = {
        proficiencyStats: proficiencyStatsVal,
        aggregationTimer: aggregationTimerVal,
    };
    const sampleTreeUser: IMutableSubscribableTreeUser =
        TreeUserDeserializer.deserialize({treeUserId, treeUserData: expectedTreeUserData});
    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource);
    const treeUserLoader = new TreeUserLoader({storeSource, firebaseRef});
    childFirebaseRef.fakeEvent('value', undefined, expectedTreeUserData);
    treeUserLoader.downloadData({treeId, userId});
    childFirebaseRef.flush();

    expect(storeSource.get(treeUserId)).to.deep.equal(sampleTreeUser);
    t.pass()
});
test('TreeUserLoader:::GetData on an existing treeUser should return the treeUser', async (t) => {
    const treeId = '943827';
    const userId = 'fedbac432';
    const treeUserId = getTreeUserId({treeId, userId});
    const firebaseRef: Reference = new MockFirebase().child(treeUserId);

    const proficiencyStatsVal = {
        ONE: 3,
    } as IProficiencyStats;
    const aggregationTimerVal = 87;

    const expectedTreeUserData: ITreeUserData = {
        proficiencyStats: proficiencyStatsVal,
        aggregationTimer: aggregationTimerVal,
    };
    const sampleTreeUser: ISyncableMutableSubscribableTreeUser =
        TreeUserDeserializer.deserialize({treeUserId, treeUserData: expectedTreeUserData});
    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource);
    storeSource.set(treeUserId, sampleTreeUser);

    const treeUserLoader = new TreeUserLoader({storeSource, firebaseRef});
    const treeUserData = treeUserLoader.getData({treeId, userId});

    expect(treeUserData).to.deep.equal(expectedTreeUserData);
    t.pass()
});
test('TreeUserLoader:::GetData on a non existing treeUser should throw a RangeError', async (t) => {
    const nonexistentTreeUserTreeId = 'abcdefgh4141234';
    const nonexistentTreeUserUserId = 'dfaabcdefgh4141234';
    const firebaseRef: Reference = new MockFirebase(FIREBASE_PATHS.TREES);

    const storeSource: ISubscribableTreeUserStoreSource =
        myContainer.get<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource);

    const treeUserLoader = new TreeUserLoader({storeSource, firebaseRef});

    expect(() => treeUserLoader.getData(
        {treeId: nonexistentTreeUserTreeId, userId: nonexistentTreeUserUserId}
        )).to.throw(RangeError);
    t.pass()
});
