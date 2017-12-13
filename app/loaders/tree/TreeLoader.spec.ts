import {expect} from 'chai'
import {MockFirebase} from 'firebase-mock'
import {log} from '../../../app/core/log'
import {myContainer} from '../../../inversify.config';
import {FirebaseRef} from '../../objects/dbSync/FirebaseRef';
import {
    IFirebaseRef, IMutableSubscribableTree, ISubscribableStoreSource,
    ITreeDataWithoutId
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {TreeDeserializer} from './TreeDeserializer';
import {TreeLoader} from './TreeLoader';
import {FIREBASE_PATHS} from '../paths';
describe('treeLoader', () => {
    it('Should set the firebaseRef and storeSource for the loader', () => {
        const storeSource: ISubscribableStoreSource<IMutableSubscribableTree> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTree>>(TYPES.ISubscribableStoreSource)

        const firebaseRef: IFirebaseRef =  new FirebaseRef()

        const treeLoader = new TreeLoader({ storeSource, firebaseRef})
        expect(treeLoader['storeSource']).to.deep.equal(storeSource)
        expect(treeLoader['firebaseRef']).to.deep.equal(firebaseRef) // TODO: why am I testing private properties
    })
    it('Should mark an id as loaded if it exists in the injected storeSource', () => {
        const storeSource: ISubscribableStoreSource<IMutableSubscribableTree> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTree>>(TYPES.ISubscribableStoreSource)

        const treeId = '1234'
        const tree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
        const firebaseRef: IFirebaseRef =  new FirebaseRef()
        storeSource.set(treeId, tree)

        const treeLoader = new TreeLoader({storeSource, firebaseRef})
        const isLoaded = treeLoader.isLoaded(treeId)
        expect(isLoaded).to.deep.equal(true)
    })
    it('Should mark an id as not loaded if it does not exist in the injected storeSource', () => {
        const storeSource: ISubscribableStoreSource<IMutableSubscribableTree> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTree>>(TYPES.ISubscribableStoreSource)

        const treeId = '1234'
        const nonExistentTreeId = '01234'
        const tree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
        const firebaseRef: IFirebaseRef =  new FirebaseRef()

        const treeLoader = new TreeLoader({storeSource, firebaseRef})
        const isLoaded = treeLoader.isLoaded(nonExistentTreeId)
        expect(isLoaded).to.deep.equal(false)
    })
    it('Should mark an id as loaded after being loaded', () => {
        const storeSource: ISubscribableStoreSource<IMutableSubscribableTree> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTree>>(TYPES.ISubscribableStoreSource)

        const treeId = '1234'
        const nonExistentTreeId = '01234'
        const tree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
        const firebaseRef: IFirebaseRef =  new FirebaseRef()
        storeSource.set(treeId, tree)

        const treeLoader = new TreeLoader({storeSource, firebaseRef})
        const isLoaded = treeLoader.isLoaded(nonExistentTreeId)
        expect(isLoaded).to.deep.equal(false)

    })
    it('Should mark an id as loaded after being loaded', async () => {
        const treeId = '1234'
        const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
        const childFirebaseRef = firebaseRef.child(treeId)

        const sampleTreeData: ITreeDataWithoutId = {
            contentId: '12345532',
            parentId: '493284',
            children: ['2948, 2947']
        }

        const storeSource: ISubscribableStoreSource<IMutableSubscribableTree> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTree>>(TYPES.ISubscribableStoreSource)
        const treeLoader = new TreeLoader({storeSource, firebaseRef})
        childFirebaseRef.fakeEvent('value', undefined, sampleTreeData)
        treeLoader.downloadData(treeId)
        childFirebaseRef.flush()
        /* TODO: if you put a console log inside treeLoader.downloadData
        you'll see that the on value callback actually gets called twice.
        First time with the actual value. Second time with null
        */

        const isLoaded = treeLoader.isLoaded(treeId)
        expect(isLoaded).to.equal(true)

    })
    it('DownloadData should return the data', async () => {
        const treeId = '1234'
        const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
        const childFirebaseRef = firebaseRef.child(treeId)

        const sampleTreeData: ITreeDataWithoutId = {
            contentId: '12345532',
            parentId: '493284',
            children: ['2948, 2947']
        }
        const storeSource: ISubscribableStoreSource<IMutableSubscribableTree> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTree>>(TYPES.ISubscribableStoreSource)
        const treeLoader = new TreeLoader({ storeSource, firebaseRef})
        childFirebaseRef.fakeEvent('value', undefined, sampleTreeData)
        const treeDataPromise = treeLoader.downloadData(treeId)
        childFirebaseRef.flush()
        const treeData = await treeDataPromise

        expect(treeData).to.deep.equal(sampleTreeData)
    })
    it('DownloadData should have the side effect of storing the data in the storeSource', async () => {
        const treeId = '1234'
        const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
        const childFirebaseRef = firebaseRef.child(treeId)

        const sampleTreeData: ITreeDataWithoutId = {
            contentId: '12345532',
            parentId: '493284',
            children: ['2948, 2947']
        }
        const sampleTree: IMutableSubscribableTree = TreeDeserializer.deserialize({treeId, treeData: sampleTreeData})
        const storeSource: ISubscribableStoreSource<IMutableSubscribableTree> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTree>>(TYPES.ISubscribableStoreSource)
        const treeLoader = new TreeLoader({storeSource, firebaseRef})
        childFirebaseRef.fakeEvent('value', undefined, sampleTreeData)
        treeLoader.downloadData(treeId)
        childFirebaseRef.flush()

        expect(storeSource.get(treeId)).to.deep.equal(sampleTree)
    })
    it('GetData on an existing tree should return the tree', async () => {
        const treeId = '1234'
        const firebaseRef: Firebase = new MockFirebase().child(treeId)

        const sampleTreeData: ITreeDataWithoutId = {
            contentId: '12345532',
            parentId: '493284',
            children: ['2948, 2947']
        }
        const sampleTree: IMutableSubscribableTree = TreeDeserializer.deserialize({treeId, treeData: sampleTreeData})
        const storeSource: ISubscribableStoreSource<IMutableSubscribableTree> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTree>>(TYPES.ISubscribableStoreSource)
        storeSource.set(treeId, sampleTree)

        const treeLoader = new TreeLoader({storeSource, firebaseRef})
        const treeData = treeLoader.getData(treeId)

        expect(treeData).to.deep.equal(sampleTreeData)
    })
    it('GetData on a non existing tree should throw a RangeError', async () => {
        const treeId = '1234'
        const firebaseRef: Firebase = new MockFirebase(FIREBASE_PATHS.TREES)

        const storeSource: ISubscribableStoreSource<IMutableSubscribableTree> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTree>>(TYPES.ISubscribableStoreSource)

        const treeLoader = new TreeLoader({storeSource, firebaseRef})

        expect(() => treeLoader.getData(treeId)).to.throw(RangeError)
    })
})
