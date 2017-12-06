// tslint:disable object-literal-sort-keys
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {myContainer} from '../../inversify.config';
import {MutableSubscribableContentUser} from '../objects/contentUserData/MutableSubscribableContentUser';
import {SubscribableMutableField} from '../objects/field/SubscribableMutableField';
import {
    ContentUserPropertyMutationTypes,
    ContentUserPropertyNames, FieldMutationTypes,
    IApp, IGlobalDatedMutation, IMutableSubscribableContentStore, IMutableSubscribableContentUserStore,
    IMutableSubscribableGlobalStore,
    IMutableSubscribableTreeStore,
    ISigmaNode, ISigmaNodeHandler,
    IUI, ObjectTypes
} from '../objects/interfaces';
import {PROFICIENCIES} from '../objects/proficiency/proficiencyEnum';
import {CanvasUI} from '../objects/sigmaNode/CanvasUI';
import {SigmaNodeHandler} from '../objects/sigmaNode/SigmaNodeHandler';
import {MutableSubscribableContentUserStore} from '../objects/stores/contentUser/MutableSubscribableContentUserStore';
import {MutableSubscribableGlobalStore} from '../objects/stores/MutableSubscribableGlobalStore';
import {MutableSubscribableTreeStore} from '../objects/stores/tree/MutableSubscribableTreeStore';
import {TYPES} from '../objects/types';
import {CONTENT_ID, CONTENT_ID2, getSigmaIdsForContentId, SIGMA_ID1, SIGMA_ID2} from '../testHelpers/testHelpers';
import {App} from './app';
import {MutableSubscribableContentStore} from '../objects/stores/content/MutableSubscribableContentStore';

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

        const contentStore: IMutableSubscribableContentStore = (() => {
            return new MutableSubscribableContentStore({
                store: {},
                updatesCallbacks: []
            })
        })()

        const store: IMutableSubscribableGlobalStore =
            new MutableSubscribableGlobalStore({updatesCallbacks: [], contentUserStore, treeStore, contentStore})

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
})
