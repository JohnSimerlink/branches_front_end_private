// tslint:disable object-literal-sort-keys
import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {myContainer} from '../../inversify.config';
import {MutableSubscribableContent} from '../objects/content/MutableSubscribableContent';
import {MutableSubscribableContentUser} from '../objects/contentUser/MutableSubscribableContentUser';
import {SubscribableMutableField} from '../objects/field/SubscribableMutableField';
import {
    CONTENT_TYPES, ContentPropertyMutationTypes, ContentPropertyNames,
    ContentUserPropertyMutationTypes,
    ContentUserPropertyNames, FieldMutationTypes,
    IApp, IGlobalDatedMutation, IMutableSubscribableContentStore,
     IMutableSubscribableContentUserStore,
    IMutableSubscribableGlobalStore, IMutableSubscribablePoint, IMutableSubscribableTreeLocation,
    IMutableSubscribableTreeLocationStore, IMutableSubscribableTreeStore,
    IMutableSubscribableTreeUser, IMutableSubscribableTreeUserStore,
    IProficiencyStats, ISigmaNode, ISigmaNodesUpdater, ISigmaRenderManager, ISubscribableContentStoreSource,
    ISubscribableContentUserStoreSource,
    ISubscribableStoreSource,
    ISubscribableTreeLocationStoreSource,
    ISubscribableTreeStoreSource, ISubscribableTreeUserStoreSource,
    IUI,
    ObjectTypes, PointMutationTypes, TreeLocationPropertyMutationTypes, TreeLocationPropertyNames,
    TreeUserPropertyMutationTypes, TreeUserPropertyNames,
} from '../objects/interfaces';
import {MutableSubscribablePoint} from '../objects/point/MutableSubscribablePoint';
import {PROFICIENCIES} from '../objects/proficiency/proficiencyEnum';
import {CanvasUI} from '../objects/sigmaNode/CanvasUI';
import {SigmaNodesUpdater} from '../objects/sigmaNode/SigmaNodesUpdater';
import {MutableSubscribableContentStore} from '../objects/stores/content/MutableSubscribableContentStore';
import {MutableSubscribableContentUserStore} from '../objects/stores/contentUser/MutableSubscribableContentUserStore';
import {MutableSubscribableGlobalStore} from '../objects/stores/MutableSubscribableGlobalStore';
import {MutableSubscribableTreeLocationStore} from '../objects/stores/treeLocation/MutableSubscribableTreeLocationStore';
import {MutableSubscribableTreeUserStore} from '../objects/stores/treeUser/MutableSubscribableTreeUserStore';
import {MutableSubscribableTreeLocation} from '../objects/treeLocation/MutableSubscribableTreeLocation';
import {MutableSubscribableTreeUser} from '../objects/treeUser/MutableSubscribableTreeUser';
import {TYPES} from '../objects/types';
import {CONTENT_ID, getSigmaIdsForContentId, SIGMA_ID1, SIGMA_ID2} from '../testHelpers/testHelpers';
import {App} from './app';
// TODO: separate integration tests into a separate coverage runner, so that coverages don't get comingled
test('App integration test 1 - mutations -> modifying sigmaNode::::::' +
    'Adding a mutation into the global stores for a content user data,' +
    ' should update the sigma node instance for all sigma nodes containing that content id', t => {
    // canvasUI
    const sigmaNode1 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
    const sigmaNode2 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
    const sigmaNodes = {}
    sigmaNodes[SIGMA_ID1] = sigmaNode1
    sigmaNodes[SIGMA_ID2] = sigmaNode2
    const sigmaRenderManager: ISigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
    const sigmaNodesUpdater: ISigmaNodesUpdater = new SigmaNodesUpdater(
        {
            getSigmaIdsForContentId, sigmaNodes,
            sigmaRenderManager
        })

    // contentUserStore
    const contentId = CONTENT_ID
    const overdue = new SubscribableMutableField<boolean>({field: false})
    const lastRecordedStrength = new SubscribableMutableField<number>({field: 45})
    const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
    const timer = new SubscribableMutableField<number>({field: 30})
    const contentUser = new MutableSubscribableContentUser({
        lastRecordedStrength, overdue, proficiency, timer, updatesCallbacks: [],
    })
    const contentUserStore: IMutableSubscribableContentUserStore = (() => {
        const storeSource: ISubscribableContentUserStoreSource
            = myContainer.get<ISubscribableContentUserStoreSource>
        (TYPES.ISubscribableContentStoreSource)
        storeSource.set(contentId, contentUser)
        return new MutableSubscribableContentUserStore({
            storeSource,
            updatesCallbacks: []
        })
    })()

    const treeStore: IMutableSubscribableTreeStore =
        myContainer.get<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore)

    const treeUserStore: IMutableSubscribableTreeUserStore =
        myContainer.get<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore)

    const treeLocationStore: IMutableSubscribableTreeLocationStore =
        myContainer.get<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore)

    const contentStore: IMutableSubscribableContentStore =
        myContainer.get<IMutableSubscribableContentStore>(TYPES.IMutableSubscribableContentStore)

    const store: IMutableSubscribableGlobalStore =
        new MutableSubscribableGlobalStore(
            {updatesCallbacks: [], contentUserStore, treeStore, treeLocationStore, treeUserStore, contentStore})

    const canvasUI: IUI = new CanvasUI({sigmaNodesUpdater})
    const UIs = [canvasUI]

    // create app
    const app: IApp = new App({UIs, store})

    app.start()
    const mutation: IGlobalDatedMutation<ContentUserPropertyMutationTypes> = {
        objectType: ObjectTypes.CONTENT_USER,
        id: contentId,
        propertyName: ContentUserPropertyNames.OVERDUE,
        type: FieldMutationTypes.SET,
        data: true,
        timestamp: Date.now(),
    }
    expect(sigmaNode1.overdue).to.not.equal(true)
    expect(sigmaNode2.overdue).to.not.equal(true)
    store.addMutation(mutation)
    expect(sigmaNode1.overdue).to.equal(true)
    t.pass()
})
test('Adding a mutation into the global stores for a content data,' +
    ' should update the sigma node instance for all sigma nodes containing that content id', t => {
    // canvasUI
    const sigmaNode1 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
    const sigmaNode2 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
    const sigmaNodes = {}
    sigmaNodes[SIGMA_ID1] = sigmaNode1
    sigmaNodes[SIGMA_ID2] = sigmaNode2
    const sigmaRenderManager: ISigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
    const sigmaNodesUpdater: ISigmaNodesUpdater = new SigmaNodesUpdater(
        {
            getSigmaIdsForContentId, sigmaNodes,
            sigmaRenderManager
        })

    // contentStore
    const contentId = CONTENT_ID
    const type = new SubscribableMutableField<CONTENT_TYPES>({field: CONTENT_TYPES.FACT})
    const question = new SubscribableMutableField<string>({field: 'What is capital of Ohio?'})
    const answer = new SubscribableMutableField<string>({field: 'Columbus'})
    const title = new SubscribableMutableField<string>({field: ''})
    const content = new MutableSubscribableContent({
        type, question, answer, title, updatesCallbacks: [],
    })
    const contentUserStore: IMutableSubscribableContentUserStore = (() => {

        const storeSource: ISubscribableContentUserStoreSource
            = myContainer.get<ISubscribableContentUserStoreSource>
        (TYPES.ISubscribableContentUserStoreSource)
        return new MutableSubscribableContentUserStore({
            storeSource,
            updatesCallbacks: []
        })
    })()

    const treeStore: IMutableSubscribableTreeStore =
        myContainer.get<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore)

    const treeUserStore: IMutableSubscribableTreeUserStore =
        myContainer.get<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore)

    const treeLocationStore: IMutableSubscribableTreeLocationStore =
        myContainer.get<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore)

    const contentStore: IMutableSubscribableContentStore = (() => {
        const storeSource: ISubscribableContentStoreSource
            = myContainer.get<ISubscribableContentStoreSource>
        (TYPES.ISubscribableContentStoreSource)
        storeSource.set(contentId, content)
        return new MutableSubscribableContentStore({
            storeSource,
            updatesCallbacks: []
        })
    })()

    const store: IMutableSubscribableGlobalStore =
        new MutableSubscribableGlobalStore(
            {updatesCallbacks: [], contentUserStore, treeStore, treeUserStore, treeLocationStore, contentStore})

    const canvasUI: IUI = new CanvasUI({sigmaNodesUpdater})
    const UIs = [canvasUI]

    // create app
    const app: IApp = new App({UIs, store})

    app.start()
    const newAnswer = 'Columbus!!'
    const mutation: IGlobalDatedMutation<ContentPropertyMutationTypes> = {
        objectType: ObjectTypes.CONTENT,
        id: contentId,
        propertyName: ContentPropertyNames.ANSWER,
        type: FieldMutationTypes.SET,
        data: newAnswer,
        timestamp: Date.now(),
    }
    const contentStoreAddMutationSpy = sinon.spy(contentStore, 'addMutation')
    expect(sigmaNode1.content.answer).to.not.equal(newAnswer)
    expect(sigmaNode2.content.answer).to.not.equal(newAnswer)
    store.addMutation(mutation)
    expect(contentStoreAddMutationSpy.callCount).to.equal(1)
    expect(sigmaNode1.content.answer).to.equal(newAnswer)
    expect(sigmaNode2.content.answer).to.equal(newAnswer)
    t.pass()
})
//
test('Adding a mutation into the global stores for a tree user data,' +
    ' should update the sigma node instance for the sigma node for that tree Id', t => {
    // canvasUI
    const sigmaNode1 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
    const sigmaNodes = {}
    const TREE_ID = 'babababa'
    const SIGMA_ID = TREE_ID
    sigmaNodes[SIGMA_ID] = sigmaNode1
    const sigmaRenderManager: ISigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
    const sigmaNodesUpdater: ISigmaNodesUpdater = new SigmaNodesUpdater(
        {
            getSigmaIdsForContentId, sigmaNodes,
            sigmaRenderManager
        })

    // contentStore
    const proficiencyStatsVal: IProficiencyStats = {
        UNKNOWN: 3,
        ONE: 2,
        TWO: 3,
        THREE: 4,
        FOUR: 2,
    }
    const newProficiencyStatsVal: IProficiencyStats = {
        UNKNOWN: 7,
        ONE: 2,
        TWO: 5,
        THREE: 4,
        FOUR: 2,
    }
    const aggregationTimerVal = 54
    const proficiencyStats = new SubscribableMutableField<IProficiencyStats>({field: proficiencyStatsVal})
    const aggregationTimer = new SubscribableMutableField<number>({field: aggregationTimerVal})
    const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer})

    const contentUserStore: IMutableSubscribableContentUserStore =
        myContainer.get<IMutableSubscribableContentUserStore>(TYPES.IMutableSubscribableContentUserStore)

    const treeStore: IMutableSubscribableTreeStore =
        myContainer.get<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore)

    const treeLocationStore: IMutableSubscribableTreeLocationStore =
        myContainer.get<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore)

    const treeUserStore: IMutableSubscribableTreeUserStore = (() => {

        const storeSource: ISubscribableTreeUserStoreSource
            = myContainer.get<ISubscribableTreeUserStoreSource>
        (TYPES.ISubscribableTreeUserStoreSource)
        storeSource.set(TREE_ID, treeUser)
        return new MutableSubscribableTreeUserStore({
            storeSource,
            updatesCallbacks: []
        })
    })()

    const contentStore: IMutableSubscribableContentStore =
        myContainer.get<IMutableSubscribableContentStore>(TYPES.IMutableSubscribableContentStore)

    const store: IMutableSubscribableGlobalStore =
        new MutableSubscribableGlobalStore(
            {updatesCallbacks: [], contentUserStore, treeStore, treeUserStore, treeLocationStore, contentStore})

    const canvasUI: IUI = new CanvasUI({sigmaNodesUpdater})
    const UIs = [canvasUI]

    // create app
    const app: IApp = new App({UIs, store})

    app.start()
    const newAnswer = 'Columbus!!'
    const mutation: IGlobalDatedMutation<TreeUserPropertyMutationTypes> = {
        objectType: ObjectTypes.TREE_USER,
        id: TREE_ID,
        propertyName: TreeUserPropertyNames.PROFICIENCY_STATS,
        type: FieldMutationTypes.SET,
        data: newProficiencyStatsVal,
        timestamp: Date.now(),
    }
    expect(sigmaNode1.proficiencyStats).to.not.deep.equal(newProficiencyStatsVal)
    store.addMutation(mutation)
    expect(sigmaNode1.proficiencyStats).to.deep.equal(newProficiencyStatsVal)
    t.pass()
})

test('Adding a mutation into the global stores for a tree location data,' +
    ' should update the sigma node instance for the sigma node for that tree Id', t => {
    // canvasUI
    const sigmaNode1 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
    const sigmaNodes = {}
    const TREE_ID = 'babababa'
    const SIGMA_ID = TREE_ID
    sigmaNodes[SIGMA_ID] = sigmaNode1
    const sigmaRenderManager: ISigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
    const sigmaNodesUpdater: ISigmaNodesUpdater = new SigmaNodesUpdater(
        {
            getSigmaIdsForContentId, sigmaNodes,
            sigmaRenderManager
        })

    const treeId = TREE_ID
    const FIRST_POINT_VALUE = {x: 5, y: 7}
    const MUTATION_VALUE = {delta: {x: 3, y: 4}}
    const SECOND_POINT_VALUE = {
        x: FIRST_POINT_VALUE.x + MUTATION_VALUE.delta.x,
        y: FIRST_POINT_VALUE.y + MUTATION_VALUE.delta.y
    }
    const point: IMutableSubscribablePoint
        = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})

    const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})

    const contentUserStore: IMutableSubscribableContentUserStore =
        myContainer.get<IMutableSubscribableContentUserStore>(TYPES.IMutableSubscribableContentUserStore)

    const treeStore: IMutableSubscribableTreeStore =
        myContainer.get<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore)

    const treeUserStore: IMutableSubscribableTreeUserStore =
        myContainer.get<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore)

    const contentStore: IMutableSubscribableContentStore =
        myContainer.get<IMutableSubscribableContentStore>(TYPES.IMutableSubscribableContentStore)

    const treeLocationStore: IMutableSubscribableTreeLocationStore = (() => {
        const storeSource: ISubscribableTreeLocationStoreSource
            = myContainer.get<ISubscribableTreeLocationStoreSource>
        (TYPES.ISubscribableTreeLocationStoreSource)
        storeSource.set(treeId, treeLocation)

        return new MutableSubscribableTreeLocationStore({
            storeSource,
            updatesCallbacks: []
        })
    })()

    const store: IMutableSubscribableGlobalStore =
        new MutableSubscribableGlobalStore(
            {updatesCallbacks: [], contentUserStore, treeStore, treeUserStore, treeLocationStore, contentStore})

    const canvasUI: IUI = new CanvasUI({sigmaNodesUpdater})
    const UIs = [canvasUI]

    // create app
    const app: IApp = new App({UIs, store})

    app.start()
    const newAnswer = 'Columbus!!'
    const mutation: IGlobalDatedMutation<TreeLocationPropertyMutationTypes> = {
        objectType: ObjectTypes.TREE_LOCATION,
        id: TREE_ID,
        propertyName: TreeLocationPropertyNames.POINT,
        type: PointMutationTypes.SHIFT,
        data: MUTATION_VALUE,
        timestamp: Date.now(),
    }
    expect(sigmaNode1.x).to.not.deep.equal(SECOND_POINT_VALUE.x)
    expect(sigmaNode1.y).to.not.deep.equal(SECOND_POINT_VALUE.y)

    store.addMutation(mutation)

    expect(sigmaNode1.x).to.deep.equal(SECOND_POINT_VALUE.x)
    expect(sigmaNode1.y).to.deep.equal(SECOND_POINT_VALUE.y)
    t.pass()
})

/*
        const treeLocationStoreAddMutationSpy = sinon.spy(treeLocationStore, 'addMutation')
        const treeLocationAddMutationSpy = sinon.spy(treeLocation, 'addMutation')
        const proficiencyStatsAddMutationSpy = sinon.spy(proficiencyStats, 'addMutation')
        const treeLocationStoreCallCallbacksSpy = sinon.spy(treeLocationStore, 'callCallbacks')
        const treeLocationCallCallbacksSpy = sinon.spy(treeLocation, 'callCallbacks')
        const proficiencyStatsCallCallbacksSpy = sinon.spy(proficiencyStats, 'callCallbacks')
        expect(sigmaNode1.proficiencyStats).to.not.deep.equal(newProficiencyStatsVal)
        expect(sigmaNode2.proficiencyStats).to.not.deep.equal(newProficiencyStatsVal)
        storeSource.addMutation(mutation)
        expect(treeLocationStoreAddMutationSpy.callCount).to.equal(1)
        expect(treeLocationAddMutationSpy.callCount).to.equal(1)
        expect(proficiencyStatsAddMutationSpy.callCount).to.equal(1)
        expect(proficiencyStatsCallCallbacksSpy.callCount).to.equal(1)
        expect(treeLocationCallCallbacksSpy.callCount).to.equal(1)
        expect(treeLocationStoreCallCallbacksSpy.callCount).to.equal(1)
        expect(sigmaNode1.proficiencyStats).to.deep.equal(newProficiencyStatsVal)
        expect(sigmaNode2.proficiencyStats).to.deep.equal(newProficiencyStatsVal)

 */
