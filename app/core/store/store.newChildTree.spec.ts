import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import {
    mockContentRef,
    mockFirebaseReferences,
    mockTreeLocationsRef,
    mockTreesRef,
    myContainer,
    myContainerLoadAllModulesExceptFirebaseRefs
} from '../../../inversify.config';
import {Store} from 'vuex';
import {expect} from 'chai';
import {log} from '../log';
import {TYPES} from '../../objects/types';
import * as sinon from 'sinon';
import {IHash, IKnawledgeMapCreator, ITreeDataFromDB} from '../../objects/interfaces';
import {AppContainer} from '../appContainer';
import test from 'ava';
import {createContentId} from '../../objects/content/contentUtils';
import {createTreeId} from '../../objects/tree/TreeUtils';
import {sampleTreeData1} from '../../objects/tree/treeTestHelpers';
import {sampleContentData1, sampleContentDataFromDB1} from '../../objects/content/contentTestHelpers';
import {getASampleTreeLocation1} from '../../objects/treeLocation/treeLocationTestHelpers';
import BranchesStore from './store';
import {MUTATION_NAMES} from './STORE_MUTATION_NAMES';
import {INewChildTreeMutationArgs} from './store_interfaces';

injectFakeDom();
// import {sampleContentData1, sampleContentDataFromDB1} from '../objects/content/contentTestHelpers';

test('store create new child tree should call correct firebaseRefs with correct new data', t => {
    /** Swap out actual firebase refs with Mock firebase refs.
     *
     */
    myContainer.load(mockFirebaseReferences);
    myContainerLoadAllModulesExceptFirebaseRefs({fakeSigma: true});
    /**
     * Set up data
     */
    /**
     * Grab the store singleton with which we will create the action
     * @type {Store<any>}
     */
    const store: Store<any> = myContainer.get<BranchesStore>(TYPES.BranchesStore) as Store<any>;
    /**
     * Set up spy - spy on the firebase ref.
     * the action on the store should trigger a database update on this firebase ref
     */
    /**
     * Start the app
     */
    // const vueConfigurer = myContainer.get<IVueConfigurer>(TYPES.IVueConfigurer)
    const knawledgeMapCreator = myContainer.get<IKnawledgeMapCreator>(TYPES.IKnawledgeMapCreator);
    const appContainer = myContainer.get<AppContainer>(TYPES.AppContainer);
    appContainer.start();
    /**
     * initialize sigma to avoid refresh on null error
     */
    store.commit(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE_IF_NOT_INITIALIZED);

    /**
     * load in parenttreeData to prevent errors
     * get data in the store source and with syncers
     */
    const sampleChildId1 = 'sampleChildId1';
    const sampleChildId2 = 'sampleChildId2';
    // const children = [sampleChildId1, sampleChildId2]
    const parentTreeData = sampleTreeData1; // : ITreeDataWithoutId = {
    //     children,
    //     contentId: 'sampleContentId',
    //     parentId: 'sapleParentId', // newParentId,
    // }
    const parentTreeId = createTreeId(parentTreeData);
    store.commit(MUTATION_NAMES.CREATE_TREE, parentTreeData );

    /**
     * test the actual mutation we are testing
     */
    const newContentData = sampleContentData1;
    const newContentDataInDB = sampleContentDataFromDB1;
    const newChildTreeMutationArgs: INewChildTreeMutationArgs = {
        parentTreeId,
        timestamp: Date.now(),
        contentType: newContentData.type,
        question: newContentData.question,
        answer: newContentData.answer,
        title: null,
        parentLocation: getASampleTreeLocation1().val()
    };
    const contentId = createContentId(newContentData);
    const contentRef = mockContentRef.child(contentId);
    const contentRefUpdateSpy = sinon.spy(contentRef, 'update');

    const childTreeDataWithoutId = {
        contentId,
        parentId: parentTreeId
    };
    const childTreeId = createTreeId(childTreeDataWithoutId);
    const treeRef = mockTreesRef.child(childTreeId);
    const treeRefUpdateSpy = sinon.spy(treeRef, 'update');

    const treeLocationRef = mockTreeLocationsRef.child(childTreeId);
    const treeLocationRefUpdateSpy = sinon.spy(treeLocationRef, 'update');

    const parentTreeRef = mockTreesRef.child(parentTreeId);
    const parentTreeRefChildren = parentTreeRef.child('children' /* TreePropertyNames.CHILDREN */ );
    const parentTreeRefChildrenUpdateSpy = sinon.spy(parentTreeRefChildren, 'update');
    store.commit(MUTATION_NAMES.NEW_CHILD_TREE, newChildTreeMutationArgs );

    // CHECK 1: Check that content item was created in db
    expect(contentRefUpdateSpy.callCount).to.deep.equal(1);
    const calledWith = contentRefUpdateSpy.getCall(0).args[0];
    const expectedCalledWith = newContentDataInDB;
    expect(calledWith).to.deep.equal(expectedCalledWith);

    // CHECK 2a: Check that treeItem was added to db
    expect(treeRefUpdateSpy.callCount).to.deep.equal(1);
    const calledWith2 = treeRefUpdateSpy.getCall(0).args[0];
    const expectedCalledWith2: ITreeDataFromDB = {
        contentId: {
            val: contentId,
        },
        parentId: {
            val: parentTreeId,
        },
        children: {
            val: {} // TODO << change this to {}
        }
    };
    expect(calledWith2).to.deep.equal(expectedCalledWith2);

    // CHECK 2b: Check that treeItemLocation was added to db
    expect(treeLocationRefUpdateSpy.callCount).to.deep.equal(1);
    // const calledWith3 = treeRefUpdateSpy.getCall(0).args[0]

    // CHECK 3: Check that newChild tree was added as a child of the parentTree
    expect(parentTreeRefChildrenUpdateSpy.callCount).to.deep.equal(1);
    const calledWith3 = parentTreeRefChildrenUpdateSpy.getCall(0).args[0];
    // const expectedChildIds =
    const expectedCalledWith3Val: IHash<boolean> = {
        [childTreeId]: true
    };
    for (const id of parentTreeData.children) {
        expectedCalledWith3Val[id] = true;
    }
    const expectedCalledWith3 = {
        val: expectedCalledWith3Val
    };
    expect(calledWith3).to.deep.equal(expectedCalledWith3);

    t.pass();

});
