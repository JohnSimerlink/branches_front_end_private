import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
const windowAny: any = global
windowAny.requestAnimationFrame = (cb) => cb()
import test from 'ava'
import {expect} from 'chai'
import {MockFirebase} from 'firebase-mock'
import * as sinon from 'sinon'
import {
    myContainer,
    mockTreesRef,
    mockFirebaseReferences,
} from '../../inversify.config';
import BranchesStore, {BranchesStoreArgs, MUTATION_NAMES} from './store2'
import {TYPES} from '../objects/types';
import {error} from './log'
import {log} from './log'
import {Store} from 'vuex';
import {AppContainer} from './appContainer';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
// import Graph = SigmaJs.Graph;
// import Edge = SigmaJs.Edge;
// import Sigma = SigmaJs.Sigma;

test('App integration test 4 - BranchesStore mutation add new child treeId to parent' +
    ' children set should update the value in the appropriate firebase ref', async (t) => {
    // TODO: use fake firebaseRefs
    // myContainer.unbind<)
    /* TODO: make the test super easy to set up . . .
     e.g. I don't have to set up the subscriptions myself and can just call instance.method() */
    // myContainer.unload(firebaseReferences)
    myContainer.unbind(TYPES.FirebaseReference)
    myContainer.load(mockFirebaseReferences)

    const parentTreeId = '1934879abcd19823'
    const childTreeId = '12498732578'
    const parentTreeRef = mockTreesRef.child(parentTreeId)
    const parentTreeChildrenPropertyRef = parentTreeRef.child('children')
    // const
    log('GlobalDataStore just created')
    const store: Store<any> = myContainer.get<BranchesStore>(TYPES.BranchesStore) as Store<any>

    const parentTreeChildrenPropertyRefUpdateSpy = sinon.spy(parentTreeChildrenPropertyRef, 'update')
    const appContainer = myContainer.get<AppContainer>(TYPES.AppContainer)
    appContainer.start()
    store.commit(MUTATION_NAMES.ADD_CHILD_TO_PARENT, {parentTreeId, childTreeId})

    expect(parentTreeChildrenPropertyRefUpdateSpy.callCount).to.deep.equal(1)

    t.pass()
})
