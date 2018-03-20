import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava';
import {expect} from 'chai';
import {MockFirebase} from 'firebase-mock';
import {log} from '../../../app/core/log';
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {
    IMutableSubscribableTreeLocation,
    ISubscribableTreeLocationStoreSource,
    ISyncableMutableSubscribableTreeLocation,
    ITreeLocationData,
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {FIREBASE_PATHS} from '../paths';
import {TreeLocationDeserializer} from './TreeLocationDeserializer';
import {TreeLocationLoader} from './TreeLocationLoader';
import * as firebase from 'firebase';
import {
    sampleTreeLocationData1,
    sampleTreeLocationDataFromFirebase1
} from '../../objects/treeLocation/treeLocationTestHelpers';

import Reference = firebase.database.Reference;

myContainerLoadAllModules({fakeSigma: true});
// TODO: DI test
test('treeLocationLoader:::Should mark an id as loaded if it exists in the injected storeSource', (t) => {
    const storeSource: ISubscribableTreeLocationStoreSource =
        myContainer.get<ISubscribableTreeLocationStoreSource>(TYPES.ISubscribableTreeLocationStoreSource);

    const treeId = '1234';
    const treeLocation =
        myContainer.get<ISyncableMutableSubscribableTreeLocation>(TYPES.ISyncableMutableSubscribableTreeLocation);
    const firebaseRef: Reference = new MockFirebase();
    storeSource.set(treeId, treeLocation);

    const treeLoader = new TreeLocationLoader({storeSource, firebaseRef});
    const isLoaded = treeLoader.isLoaded(treeId);
    expect(isLoaded).to.deep.equal(true);
    t.pass();
});
test('treeLocationLoader:::Should mark an id as not loaded if it does not exist in the injected storeSource', (t) => {
    const storeSource: ISubscribableTreeLocationStoreSource =
        myContainer.get<ISubscribableTreeLocationStoreSource>(TYPES.ISubscribableTreeLocationStoreSource);

    const nonExistentTreeLocationId = '01234';
    const firebaseRef: Reference = new MockFirebase();

    const treeLoader = new TreeLocationLoader({storeSource, firebaseRef});
    const isLoaded = treeLoader.isLoaded(nonExistentTreeLocationId);
    expect(isLoaded).to.deep.equal(false);
    t.pass();
});
test('treeLocationLoader:::Should mark an id as loaded after being loaded', (t) => {
    const storeSource: ISubscribableTreeLocationStoreSource =
        myContainer.get<ISubscribableTreeLocationStoreSource>(TYPES.ISubscribableTreeLocationStoreSource);

    const treeId = '1234';
    const nonExistentTreeLocationId = '01234';
    const treeLocation = myContainer.get<ISyncableMutableSubscribableTreeLocation>
    (TYPES.ISyncableMutableSubscribableTreeLocation);
    const firebaseRef: Reference = new MockFirebase();
    storeSource.set(treeId, treeLocation);

    const treeLoader = new TreeLocationLoader({storeSource, firebaseRef});
    const isLoaded = treeLoader.isLoaded(nonExistentTreeLocationId);
    expect(isLoaded).to.deep.equal(false);

    t.pass();
});
test('treeLocationLoader:::Should mark an id as loaded after being loaded', async (t) => {
    const treeId = '1234';
    const treeLocationsRef = new MockFirebase(FIREBASE_PATHS.TREE_LOCATIONS);
    const treeLocationRef = treeLocationsRef.child(treeId);

    const storeSource: ISubscribableTreeLocationStoreSource =
        myContainer.get<ISubscribableTreeLocationStoreSource>(TYPES.ISubscribableTreeLocationStoreSource);
    const treeLoader = new TreeLocationLoader({storeSource, firebaseRef: treeLocationsRef});
    treeLocationRef.fakeEvent('value', undefined, sampleTreeLocationDataFromFirebase1);
    treeLoader.downloadData(treeId);
    treeLocationRef.flush();
    /* TODO: if you put a console log inside treeLoader.downloadData
    you'll see that the on value callback actually gets called twice.
    First time with the actual value. Second time with null
    */

    const isLoaded = treeLoader.isLoaded(treeId);
    expect(isLoaded).to.equal(true);

    t.pass();
});
test('treeLocationLoader:::DownloadData should return the data', async (t) => {
    const treeId = '1234';

    const treeLocationsRef = new MockFirebase(FIREBASE_PATHS.TREE_LOCATIONS);
    const treeLocationRef = treeLocationsRef.child(treeId);

    const x = 5;
    const y = 8;
    const storeSource: ISubscribableTreeLocationStoreSource =
        myContainer.get<ISubscribableTreeLocationStoreSource>(TYPES.ISubscribableTreeLocationStoreSource);
    const treeLoader = new TreeLocationLoader({storeSource, firebaseRef: treeLocationsRef});
    treeLocationRef.fakeEvent('value', undefined, sampleTreeLocationDataFromFirebase1);
    const treeDataPromise = treeLoader.downloadData(treeId);
    treeLocationRef.flush();
    const treeData = await treeDataPromise;

    expect(treeData).to.deep.equal(sampleTreeLocationData1);
    t.pass();
});
test('treeLocationLoader:::DownloadData should have the side effect' +
    ' of storing the data in the storeSource', async (t) => {
    const treeId = '1234';
    const treeLocationsRef = new MockFirebase(FIREBASE_PATHS.TREE_LOCATIONS);
    const treeLocationRef = treeLocationsRef.child(treeId);

    const sampleTreeLocation: IMutableSubscribableTreeLocation =
        TreeLocationDeserializer.deserializeFromDB({treeLocationDataFromDB: sampleTreeLocationDataFromFirebase1});
    const storeSource: ISubscribableTreeLocationStoreSource =
        myContainer.get<ISubscribableTreeLocationStoreSource>(TYPES.ISubscribableTreeLocationStoreSource);
    const treeLoader = new TreeLocationLoader({storeSource, firebaseRef: treeLocationsRef});
    treeLocationRef.fakeEvent('value', undefined, sampleTreeLocationDataFromFirebase1);
    treeLoader.downloadData(treeId);
    treeLocationRef.flush();

    expect(storeSource.get(treeId)).to.deep.equal(sampleTreeLocation);
    t.pass();
});
test('treeLocationLoader:::GetData on an existing tree should return the tree', async (t) => {
    const treeId = '1234';
    const treeLocationsRef = new MockFirebase(FIREBASE_PATHS.TREE_LOCATIONS);

    const x = 5;
    const y = 8;
    const sampleTreeLocation: ISyncableMutableSubscribableTreeLocation =
        TreeLocationDeserializer.deserializeFromDB(
            {treeLocationDataFromDB: sampleTreeLocationDataFromFirebase1}
        );
    const storeSource: ISubscribableTreeLocationStoreSource =
        myContainer.get<ISubscribableTreeLocationStoreSource>(TYPES.ISubscribableTreeLocationStoreSource);
    storeSource.set(treeId, sampleTreeLocation);

    const treeLoader = new TreeLocationLoader({storeSource, firebaseRef: treeLocationsRef});
    const treeData: ITreeLocationData = treeLoader.getData(treeId);

    expect(treeData).to.deep.equal(sampleTreeLocationData1);
    t.pass();
});
test('treeLocationLoader:::GetData on a non existing tree should throw a RangeError', async (t) => {
    const treeId = '12345abcde1235';
    const treeLocationsRef = new MockFirebase(FIREBASE_PATHS.TREE_LOCATIONS);

    const storeSource: ISubscribableTreeLocationStoreSource =
        myContainer.get<ISubscribableTreeLocationStoreSource>(TYPES.ISubscribableTreeLocationStoreSource);

    const treeLoader = new TreeLocationLoader({storeSource, firebaseRef: treeLocationsRef});

    expect(() => treeLoader.getData(treeId)).to.throw(RangeError);
    t.pass();
});
