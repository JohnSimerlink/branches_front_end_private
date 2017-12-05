import {expect} from 'chai'
import 'reflect-metadata'
import {myContainer} from '../../inversify.config';
import {
    IApp, IMutableSubscribableContentUserStore, IMutableSubscribableGlobalStore, IMutableSubscribableTreeStore,
    ISigmaNode, ISigmaNodeHandler,
    ISigmaNodeHandlerSubscriber
} from '../objects/interfaces';
import {SigmaNodeHandler} from '../objects/sigmaNode/SigmaNodeHandler';
import {SigmaNodeHandlerSubscriber} from '../objects/sigmaNode/SigmaNodeHandlerSubscriber';
import {TYPES} from '../objects/types';
import {CONTENT_ID2, getSigmaIdsForContentId, SIGMA_ID1, SIGMA_ID2} from '../testHelpers/testHelpers';
import {App} from './app';
import {SubscribableMutableField} from '../objects/field/SubscribableMutableField';
import {PROFICIENCIES} from '../objects/proficiency/proficiencyEnum';
import {MutableSubscribableContentUser} from '../objects/contentUserData/MutableSubscribableContentUser';
import {MutableSubscribableContentUserStore} from '../objects/stores/contentUser/MutableSubscribableContentUserStore';
import {MutableSubscribableTreeStore} from '../objects/stores/tree/MutableSubscribableTreeStore';
import {MutableSubscribableGlobalStore} from '../objects/stores/MutableSubscribableGlobalStore';

// TODO: separate integration tests into a separate coverage runner, so that coverages don't get comingled
describe('App integration test 1', () => {
    it('Adding a mutation into the global stores for a content user data,' +
        ' should update the sigma node instance for all sigma nodes containing that content id', () => {
        // sigmaNodeHandlerSubscriber
        const sigmaNode1 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const sigmaNode2 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const sigmaNodes = {}
        sigmaNodes[SIGMA_ID1] = sigmaNode1
        sigmaNodes[SIGMA_ID2] = sigmaNode2
        const sigmaNodeHandler: ISigmaNodeHandler = new SigmaNodeHandler({getSigmaIdsForContentId, sigmaNodes})
        const sigmaNodeHandlerSubscriber: ISigmaNodeHandlerSubscriber
            = new SigmaNodeHandlerSubscriber({sigmaNodeHandler})

        // contentUserStore
        const contentId = CONTENT_ID2
        const overdue = new SubscribableMutableField<boolean>({field: false})
        const lastRecordedStrength = new SubscribableMutableField<number>({field: 45})
        const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
        const timer = new SubscribableMutableField<number>({field: 30})
        const contentUser = new MutableSubscribableContentUser({
            lastRecordedStrength, overdue, proficiency, timer, updatesCallbacks: [],
        })
        const contentUserStore: IMutableSubscribableContentUserStore = (() => {
            const store = {}
            store[contentId] = contentUser
            return new MutableSubscribableContentUserStore({
                store,
                updatesCallbacks: []
            })
        })()

        const treeStore: IMutableSubscribableTreeStore = (() => {
            const store = {}
            return new MutableSubscribableTreeStore({
                store,
                updatesCallbacks: []
            })
        })()

        const store: IMutableSubscribableGlobalStore =
            new MutableSubscribableGlobalStore({updatesCallbacks: [], contentUserStore, treeStore})
        // create app
        const app: IApp = new App({sigmaNodeHandlerSubscriber, store})

    })
})
