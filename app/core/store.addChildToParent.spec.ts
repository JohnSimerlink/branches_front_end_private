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
    // mockFirebaseReferences, myContainerLoadAllModulesExceptTreeStoreSourceSingletonAndFirebaseRefs,
    myContainerLoadAllModulesExceptFirebaseRefs, mockFirebaseReferences,
} from '../../inversify.config';
import BranchesStore, {BranchesStoreArgs, MUTATION_NAMES} from './store'
import {TYPES} from '../objects/types';
import {error} from './log'
import {log} from './log'
import {Store} from 'vuex';
import {AppContainer} from './appContainer';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {
    id,
    IMutableSubscribableTreeStore,
    ISubscribableTreeStoreSource, ISyncableMutableSubscribableTree, ITreeDataWithoutId,
    ObjectDataTypes
} from '../objects/interfaces';
import {SubscribableTreeStoreSource, SubscribableTreeStoreSourceArgs} from '../objects/stores/SubscribableStoreSource';
import {TreeDeserializer} from '../loaders/tree/TreeDeserializer';
import {ContainerModule, interfaces} from 'inversify';
import {TAGS} from '../objects/tags';
import {createTreeId} from '../objects/tree/TreeUtils';
// import Graph = SigmaJs.Graph;
// import Edge = SigmaJs.Edge;
// import Sigma = SigmaJs.Sigma;

test('App integration test 4 - BranchesStore mutation add new child treeId to parent' +
    ' children set should update the value in the appropriate firebase ref', async (t) => {

    /** Swap out actual firebase refs with Mock firebase refs.
     *
     */
    myContainer.load(mockFirebaseReferences)
    myContainerLoadAllModulesExceptFirebaseRefs()
    /**
     * Set up data for the test
     */
    const sampleChildId1 = 'sampleChildId1'
    const sampleChildId2 = 'sampleChildId2'
    const children = [sampleChildId1, sampleChildId2]
    const parentTreeData: ITreeDataWithoutId = {
        children,
        contentId: 'sampleContentId',
        parentId: 'sapleParentId', // newParentId,
    }
    const parentTreeId = createTreeId(parentTreeData)
    const aChildId: id = 'ChildIdToAdd31209845abcabca'

    /**
     * Grab the store singleton with which we will create the action
     * @type {Store<any>}
     */
    const store: Store<any> = myContainer.get<BranchesStore>(TYPES.BranchesStore) as Store<any>
    /**
     * Set up spy - spy on the firebase ref.
     * the action on the store should trigger a database update on this firebase ref
     */
    const parentTreeRef = mockTreesRef.child(parentTreeId)
    const parentTreeChildrenPropertyRef = parentTreeRef.child('children')
    const parentTreeChildrenPropertyRefUpdateSpy = sinon.spy(parentTreeChildrenPropertyRef, 'update')

    /**
     * Start the app
     */
    const appContainer = myContainer.get<AppContainer>(TYPES.AppContainer)
    appContainer.start()
    /**
     * initialize sigma to avoid refresh on null error
     */
    store.commit(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE_IF_NOT_INITIALIZED)
    /**
     * get data in the store source and with syncers
     */
    store.commit(MUTATION_NAMES.CREATE_TREE, parentTreeData )
    /**
     * Do the actual commit we are testing
     */
    store.commit(MUTATION_NAMES.ADD_CHILD_TO_PARENT, {parentTreeId, childTreeId: aChildId})

    expect(parentTreeChildrenPropertyRefUpdateSpy.callCount).to.deep.equal(1)
    const calledWith = parentTreeChildrenPropertyRefUpdateSpy.getCall(0).args[0]
    const expectedCalledWith = {
        val: {
            [aChildId]: true,
            [sampleChildId1]: true,
            [sampleChildId2]: true,
        }
    }
    expect(calledWith).to.deep.equal(expectedCalledWith)

    t.pass()
})
