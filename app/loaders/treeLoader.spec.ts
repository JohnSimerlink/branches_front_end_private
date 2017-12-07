import {myContainer} from '../../inversify.config';
import {IFirebaseRef, IMutableSubscribableTree} from '../objects/interfaces';
import {TYPES} from '../objects/types';
import {FirebaseRef} from '../objects/dbSync/FirebaseRef';
import {TreeLoader} from './treeLoader';
import {expect} from 'chai'

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
    it('Should mark an id as loaded after being loaded', () => {

    })
})
