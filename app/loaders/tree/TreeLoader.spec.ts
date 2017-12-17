import test from 'ava'
import {expect} from 'chai'
import * as firebase from 'firebase'
import {MockFirebase} from 'firebase-mock'
import {log} from '../../../app/core/log'
import {myContainer} from '../../../inversify.config';
import {FirebaseRef} from '../../objects/dbSync/FirebaseRef';
import {
    IFirebaseRef, IMutableSubscribableTree, ISubscribableStoreSource, ISubscribableTreeStoreSource,
    ITreeDataWithoutId, ITreeLoader
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import Reference = firebase.database.Reference;
import {injectionWorks} from '../../testHelpers/testHelpers';
import {FIREBASE_PATHS} from '../paths';
import {TreeDeserializer} from './TreeDeserializer';
import {TreeLoader, TreeLoaderArgs} from './TreeLoader';
test('TreeLoader:::DI constructor should work', (t) => {
    const injects = injectionWorks<TreeLoaderArgs, ITreeLoader>({
        container: myContainer,
        argsType: TYPES.TreeLoaderArgs,
        classType: TYPES.ITreeLoader,
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('TreeLoader:::Should set the firebaseRef and storeSource for the loader', (t) => {
    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)

    const firebaseRef: IFirebaseRef =  new FirebaseRef()

    const treeLoader = new TreeLoader({ storeSource, firebaseRef})
    expect(treeLoader['storeSource']).to.deep.equal(storeSource)
    expect(treeLoader['firebaseRef']).to.deep.equal(firebaseRef) // TODO: why am I testing private properties
    t.pass()
})
test('TreeLoader:::Should mark an id as loaded if test exists in the injected storeSource', (t) => {
    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)

    const treeId = '1234'
    const tree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
    const firebaseRef: IFirebaseRef =  new FirebaseRef()
    storeSource.set(treeId, tree)

    const treeLoader = new TreeLoader({storeSource, firebaseRef})
    const isLoaded = treeLoader.isLoaded(treeId)
    expect(isLoaded).to.deep.equal(true)
    t.pass()
})
test('TreeLoader:::Should mark an id as not loaded if test does not exist in the injected storeSource', (t) => {
    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)

    const treeId = '1234'
    const nonExistentTreeId = '01234'
    const tree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
    const firebaseRef: IFirebaseRef =  new FirebaseRef()

    const treeLoader = new TreeLoader({storeSource, firebaseRef})
    const isLoaded = treeLoader.isLoaded(nonExistentTreeId)
    expect(isLoaded).to.deep.equal(false)
    t.pass()
})
test('TreeLoader:::Should mark an id as loaded after being loaded', (t) => {
    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)

    const treeId = '1234'
    const nonExistentTreeId = '01234'
    const tree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
    const firebaseRef: IFirebaseRef =  new FirebaseRef()
    storeSource.set(treeId, tree)

    const treeLoader = new TreeLoader({storeSource, firebaseRef})
    const isLoaded = treeLoader.isLoaded(nonExistentTreeId)
    expect(isLoaded).to.deep.equal(false)
    t.pass()

})
test('TreeLoader:::Should mark an id as loaded after being loaded', async (t) => {
    const treeId = '1234'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(treeId)

    const sampleTreeData: ITreeDataWithoutId = {
        contentId: '12345532',
        parentId: '493284',
        children: ['2948, 2947']
    }

    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
    const treeLoader = new TreeLoader({storeSource, firebaseRef})
    childFirebaseRef.fakeEvent('value', undefined, sampleTreeData)
    treeLoader.downloadData(treeId)
    childFirebaseRef.flush()
    /* TODO: if you put a console log inside treeLoader.downloadData
    you'll see that the on value callback actually gets called twice.
    First time wtesth the actual value. Second time wtesth null
    */

    const isLoaded = treeLoader.isLoaded(treeId)
    expect(isLoaded).to.equal(true)
    t.pass()

})
test('TreeLoader:::DownloadData should return the data', async (t) => {
    const treeId = '1234'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(treeId)

    const sampleTreeData: ITreeDataWithoutId = {
        contentId: '12345532',
        parentId: '493284',
        children: ['2948, 2947']
    }
    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
    const treeLoader = new TreeLoader({ storeSource, firebaseRef})
    childFirebaseRef.fakeEvent('value', undefined, sampleTreeData)
    const treeDataPromise = treeLoader.downloadData(treeId)
    childFirebaseRef.flush()
    const treeData = await treeDataPromise

    expect(treeData).to.deep.equal(sampleTreeData)
    t.pass()
})
test('TreeLoader:::DownloadData should have the side effect of storing the data in the storeSource', async (t) => {
    const treeId = '1234'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(treeId)

    const sampleTreeData: ITreeDataWithoutId = {
        contentId: '12345532',
        parentId: '493284',
        children: ['2948, 2947']
    }
    const sampleTree: IMutableSubscribableTree = TreeDeserializer.deserialize({treeId, treeData: sampleTreeData})
    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
    const treeLoader = new TreeLoader({storeSource, firebaseRef})
    childFirebaseRef.fakeEvent('value', undefined, sampleTreeData)
    treeLoader.downloadData(treeId)
    childFirebaseRef.flush()

    expect(storeSource.get(treeId)).to.deep.equal(sampleTree)
    t.pass()
})
test('TreeLoader:::GetData on an existing tree should return the tree', async (t) => {
    const treeId = '1234'
    const firebaseRef: Reference = new MockFirebase().child(treeId)

    const sampleTreeData: ITreeDataWithoutId = {
        contentId: '12345532',
        parentId: '493284',
        children: ['2948, 2947']
    }
    const sampleTree: IMutableSubscribableTree = TreeDeserializer.deserialize({treeId, treeData: sampleTreeData})
    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
    storeSource.set(treeId, sampleTree)

    const treeLoader = new TreeLoader({storeSource, firebaseRef})
    const treeData = treeLoader.getData(treeId)

    expect(treeData).to.deep.equal(sampleTreeData)
    t.pass()
})
test('TreeLoader:::GetData on a non existing tree should throw a RangeError', async (t) => {
    const treeId = '1234'
    const firebaseRef: Reference = new MockFirebase(FIREBASE_PATHS.TREES)

    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)

    const treeLoader = new TreeLoader({storeSource, firebaseRef})

    expect(() => treeLoader.getData(treeId)).to.throw(RangeError)
    t.pass()
})
