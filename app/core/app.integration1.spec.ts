// tslint:disable object-literal-sort-keys
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {myContainer} from '../../inversify.config';
import {MutableSubscribableContent} from '../objects/content/MutableSubscribableContent';
import {MutableSubscribableContentUser} from '../objects/contentUserData/MutableSubscribableContentUser';
import {SubscribableMutableField} from '../objects/field/SubscribableMutableField';
import {
    CONTENT_TYPES, ContentPropertyMutationTypes, ContentPropertyNames,
    ContentUserPropertyMutationTypes,
    ContentUserPropertyNames, FieldMutationTypes,
    IApp, IGlobalDatedMutation, IMutableSubscribableContentStore, IMutableSubscribableContentUserStore,
    IMutableSubscribableGlobalStore, IMutableSubscribableTreeLocationStore,
    IMutableSubscribableTreeStore, IMutableSubscribableTreeUserStore, IProficiencyStats,
    ISigmaNode, ISigmaNodeHandler,
    IUI, ObjectTypes, TreeUserPropertyMutationTypes, TreeUserPropertyNames
} from '../objects/interfaces';
import {PROFICIENCIES} from '../objects/proficiency/proficiencyEnum';
import {CanvasUI} from '../objects/sigmaNode/CanvasUI';
import {SigmaNodeHandler} from '../objects/sigmaNode/SigmaNodeHandler';
import {MutableSubscribableContentStore} from '../objects/stores/content/MutableSubscribableContentStore';
import {MutableSubscribableContentUserStore} from '../objects/stores/contentUser/MutableSubscribableContentUserStore';
import {MutableSubscribableGlobalStore} from '../objects/stores/MutableSubscribableGlobalStore';
import {MutableSubscribableTreeStore} from '../objects/stores/tree/MutableSubscribableTreeStore';
import {MutableSubscribableTreeLocationStore} from '../objects/stores/treeLocation/MutableSubscribableTreeLocationStore';
import {MutableSubscribableTreeUserStore} from '../objects/stores/treeUser/MutableSubscribableTreeUserStore';
import {MutableSubscribableTreeUser} from '../objects/treeUser/MutableSubscribableTreeUser';
import {TYPES} from '../objects/types';
import {CONTENT_ID, getSigmaIdsForContentId, SIGMA_ID1, SIGMA_ID2} from '../testHelpers/testHelpers';
import {App} from './app';

// TODO: separate integration tests into a separate coverage runner, so that coverages don't get comingled
describe('App integration test 1', () => {
    it('Adding a mutation into the global stores for a content user data,' +
        ' should update the sigma node instance for all sigma nodes containing that content id', () => {
        // canvasUI
        const sigmaNode1 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const sigmaNode2 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const sigmaNodes = {}
        sigmaNodes[SIGMA_ID1] = sigmaNode1
        sigmaNodes[SIGMA_ID2] = sigmaNode2
        const sigmaNodeHandler: ISigmaNodeHandler = new SigmaNodeHandler({getSigmaIdsForContentId, sigmaNodes})

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
            const source = {}
            source[contentId] = contentUser
            return new MutableSubscribableContentUserStore({
                store: source,
                updatesCallbacks: []
            })
        })()

        const treeStore: IMutableSubscribableTreeStore = (() => {
            return new MutableSubscribableTreeStore({
                store: {},
                updatesCallbacks: []
            })
        })()

        const treeUserStore: IMutableSubscribableTreeUserStore = (() => {
            return new MutableSubscribableTreeUserStore({
                store: {},
                updatesCallbacks: []
            })
        })()

        const treeLocationStore: IMutableSubscribableTreeLocationStore = new MutableSubscribableTreeLocationStore( {
            store: {},
            updatesCallbacks: []
        })

        const contentStore: IMutableSubscribableContentStore = (() => {
            return new MutableSubscribableContentStore({
                store: {},
                updatesCallbacks: []
            })
        })()

        const store: IMutableSubscribableGlobalStore =
            new MutableSubscribableGlobalStore(
                {updatesCallbacks: [], contentUserStore, treeStore, treeLocationStore, treeUserStore, contentStore})

        const canvasUI: IUI = new CanvasUI({sigmaNodeHandler})
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
        expect(sigmaNode2.overdue).to.equal(true)
    })
    it('Adding a mutation into the global stores for a content data,' +
        ' should update the sigma node instance for all sigma nodes containing that content id', () => {
        // canvasUI
        const sigmaNode1 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const sigmaNode2 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const sigmaNodes = {}
        sigmaNodes[SIGMA_ID1] = sigmaNode1
        sigmaNodes[SIGMA_ID2] = sigmaNode2
        const sigmaNodeHandler: ISigmaNodeHandler = new SigmaNodeHandler({getSigmaIdsForContentId, sigmaNodes})

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
            return new MutableSubscribableContentUserStore({
                store: {},
                updatesCallbacks: []
            })
        })()

        const treeStore: IMutableSubscribableTreeStore = (() => {
            return new MutableSubscribableTreeStore({
                store: {},
                updatesCallbacks: []
            })
        })()

        const treeLocationStore: IMutableSubscribableTreeLocationStore = new MutableSubscribableTreeLocationStore( {
            store: {},
            updatesCallbacks: []
        })

        const treeUserStore: IMutableSubscribableTreeUserStore = (() => {
            return new MutableSubscribableTreeUserStore({
                store: {},
                updatesCallbacks: []
            })
        })()

        const contentStore: IMutableSubscribableContentStore = (() => {
            const source = {}
            source[contentId] = content
            return new MutableSubscribableContentStore({
                store: source,
                updatesCallbacks: []
            })
        })()

        const store: IMutableSubscribableGlobalStore =
            new MutableSubscribableGlobalStore(
                {updatesCallbacks: [], contentUserStore, treeStore, treeUserStore, treeLocationStore, contentStore})

        const canvasUI: IUI = new CanvasUI({sigmaNodeHandler})
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
        expect(sigmaNode1.content.answer).to.not.equal(newAnswer)
        expect(sigmaNode2.content.answer).to.not.equal(newAnswer)
        store.addMutation(mutation)
        expect(sigmaNode1.content.answer).to.equal(newAnswer)
        expect(sigmaNode2.content.answer).to.equal(newAnswer)
    })

    it('Adding a mutation into the global stores for a tree user data,' +
        ' should update the sigma node instance for the sigma node for that tree Id', () => {
        // canvasUI
        const sigmaNode1 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const sigmaNodes = {}
        const TREE_ID = 'babababa'
        const SIGMA_ID = TREE_ID
        sigmaNodes[SIGMA_ID] = sigmaNode1
        const sigmaNodeHandler: ISigmaNodeHandler = new SigmaNodeHandler({getSigmaIdsForContentId, sigmaNodes})

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
        const contentUserStore: IMutableSubscribableContentUserStore = (() => {
            return new MutableSubscribableContentUserStore({
                store: {},
                updatesCallbacks: []
            })
        })()

        const treeStore: IMutableSubscribableTreeStore = (() => {
            return new MutableSubscribableTreeStore({
                store: {},
                updatesCallbacks: []
            })
        })()

        const treeUserStore: IMutableSubscribableTreeUserStore = (() => {
            const source = {}
            source[TREE_ID] = treeUser
            return new MutableSubscribableTreeUserStore({
                store: source,
                updatesCallbacks: []
            })
        })()

        const treeLocationStore: IMutableSubscribableTreeLocationStore = new MutableSubscribableTreeLocationStore( {
            store: {},
            updatesCallbacks: []
        })

        const contentStore: IMutableSubscribableContentStore = (() => {
            return new MutableSubscribableContentStore({
                store: {},
                updatesCallbacks: []
            })
        })()

        const store: IMutableSubscribableGlobalStore =
            new MutableSubscribableGlobalStore(
                {updatesCallbacks: [], contentUserStore, treeStore, treeUserStore, treeLocationStore, contentStore})

        const canvasUI: IUI = new CanvasUI({sigmaNodeHandler})
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
    })

})

/*
        const treeUserStoreAddMutationSpy = sinon.spy(treeUserStore, 'addMutation')
        const treeUserAddMutationSpy = sinon.spy(treeUser, 'addMutation')
        const proficiencyStatsAddMutationSpy = sinon.spy(proficiencyStats, 'addMutation')
        const treeUserStoreCallCallbacksSpy = sinon.spy(treeUserStore, 'callCallbacks')
        const treeUserCallCallbacksSpy = sinon.spy(treeUser, 'callCallbacks')
        const proficiencyStatsCallCallbacksSpy = sinon.spy(proficiencyStats, 'callCallbacks')
        expect(sigmaNode1.proficiencyStats).to.not.deep.equal(newProficiencyStatsVal)
        expect(sigmaNode2.proficiencyStats).to.not.deep.equal(newProficiencyStatsVal)
        store.addMutation(mutation)
        expect(treeUserStoreAddMutationSpy.callCount).to.equal(1)
        expect(treeUserAddMutationSpy.callCount).to.equal(1)
        expect(proficiencyStatsAddMutationSpy.callCount).to.equal(1)
        expect(proficiencyStatsCallCallbacksSpy.callCount).to.equal(1)
        expect(treeUserCallCallbacksSpy.callCount).to.equal(1)
        expect(treeUserStoreCallCallbacksSpy.callCount).to.equal(1)
        expect(sigmaNode1.proficiencyStats).to.deep.equal(newProficiencyStatsVal)
        expect(sigmaNode2.proficiencyStats).to.deep.equal(newProficiencyStatsVal)

 */
