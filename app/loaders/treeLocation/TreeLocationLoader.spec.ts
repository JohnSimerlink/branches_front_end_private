import {expect} from 'chai'
import {MockFirebase} from 'firebase-mock'
import {log} from '../../../app/core/log'
import {myContainer} from '../../../inversify.config';
import {FirebaseRef} from '../../objects/dbSync/FirebaseRef';
import {
    IFirebaseRef, IMutableSubscribableTreeLocation, ISubscribableStoreSource, ITreeLocationData,
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {TreeLocationDeserializer} from './TreeLocationDeserializer';
import {TreeLocationLoader} from './TreeLocationLoader';
describe('treeLocationLoader', () => {
    it('Should set the firebaseRef and store for the loader', () => {
        const store: ISubscribableStoreSource<IMutableSubscribableTreeLocation> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>(TYPES.ISubscribableStoreSource)

        const firebaseRef: IFirebaseRef =  new FirebaseRef()

        const treeLoader = new TreeLocationLoader({store, firebaseRef})
        expect(treeLoader['store']).to.deep.equal(store)
        expect(treeLoader['firebaseRef']).to.deep.equal(firebaseRef) // TODO: why am I testing private properties
    })
    // TODO: DI test
    it('Should mark an id as loaded if it exists in the injected store', () => {
        const store: ISubscribableStoreSource<IMutableSubscribableTreeLocation> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>(TYPES.ISubscribableStoreSource)

        const treeId = '1234'
        const treeLocation = myContainer.get<IMutableSubscribableTreeLocation>(TYPES.IMutableSubscribableTreeLocation)
        const firebaseRef: IFirebaseRef =  new FirebaseRef()
        store.set(treeId, treeLocation)

        const treeLoader = new TreeLocationLoader({store, firebaseRef})
        const isLoaded = treeLoader.isLoaded(treeId)
        expect(isLoaded).to.deep.equal(true)
    })
    it('Should mark an id as not loaded if it does not exist in the injected store', () => {
        const store: ISubscribableStoreSource<IMutableSubscribableTreeLocation> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>(TYPES.ISubscribableStoreSource)

        const nonExistentTreeLocationId = '01234'
        const firebaseRef: IFirebaseRef =  new FirebaseRef()

        const treeLoader = new TreeLocationLoader({store, firebaseRef})
        const isLoaded = treeLoader.isLoaded(nonExistentTreeLocationId)
        expect(isLoaded).to.deep.equal(false)
    })
    it('Should mark an id as loaded after being loaded', () => {
        const store: ISubscribableStoreSource<IMutableSubscribableTreeLocation> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>(TYPES.ISubscribableStoreSource)

        const treeId = '1234'
        const nonExistentTreeLocationId = '01234'
        const tree = myContainer.get<IMutableSubscribableTreeLocation>(TYPES.IMutableSubscribableTreeLocation)
        const firebaseRef: IFirebaseRef =  new FirebaseRef()
        store[treeId] = tree

        const treeLoader = new TreeLocationLoader({store, firebaseRef})
        const isLoaded = treeLoader.isLoaded(nonExistentTreeLocationId)
        expect(isLoaded).to.deep.equal(false)

    })
    it('Should mark an id as loaded after being loaded', async () => {
        const treeId = '1234'
        const firebaseRef = new MockFirebase().child(treeId)

        const sampleTreeLocationData: ITreeLocationData = {
            point: {
                x: 5,
                y: 8,
            }
        }

        const store: ISubscribableStoreSource<IMutableSubscribableTreeLocation> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>(TYPES.ISubscribableStoreSource)
        const treeLoader = new TreeLocationLoader({store, firebaseRef})
        firebaseRef.fakeEvent('value', undefined, sampleTreeLocationData)
        treeLoader.downloadData(treeId)
        firebaseRef.flush()
        /* TODO: if you put a console log inside treeLoader.downloadData
        you'll see that the on value callback actually gets called twice.
        First time with the actual value. Second time with null
        */

        const isLoaded = treeLoader.isLoaded(treeId)
        expect(isLoaded).to.equal(true)

    })
    it('DownloadData should return the data', async () => {
        const treeId = '1234'
        const firebaseRef = new MockFirebase().child(treeId)

        const sampleTreeLocationData: ITreeLocationData = {
            point: {
                x: 5,
                y: 8,
            }
        }
        const store: ISubscribableStoreSource<IMutableSubscribableTreeLocation> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>(TYPES.ISubscribableStoreSource)
        const treeLoader = new TreeLocationLoader({store, firebaseRef})
        firebaseRef.fakeEvent('value', undefined, sampleTreeLocationData)
        const treeDataPromise = treeLoader.downloadData(treeId)
        firebaseRef.flush()
        const treeData = await treeDataPromise

        expect(treeData).to.deep.equal(sampleTreeLocationData)
    })
    it('DownloadData should have the side effect of storing the data in the store', async () => {
        const treeId = '1234'
        const firebaseRef = new MockFirebase().child(treeId)

        const sampleTreeLocationData: ITreeLocationData = {
            point: {
                x: 5,
                y: 8,
            }
        }
        const sampleTreeLocation: IMutableSubscribableTreeLocation =
            TreeLocationDeserializer.deserialize({treeLocationData: sampleTreeLocationData})
        const store: ISubscribableStoreSource<IMutableSubscribableTreeLocation> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>(TYPES.ISubscribableStoreSource)
        const treeLoader = new TreeLocationLoader({store, firebaseRef})
        firebaseRef.fakeEvent('value', undefined, sampleTreeLocationData)
        treeLoader.downloadData(treeId)
        firebaseRef.flush()

        expect(store.get(treeId)).to.deep.equal(sampleTreeLocation)
    })
    it('GetData on an existing tree should return the tree', async () => {
        const treeId = '1234'
        const firebaseRef = new MockFirebase().child(treeId)

        const sampleTreeLocationData: ITreeLocationData = {
            point: {
                x: 5,
                y: 8,
            }
        }
        const sampleTreeLocation: IMutableSubscribableTreeLocation =
            TreeLocationDeserializer.deserialize({treeLocationData: sampleTreeLocationData})
        const store: ISubscribableStoreSource<IMutableSubscribableTreeLocation> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>(TYPES.ISubscribableStoreSource)
        store.set(treeId, sampleTreeLocation)

        const treeLoader = new TreeLocationLoader({store, firebaseRef})
        const treeData = treeLoader.getData(treeId)

        expect(treeData).to.deep.equal(sampleTreeLocationData)
    })
    it('GetData on a non existing tree should throw a RangeError', async () => {
        const treeId = '1234'
        const firebaseRef = new MockFirebase().child(treeId)

        const store: ISubscribableStoreSource<IMutableSubscribableTreeLocation> =
            myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>(TYPES.ISubscribableStoreSource)

        const treeLoader = new TreeLocationLoader({store, firebaseRef})

        expect(() => treeLoader.getData(treeId)).to.throw(RangeError)
    })
})
