import {
    mockFirebaseReferences, mockTreeLocationsRef, myContainer,
    myContainerLoadAllModulesExceptFirebaseRefs
} from '../../inversify.config';
import {Store} from 'vuex';
import BranchesStore, {MUTATION_NAMES} from './store2';
import {TYPES} from '../objects/types';
import * as sinon from 'sinon'
import {ITreeLocationData, TreeLocationPropertyNames} from '../objects/interfaces';
import {AppContainer} from './appContainer';
import {expect} from 'chai'
import test from 'ava'

test('store create location should call correct firebaseRef', t => {
    /**
     * Set up data
     */
    const treeId = '123abcde3'
    const x = 5
    const y = 7
    const treeLocationData: ITreeLocationData = {
        point: {
            x,
            y
        }
    }
    /** Swap out actual firebase refs with Mock firebase refs.
     *
     */
    myContainer.load(mockFirebaseReferences)
    myContainerLoadAllModulesExceptFirebaseRefs()
    /**
     * Grab the store singleton with which we will create the action
     * @type {Store<any>}
     */
    const store: Store<any> = myContainer.get<BranchesStore>(TYPES.BranchesStore) as Store<any>
    /**
     * Set up spy - spy on the firebase ref.
     * the action on the store should trigger a database update on this firebase ref
     */
    const treeLocationRef = mockTreeLocationsRef.child(treeId)
    const treeLocationPointPropertyRef = treeLocationRef.child(TreeLocationPropertyNames.POINT)
    const treeLocationPointPropertyRefUpdateSpy = sinon.spy(treeLocationPointPropertyRef, 'update')

    /**
     * Start the app
     */
    const appContainer = myContainer.get<AppContainer>(TYPES.AppContainer)
    appContainer.start()
    /**
     * initialize sigma to avoid refresh on null error
     */
    store.commit(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE)
    /**
     * test the actual mutation we are testing
     */
    store.commit(MUTATION_NAMES.CREATE_TREE_LOCATION, treeLocationData )

    expect(treeLocationPointPropertyRefUpdateSpy.callCount).to.deep.equal(1)
    const calledWith = treeLocationPointPropertyRefUpdateSpy.getCall(0).args[0]
    const expectedCalledWith = {
        val: {
            x,
            y
        }
    }
    expect(calledWith).to.deep.equal(expectedCalledWith)

    t.pass()

})
