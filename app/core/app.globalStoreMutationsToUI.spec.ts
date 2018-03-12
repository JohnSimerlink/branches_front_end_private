// tslint:disable object-literal-sort-keys
import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../inversify.config';
import {MutableSubscribableContent} from '../objects/content/MutableSubscribableContent';
import {MutableSubscribableContentUser} from '../objects/contentUser/MutableSubscribableContentUser';
import {MutableSubscribableField} from '../objects/field/MutableSubscribableField';
import {
    CONTENT_TYPES, ContentPropertyMutationTypes, ContentPropertyNames,
    ContentUserPropertyMutationTypes,
    ContentUserPropertyNames, FieldMutationTypes,
    IApp, ITypeIdProppedDatedMutation, IMutableSubscribableContentStore,
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
    GlobalStoreObjectTypes, PointMutationTypes, TreeLocationPropertyMutationTypes, TreeLocationPropertyNames,
    TreeUserPropertyMutationTypes, TreeUserPropertyNames, IMutableSubscribableField, timestamp,
} from '../objects/interfaces';
import {MutableSubscribablePoint} from '../objects/point/MutableSubscribablePoint';
import {PROFICIENCIES} from '../objects/proficiency/proficiencyEnum';
import {CanvasUI} from '../objects/sigmaNode/CanvasUI';
import {SigmaNodesUpdater, SigmaNodesUpdaterArgs} from '../objects/sigmaNode/SigmaNodesUpdater';
import {MutableSubscribableContentStore} from '../objects/stores/content/MutableSubscribableContentStore';
import {MutableSubscribableContentUserStore} from '../objects/stores/contentUser/MutableSubscribableContentUserStore';
import {
    MutableSubscribableGlobalStore,
    MutableSubscribableGlobalStoreArgs
} from '../objects/stores/MutableSubscribableGlobalStore';
import {MutableSubscribableTreeLocationStore} from '../objects/stores/treeLocation/MutableSubscribableTreeLocationStore';
import {MutableSubscribableTreeUserStore} from '../objects/stores/treeUser/MutableSubscribableTreeUserStore';
import {MutableSubscribableTreeLocation} from '../objects/treeLocation/MutableSubscribableTreeLocation';
import {MutableSubscribableTreeUser} from '../objects/treeUser/MutableSubscribableTreeUser';
import {TYPES} from '../objects/types';
import {CONTENT_ID, getSigmaIdsForContentId, SIGMA_ID1, SIGMA_ID2} from '../testHelpers/testHelpers';
import {App, AppArgs} from './app';
import {getContentUserId} from '../loaders/contentUser/ContentUserLoaderUtils';
import {SyncableMutableSubscribableContentUser} from '../objects/contentUser/SyncableMutableSubscribableContentUser';
import {SyncableMutableSubscribableContent} from '../objects/content/SyncableMutableSubscribableContent';
import {SyncableMutableSubscribableTreeLocation} from '../objects/treeLocation/SyncableMutableSubscribableTreeLocation';
import {SyncableMutableSubscribableTreeUser} from '../objects/treeUser/SyncableMutableSubscribableTreeUser';
import {Store} from 'vuex';
import {partialInject} from '../testHelpers/partialInject';
import {getASampleTreeLocation1} from "../objects/treeLocation/treeLocationTestHelpers";
// TODO: separate integration tests into a separate coverage runner, so that coverages don't get comingled
myContainerLoadAllModules()
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
    const sigmaNodesUpdater: ISigmaNodesUpdater =
        partialInject<SigmaNodesUpdaterArgs>({
            constructorArgsType: TYPES.SigmaNodesUpdaterArgs,
            konstructor: SigmaNodesUpdater,
            injections: {
                getSigmaIdsForContentId,
                sigmaNodes,
                sigmaRenderManager,
                store: {} as Store<any>,
                contentIdContentMap: {}
            },
            container: myContainer,
        })

    // contentUserStore
    const contentId = CONTENT_ID
    const userId = '1234567'
    const contentUserId = getContentUserId({contentId, userId})
    const nextReviewTimeVal = Date.now() + 1000 * 60
    const lastInteractionTimeVal = Date.now()
    // TODO: replace all this scaffolding code with a getTestContentUser()
    const overdue = new MutableSubscribableField<boolean>({field: false})
    const lastRecordedStrength = new MutableSubscribableField<number>({field: 45})
    const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
    const timer = new MutableSubscribableField<number>({field: 30})
    const lastInteractionTime: IMutableSubscribableField<timestamp> =
        new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal})
    const nextReviewTime: IMutableSubscribableField<timestamp> =
        new MutableSubscribableField<timestamp>({field: nextReviewTimeVal})
    const contentUser = new SyncableMutableSubscribableContentUser({
        id: contentUserId, lastEstimatedStrength: lastRecordedStrength, overdue,
        proficiency, timer, lastInteractionTime, nextReviewTime, updatesCallbacks: [],
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
    const app: IApp =
        partialInject<AppArgs>({
            konstructor: App,
            constructorArgsType: TYPES.AppArgs,
            injections: {
                UIs,
                store
            },
            container: myContainer
        })

    app.start()
    const mutation: ITypeIdProppedDatedMutation<ContentUserPropertyMutationTypes> = {
        objectType: GlobalStoreObjectTypes.CONTENT_USER,
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
    const sigmaNodesUpdater: ISigmaNodesUpdater =
        partialInject<SigmaNodesUpdaterArgs>({
            constructorArgsType: TYPES.SigmaNodesUpdaterArgs,
            konstructor: SigmaNodesUpdater,
            injections: {
                getSigmaIdsForContentId,
                sigmaNodes,
                sigmaRenderManager,
                store: {} as Store<any>,
                contentIdContentMap: {}
            },
            container: myContainer,
        })

    // contentStore
    const contentId = CONTENT_ID
    const type = new MutableSubscribableField<CONTENT_TYPES>({field: CONTENT_TYPES.FACT})
    const question = new MutableSubscribableField<string>({field: 'What is capital of Ohio?'})
    const answer = new MutableSubscribableField<string>({field: 'Columbus'})
    const title = new MutableSubscribableField<string>({field: ''})
    const content = new SyncableMutableSubscribableContent({
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
    const app: IApp =
        partialInject<AppArgs>({
            konstructor: App,
            constructorArgsType: TYPES.AppArgs,
            injections: {
                UIs,
                store
            },
            container: myContainer
        })

    app.start()
    const newAnswer = 'Columbus!!'
    const mutation: ITypeIdProppedDatedMutation<ContentPropertyMutationTypes> = {
        objectType: GlobalStoreObjectTypes.CONTENT,
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
    const sigmaNodesUpdater: ISigmaNodesUpdater =
        partialInject<SigmaNodesUpdaterArgs>({
            constructorArgsType: TYPES.SigmaNodesUpdaterArgs,
            konstructor: SigmaNodesUpdater,
            injections: {
                getSigmaIdsForContentId,
                sigmaNodes,
                sigmaRenderManager,
                store: {} as Store<any>,
                contentIdContentMap: {}
            },
            container: myContainer,
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
    const proficiencyStats = new MutableSubscribableField<IProficiencyStats>({field: proficiencyStatsVal})
    const aggregationTimer = new MutableSubscribableField<number>({field: aggregationTimerVal})
    const treeUser = new SyncableMutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer})

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
    const app: IApp =
        partialInject<AppArgs>({
            konstructor: App,
            constructorArgsType: TYPES.AppArgs,
            injections: {
                UIs,
                store
            },
            container: myContainer
        })

    app.start()
    const newAnswer = 'Columbus!!'
    const mutation: ITypeIdProppedDatedMutation<TreeUserPropertyMutationTypes> = {
        objectType: GlobalStoreObjectTypes.TREE_USER,
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
    const sigmaNodesUpdater: ISigmaNodesUpdater =
        partialInject<SigmaNodesUpdaterArgs>({
            constructorArgsType: TYPES.SigmaNodesUpdaterArgs,
            konstructor: SigmaNodesUpdater,
            injections: {
                getSigmaIdsForContentId,
                sigmaNodes,
                sigmaRenderManager,
                store: {} as Store<any>,
                contentIdContentMap: {}
            },
            container: myContainer,
        })

    const treeId = TREE_ID
    const FIRST_POINT_VALUE = {x: 5, y: 7}
    const MUTATION_VALUE = {delta: {x: 3, y: 4}}
    const SECOND_POINT_VALUE = {
        x: FIRST_POINT_VALUE.x + MUTATION_VALUE.delta.x,
        y: FIRST_POINT_VALUE.y + MUTATION_VALUE.delta.y
    }

    const treeLocation = getASampleTreeLocation1()

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
        partialInject<MutableSubscribableGlobalStoreArgs>({
            konstructor: MutableSubscribableGlobalStore,
            constructorArgsType: TYPES.MutableSubscribableGlobalStoreArgs,
            injections: {
                treeLocationStore,
            },
            container: myContainer,
        })
        // new MutableSubscribableGlobalStore(
        //     {updatesCallbacks: [], contentUserStore, treeStore, treeUserStore, treeLocationStore, contentStore})

    const canvasUI: IUI = new CanvasUI({sigmaNodesUpdater})
    const UIs = [canvasUI]

    // create app
    const app: IApp =
        partialInject<AppArgs>({
            konstructor: App,
            constructorArgsType: TYPES.AppArgs,
            injections: {
                UIs,
                store
            },
            container: myContainer
        })

    app.start()
    const mutation: ITypeIdProppedDatedMutation<TreeLocationPropertyMutationTypes> = {
        objectType: GlobalStoreObjectTypes.TREE_LOCATION,
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
