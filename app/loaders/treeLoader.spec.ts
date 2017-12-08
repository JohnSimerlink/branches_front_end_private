import {expect} from 'chai'
import {MockFirebase} from 'firebase-mock'
import * as FirebaseServer from 'firebase-server'
import * as sinon from 'sinon'
import {log} from '../../app/core/log'
import {myContainer} from '../../inversify.config';
import {FirebaseRef} from '../objects/dbSync/FirebaseRef';
import {IFirebaseRef, IMutableSubscribableTree, ITreeDataWithoutId} from '../objects/interfaces';
import {TYPES} from '../objects/types';
import {TreeLoader} from './treeLoader';
let firebase
// new FirebaseServer(5000, 'test.firebase.localhost', {
//     name: 'john'
// })
beforeEach('Init FB server', () => {
    firebase = require('firebase')

})

describe('treeLoader', () => {
    it('Should set the firebaseRef and store for the loader', () => {
        const store = {}

        const treeId = '1234'
        const tree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
        const firebaseRef: IFirebaseRef =  new FirebaseRef()
        store[treeId] = tree

        const treeLoader = new TreeLoader({store, firebaseRef})
        expect(treeLoader['store']).to.deep.equal(store)
        expect(treeLoader['firebaseRef']).to.deep.equal(firebaseRef) // TODO: why am I testing private properties
    })
    it('Should mark an id as loaded if it exists in the injected store', () => {
        const store = {}

        const treeId = '1234'
        const tree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
        const firebaseRef: IFirebaseRef =  new FirebaseRef()
        store[treeId] = tree

        const treeLoader = new TreeLoader({store, firebaseRef})
        const isLoaded = treeLoader.isLoaded(treeId)
        expect(isLoaded).to.deep.equal(true)
    })
    it('Should mark an id as not loaded if it does not exist in the injected store', () => {
        const store = {}

        const treeId = '1234'
        const nonExistentTreeId = '01234'
        const tree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
        const firebaseRef: IFirebaseRef =  new FirebaseRef()
        store[treeId] = tree

        const treeLoader = new TreeLoader({store, firebaseRef})
        const isLoaded = treeLoader.isLoaded(nonExistentTreeId)
        expect(isLoaded).to.deep.equal(false)
    })
    it('Should mark an id as loaded after being loaded', () => {
        const store = {}

        const treeId = '1234'
        const nonExistentTreeId = '01234'
        const tree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
        const firebaseRef: IFirebaseRef =  new FirebaseRef()
        store[treeId] = tree

        const treeLoader = new TreeLoader({store, firebaseRef})
        const isLoaded = treeLoader.isLoaded(nonExistentTreeId)
        expect(isLoaded).to.deep.equal(false)

    })
    it('Should mark an id as loaded after being loaded', async () => {
        const treeId = '1234'
        const firebaseRef = new MockFirebase().child(treeId)

        const sampleTreeData: ITreeDataWithoutId = {
            contentId: '12345532',
            parentId: '493284',
            children: ['2948, 2947']
        }
        const store = {}
        const treeLoader = new TreeLoader({store, firebaseRef})
        firebaseRef.fakeEvent('value', undefined, sampleTreeData)
        treeLoader.downloadData(treeId)
        firebaseRef.flush()


        const isLoaded = treeLoader.isLoaded(treeId)
        expect(isLoaded).to.equal(true)

    })
    it('', () => {
    })
})
