import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
import {
    mockContentRef,
    mockFirebaseReferences, mockTreeLocationsRef, mockTreesRef, myContainer,
    myContainerLoadAllModulesExceptFirebaseRefs
} from '../../inversify.config';
import {Store} from 'vuex';
import BranchesStore, {MUTATION_NAMES} from './store2';
import {TYPES} from '../objects/types';
import * as sinon from 'sinon'
import {
    CONTENT_TYPES, IContentData, IContentDataFromDB,
    ICreateTreeLocationMutationArgs, INewChildTreeMutationArgs, ISet, ITreeDataFromFirebase, ITreeDataWithoutId,
    ITreeLocationData,
    TreeLocationPropertyNames, TreePropertyNames, IHash
} from '../objects/interfaces';
import {AppContainer} from './appContainer';
import {expect} from 'chai'
import test from 'ava'
import {getContentId} from '../loaders/contentUser/ContentUserLoaderUtils';
import {createContentId} from '../objects/content/contentUtils';
import {createTreeId} from '../objects/tree/TreeUtils';
import {log} from './log'

test('store create new child tree should call correct firebaseRefs with correct new data', t => {
    console.log('test started!')
    /** Swap out actual firebase refs with Mock firebase refs.
     *
     */
    myContainer.load(mockFirebaseReferences)
    myContainerLoadAllModulesExceptFirebaseRefs()
    /**
     * Set up data
     */
    /**
     * Grab the store singleton with which we will create the action
     * @type {Store<any>}
     */
    const store: Store<any> = myContainer.get<BranchesStore>(TYPES.BranchesStore) as Store<any>
    /**
     * Set up spy - spy on the firebase ref.
     * the action on the store should trigger a database update on this firebase ref
     */
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
     * load in parenttreeData to prevent errors
     * get data in the store source and with syncers
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
    store.commit(MUTATION_NAMES.CREATE_TREE, parentTreeData )

    /**
     * test the actual mutation we are testing
     */
    const question = 'What is hte capital of Ohio?'
    const answer = 'Columbus'
    const type = CONTENT_TYPES.FACT
    const newContentData: IContentData = {
        type,
        question,
        answer
    }
    const newContentDataInDb: IContentDataFromDB = {
        type: {
            val: type,
        },
        question: {
            val: question,
        },
        answer: {
            val: answer
        },
        title: {
            val: null,
        }
    }
    const newChildTreeMutationArgs: INewChildTreeMutationArgs = {
        parentTreeId,
        timestamp: Date.now(),
        contentType: type,
        question,
        answer,
        title: null,
        parentX: 5,
        parentY: 7,
    }
    const contentId = createContentId(newContentData)
    const contentLocationRef = mockContentRef.child(contentId)
    const contentLocationRefUpdateSpy = sinon.spy(contentLocationRef, 'update')

    const childTreeDataWithoutId = {
        contentId,
        parentId: parentTreeId
    }
    const childTreeId = createTreeId(childTreeDataWithoutId)
    const treeRef = mockTreesRef.child(childTreeId)
    const treeRefUpdateSpy = sinon.spy(treeRef, 'update')

    const treeLocationRef = mockTreeLocationsRef.child(childTreeId)
    const treeLocationRefUpdateSpy = sinon.spy(treeLocationRef, 'update')

    const parentTreeRef = mockTreesRef.child(parentTreeId)
    const parentTreeRefChildren = parentTreeRef.child('children' /* TreePropertyNames.CHILDREN */ )
    const parentTreeRefChildrenUpdateSpy = sinon.spy(parentTreeRefChildren, 'update')
    store.commit(MUTATION_NAMES.NEW_CHILD_TREE, newChildTreeMutationArgs )

    // CHECK 1: Check that content item was created in db
    expect(contentLocationRefUpdateSpy.callCount).to.deep.equal(1)
    const calledWith = contentLocationRefUpdateSpy.getCall(0).args[0]
    const expectedCalledWith = newContentDataInDb
    expect(calledWith).to.deep.equal(expectedCalledWith)

    // CHECK 2a: Check that treeItem was added to db
    expect(treeRefUpdateSpy.callCount).to.deep.equal(1)
    const calledWith2 = treeRefUpdateSpy.getCall(0).args[0]
    const expectedCalledWith2: ITreeDataFromFirebase = {
        contentId: {
            val: contentId,
        },
        parentId: {
            val: parentTreeId,
        },
        children: {
            val: {} // TODO << change this to {}
        }
    }
    expect(calledWith2).to.deep.equal(expectedCalledWith2)

    // CHECK 2b: Check that treeItemLocation was added to db
    expect(treeLocationRefUpdateSpy.callCount).to.deep.equal(1)
    // const calledWith3 = treeRefUpdateSpy.getCall(0).args[0]

    // CHECK 3: Check that newChild tree was added as a child of the parentTree
    log('parentTreeRefChildren is ', parentTreeRefChildren)
    expect(parentTreeRefChildrenUpdateSpy.callCount).to.deep.equal(1)
    const calledWith3 = parentTreeRefChildrenUpdateSpy.getCall(0).args[0]
    const expectedCalledWith3Val: IHash<boolean> = {
        [childTreeId]: true,
        [sampleChildId1]: true,
        [sampleChildId2]: true
    }
    const expectedCalledWith3 = {
        val: expectedCalledWith3Val
    }
    expect(calledWith3).to.deep.equal(expectedCalledWith3)

    t.pass()

})
