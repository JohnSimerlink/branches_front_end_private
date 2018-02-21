import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
import {injectionWorks} from '../testHelpers/testHelpers';
import BranchesStore, {BranchesStoreArgs, MUTATION_NAMES} from './store2';
import {
    CONTENT_TYPES,
    IContentData,
    IContentUser, IContentUserData, ICreateMutation, IGlobalMutation, IMutableSubscribableGlobalStore,
    ITreeDataWithoutId, ITreeLocationData, IVuexStore,
    ObjectTypes, STORE_MUTATION_TYPES
} from '../objects/interfaces';
import {
    mockFirebaseReferences, myContainer, myContainerLoadAllModules,
    myContainerLoadAllModulesExceptFirebaseRefs
} from '../../inversify.config';
import {TYPES} from '../objects/types';
import {expect} from 'chai'
import test from 'ava'
const globalAny: any = global
import {log} from './log'
import {partialInject} from '../testHelpers/partialInject';
import * as sinon from 'sinon'
import {Store} from 'vuex';
import {PROFICIENCIES} from '../objects/proficiency/proficiencyEnum';
import {ContentUserData} from '../objects/contentUser/ContentUserData';

// NOTE don't worry about the injection works for store2
test('Store::: ' +
    ' DI constructor should work', (t) => {

    myContainerLoadAllModules()
    // log('global window is', globalAny.window)
    const injects = injectionWorks<BranchesStoreArgs, BranchesStore>({
        container: myContainer,
        argsType: TYPES.BranchesStoreArgs,
        interfaceType: TYPES.BranchesStore,
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('Store::::' +
    ' MUTATIONS CREATE_CONTENT_USER_DATA', (t) => {
    myContainerLoadAllModules()
    // log('global window is', globalAny.window)
    // WHY I couldn't just do a normal
    // raw javascript object and sinon spy that I don't know . . .
    class GlobalDataStoreMock {
        public addMutation(mutation: IGlobalMutation) {
            log('addMutation called')
            return void 0
        }
    }
    const globalDataStore: IMutableSubscribableGlobalStore
        = new GlobalDataStoreMock() as IMutableSubscribableGlobalStore
    const store: Store<any> = partialInject<BranchesStoreArgs>({
        konstructor: BranchesStore,
        constructorArgsType: TYPES.BranchesStoreArgs,
        injections: {globalDataStore},
        container: myContainer
    }) as Store<any>
    const globalDataStoreAddMutationSpy = sinon.spy(globalDataStore, 'addMutation')

    const overdueVal = true
    const lastRecordedStrengthVal = 30
    const proficiencyVal = PROFICIENCIES.TWO
    const timerVal = 30
    const id = 'abcde_12345'

    const nextReviewTimeVal = Date.now() + 1000 * 60
    const lastInteractionTimeVal = Date.now()
    const contentUserData: IContentUserData = {
        id,
        overdue: overdueVal,
        lastRecordedStrength: lastRecordedStrengthVal,
        proficiency: proficiencyVal,
        timer: timerVal,
        nextReviewTime: nextReviewTimeVal,
        lastInteractionTime: lastInteractionTimeVal,
    }

    const createMutation: ICreateMutation<ContentUserData> = {
        id,
        data: contentUserData,
        objectType: ObjectTypes.CONTENT_USER,
        type: STORE_MUTATION_TYPES.CREATE_ITEM,
    }
    store.commit(
        MUTATION_NAMES.CREATE_CONTENT_USER_DATA,
        {
            contentUserId: id,
            contentUserData
        }
    )

    expect(globalDataStoreAddMutationSpy.callCount).to.deep.equal(1)
    // expect(globalDataStoreAddMutationSpy).to.deep.equal(1)
    const calledWith = globalDataStoreAddMutationSpy.getCall(0).args[0]
    expect(calledWith).to.deep.equal(createMutation)

    t.pass()
})
test('Store::::' +
    ' MUTATIONS CREATE_CONTENT: should call globalDataStore with the correct args', (t) => {

    myContainerLoadAllModules()
    // log('global window is', globalAny.window)
    // WHY I couldn't just do a normal
    // raw javascript object and sinon spy that I don't know . . .
    class GlobalDataStoreMock {
        public addMutation(mutation: IGlobalMutation) {
            log('addMutation called')
            return void 0
        }
    }
    const globalDataStore: IMutableSubscribableGlobalStore
        = new GlobalDataStoreMock() as IMutableSubscribableGlobalStore
    const store: Store<any> = partialInject<BranchesStoreArgs>({
        konstructor: BranchesStore,
        constructorArgsType: TYPES.BranchesStoreArgs,
        injections: {globalDataStore},
        container: myContainer
    }) as Store<any>
    const globalDataStoreAddMutationSpy = sinon.spy(globalDataStore, 'addMutation')

    // const overdueVal = true
    // const lastRecordedStrengthVal = 30
    // const proficiencyVal = PROFICIENCIES.TWO
    // const timerVal = 30
    // const id = 'abcde_12345'

    const question = 'What is the capital of Ohio?'
    const answer = 'Columbus'
    const title = ''
    const type = CONTENT_TYPES.FACT
    const contentData: IContentData = {
        question,
        answer,
        type,
        title
    }

    const createMutation: ICreateMutation<IContentData> = {
        objectType: ObjectTypes.CONTENT,
        type: STORE_MUTATION_TYPES.CREATE_ITEM,
        // id,
        data: contentData,
    }
    store.commit(
        MUTATION_NAMES.CREATE_CONTENT,
        {
            ...contentData
        }
    )

    expect(globalDataStoreAddMutationSpy.callCount).to.deep.equal(1)
    // expect(globalDataStoreAddMutationSpy).to.deep.equal(1)
    const calledWith = globalDataStoreAddMutationSpy.getCall(0).args[0]
    expect(calledWith).to.deep.equal(createMutation)

    t.pass()
})
test('Store::::' +
    ' MUTATIONS CREATE_TREE: should call globalDataStore with the correct args', (t) => {

    myContainerLoadAllModules()
    // log('global window is', globalAny.window)
    // WHY I couldn't just do a normal
    // raw javascript object and sinon spy that I don't know . . .
    class GlobalDataStoreMock {
        public addMutation(mutation: IGlobalMutation) {
            log('addMutation called')
            return void 0
        }
    }
    const globalDataStore: IMutableSubscribableGlobalStore
        = new GlobalDataStoreMock() as IMutableSubscribableGlobalStore
    const store: Store<any> = partialInject<BranchesStoreArgs>({
        konstructor: BranchesStore,
        constructorArgsType: TYPES.BranchesStoreArgs,
        injections: {globalDataStore},
        container: myContainer
    }) as Store<any>
    const globalDataStoreAddMutationSpy = sinon.spy(globalDataStore, 'addMutation')

    const contentId = '12334234'
    const parentId = '43285'
    const children = ['23487', '2304985']
    const treeDataWithoutId: ITreeDataWithoutId = {
        contentId,
        parentId,
        children,
    }

    const createMutation: ICreateMutation<ITreeDataWithoutId> = {
        objectType: ObjectTypes.TREE,
        type: STORE_MUTATION_TYPES.CREATE_ITEM,
        // id,
        data: treeDataWithoutId,
    }
    store.commit(
        MUTATION_NAMES.CREATE_TREE,
        {
            ...treeDataWithoutId
        }
    )

    expect(globalDataStoreAddMutationSpy.callCount).to.deep.equal(1)
    // expect(globalDataStoreAddMutationSpy).to.deep.equal(1)
    const calledWith = globalDataStoreAddMutationSpy.getCall(0).args[0]
    expect(calledWith).to.deep.equal(createMutation)

    t.pass()
})
test('Store::::' +
    ' MUTATIONS CREATE_TREE_LOCATION: should call globalDataStore with the correct args', (t) => {

    myContainerLoadAllModules()
    // log('global window is', globalAny.window)
    // WHY I couldn't just do a normal
    // raw javascript object and sinon spy that I don't know . . .
    class GlobalDataStoreMock {
        public addMutation(mutation: IGlobalMutation) {
            log('addMutation called')
            return void 0
        }
    }
    const globalDataStore: IMutableSubscribableGlobalStore
        = new GlobalDataStoreMock() as IMutableSubscribableGlobalStore
    const store: Store<any> = partialInject<BranchesStoreArgs>({
        konstructor: BranchesStore,
        constructorArgsType: TYPES.BranchesStoreArgs,
        injections: {globalDataStore},
        container: myContainer
    }) as Store<any>
    const globalDataStoreAddMutationSpy = sinon.spy(globalDataStore, 'addMutation')

    //
    // const contentId = '12334234'
    // const parentId = '43285'

    // const children = ['23487', '2304985']
    const treeId = '129874'
    const id = treeId
    const x = 123214
    const y = 13214
    const point = { x, y}
    const treeLocationData: ITreeLocationData = {
        point
    }
    const createMutation: ICreateMutation<ITreeLocationData> = {
        objectType: ObjectTypes.TREE_LOCATION,
        type: STORE_MUTATION_TYPES.CREATE_ITEM,
        id,
        data: treeLocationData,
    }
    store.commit(
        MUTATION_NAMES.CREATE_TREE_LOCATION,
        {
            x, y, treeId
        }
    )

    expect(globalDataStoreAddMutationSpy.callCount).to.deep.equal(1)
    // expect(globalDataStoreAddMutationSpy).to.deep.equal(1)
    const calledWith = globalDataStoreAddMutationSpy.getCall(0).args[0]
    expect(calledWith).to.deep.equal(createMutation)

    t.pass()
})
test('store test', t => t.pass())
