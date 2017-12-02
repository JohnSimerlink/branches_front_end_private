import 'reflect-metadata'
import {myContainer} from '../../inversify.config';
import {
    IApp, IMutableSubscribableGlobalDataStore, ISigmaNode, ISigmaNodeHandler,
    ISigmaNodeHandlerSubscriber
} from '../objects/interfaces';
import {SigmaNodeHandler} from '../objects/sigmaNode/SigmaNodeHandler';
import {SigmaNodeHandlerSubscriber} from '../objects/sigmaNode/SigmaNodeHandlerSubscriber';
import {TYPES} from '../objects/types';
import {getSigmaIdsForContentId, SIGMA_ID1, SIGMA_ID2} from '../testHelpers/testHelpers';
import {App} from './app';

// TODO: separate integration tests into a separate coverage runner, so that coverages don't get comingled
describe('App integration test 1', () => {
    it('Adding a mutation into the global store for a content user data,' +
        ' should update the sigma node instance for all sigma nodes containing that content id', () => {
        const sigmaNode1 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const sigmaNode2 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const sigmaNodes = {}
        sigmaNodes[SIGMA_ID1] = sigmaNode1
        sigmaNodes[SIGMA_ID2] = sigmaNode2
        const sigmaNodeHandler: ISigmaNodeHandler = new SigmaNodeHandler({getSigmaIdsForContentId, sigmaNodes})
        const sigmaNodeHandlerSubscriber: ISigmaNodeHandlerSubscriber
            = new SigmaNodeHandlerSubscriber({sigmaNodeHandler})
        const dataStore: IMutableSubscribableGlobalDataStore
            = myContainer.get<IMutableSubscribableGlobalDataStore>(TYPES.ISubscribableGlobalDataStore)
        const app: IApp = new App({sigmaNodeHandlerSubscriber, dataStore})

    })
})
