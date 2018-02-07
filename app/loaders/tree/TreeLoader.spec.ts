import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as firebase from 'firebase'
import {MockFirebase} from 'firebase-mock'
import {log} from '../../../app/core/log'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {
    IHash, IMutableSubscribableTree, ISubscribableStoreSource, ISubscribableTreeStoreSource,
    ISyncableMutableSubscribableTree,
    ITreeDataFromFirebase,
    ITreeDataWithoutId, ITreeLoader
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import Reference = firebase.database.Reference;
import {injectionWorks} from '../../testHelpers/testHelpers';
import {FIREBASE_PATHS} from '../paths';
import {TreeDeserializer} from './TreeDeserializer';
import {TreeLoader, TreeLoaderArgs} from './TreeLoader';
import {makeQuerablePromise, setToStringArray} from '../../core/newUtils';
myContainerLoadAllModules()
test('TreeLoader:::DI constructor should work', (t) => {
    const injects = injectionWorks<TreeLoaderArgs, ITreeLoader>({
        container: myContainer,
        argsType: TYPES.TreeLoaderArgs,
        interfaceType: TYPES.ITreeLoader,
    })
    expect(injects).to.equal(true)
    t.pass()
})
// test.beforeEach('create fresh container', t => {
//
// })
test('TreeLoader:::Should set the treeLocationsFirebaseRef and storeSource for the loader', (t) => {
    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)

    const firebaseRef: Reference =  new MockFirebase()

    const treeLoader = new TreeLoader({ storeSource, firebaseRef})
    expect(treeLoader['storeSource']).to.deep.equal(storeSource)
    expect(treeLoader['firebaseRef']).to.deep.equal(firebaseRef) // TODO: why am I testing private properties
    t.pass()
})
test('TreeLoader:::Should mark an id as loaded if test exists in the injected storeSource', (t) => {
    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)

    const treeId = '1234'
    const tree = myContainer.get<ISyncableMutableSubscribableTree>(TYPES.ISyncableMutableSubscribableTree)
    const firebaseRef: Reference =  new MockFirebase()
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
    const nonExistentTreeId = '0123bdefa52344'
    const tree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
    const firebaseRef: Reference = new MockFirebase()

    const treeLoader = new TreeLoader({storeSource, firebaseRef})
    const isLoaded = treeLoader.isLoaded(nonExistentTreeId)
    expect(isLoaded).to.deep.equal(false)
    t.pass()
})
test('TreeLoader:::Should mark an id as loaded after being loaded', async (t) => {
    const treeId = 'fedbadcaddac1234'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(treeId)

    const sampleTreeData: ITreeDataFromFirebase = {
        contentId: {
            val: '12345532',
        },
        parentId: {
            val: '493284'
        },
        children: {
            val: {
                2948: true,
                2947: true,
            }
        }
    }

    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
    const treeLoader = new TreeLoader({storeSource, firebaseRef})

    let isLoaded = treeLoader.isLoaded(treeId)
    expect(isLoaded).to.equal(false)

    childFirebaseRef.fakeEvent('value', undefined, sampleTreeData)
    treeLoader.downloadData(treeId)
    childFirebaseRef.flush()

    isLoaded = treeLoader.isLoaded(treeId)
    expect(isLoaded).to.equal(true)
    t.pass()

})
test('TreeLoader:::DownloadData should return the data', async (t) => {
    const treeId = '1234'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(treeId)

    const contentId = '12345532'
    const parentId = '493284'
    const sampleTreeData: ITreeDataFromFirebase = {
        contentId: {
            val: contentId
        },
        parentId: {
            val: parentId
        },
        children: {
            val: {
                2948: true,
                2947: true
            }
        }
    }
    const expectedTreeData: ITreeDataWithoutId = {
        contentId,
        parentId,
        children: ['2947', '2948']
    }
    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
    // childFirebaseRef.flush()
    const treeLoader = new TreeLoader({ storeSource, firebaseRef})

    // log('wrapped Promise is Fulfilled 1', wrappedPromise.isFulfilled())

    childFirebaseRef.fakeEvent('value', undefined, sampleTreeData)
    const treeDataPromise = treeLoader.downloadData(treeId)
    const wrappedPromise = makeQuerablePromise(treeDataPromise)
    // log('wrapped Promise is Fulfilled 2', wrappedPromise.isFulfilled())
    childFirebaseRef.flush()
    // log('wrapped Promise is Fulfilled 3', wrappedPromise.isFulfilled())

    const treeData = await treeDataPromise
    // log('wrapped Promise is Fulfilled 4', wrappedPromise.isFulfilled())

    expect(treeData).to.deep.equal(expectedTreeData)
    t.pass()
})
test('TreeLoader:::DownloadData should have the side effect of storing the data in the storeSource', async (t) => {
    const treeId = '1234'
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(treeId)

    const sampleTreeData: ITreeDataFromFirebase = {
        contentId: {
            val: '12345532',
        },
        parentId: {
            val: '493284',
        },
        children: {
            val: {
                2948: true,
                2947: true,
            }
        }
    }
    const sampleTree: IMutableSubscribableTree = TreeDeserializer.deserializeFromDB({treeId, treeData: sampleTreeData})
    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
    const treeLoader = new TreeLoader({storeSource, firebaseRef})
    childFirebaseRef.fakeEvent('value', undefined, sampleTreeData)
    const treeLoadPromise = treeLoader.downloadData(treeId)
    childFirebaseRef.flush()

    await treeLoadPromise
    expect(storeSource.get(treeId)).to.deep.equal(sampleTree)
    t.pass()
})
test('TreeLoader:::GetData on an existing tree should return the tree', async (t) => {
    const treeId = '1234'
    const firebaseRef: Reference = new MockFirebase().child(treeId)

    const contentId = '12345532'
    const parentId = '493284'
    const sampleTreeData: ITreeDataFromFirebase = {
        contentId: {
            val: contentId,
        },
        parentId: {
            val: parentId,
        },
        children: {
            val: {
                2948: true,
                2947: true,
            }
        }
    }
    const childrenArray = setToStringArray(sampleTreeData.children.val)
    const expectedTreeData: ITreeDataWithoutId = {
        contentId,
        parentId,
        children: childrenArray,
    }
    const sampleTree: ISyncableMutableSubscribableTree
        = TreeDeserializer.deserializeFromDB({treeId, treeData: sampleTreeData})
    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
    storeSource.set(treeId, sampleTree)

    const treeLoader = new TreeLoader({storeSource, firebaseRef})
    const treeData = treeLoader.getData(treeId)

    expect(treeData).to.deep.equal(expectedTreeData)
    t.pass()
})
test('TreeLoader:::GetData on a non existing tree should throw a RangeError', async (t) => {
    const treeId = 'abcdefgh4141234'
    const firebaseRef: Reference = new MockFirebase(FIREBASE_PATHS.TREES)

    const storeSource: ISubscribableTreeStoreSource =
        myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)

    const treeLoader = new TreeLoader({storeSource, firebaseRef})

    expect(() => treeLoader.getData(treeId)).to.throw(RangeError)
    t.pass()
})
