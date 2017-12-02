import 'reflect-metadata'
import {myContainer} from '../../inversify.config';
import {ISubscribableGlobalDataStore} from '../objects/dataStores/SubscribableGlobalDataStore';
import {IApp, ISigmaNodeHandler, ISigmaNodeHandlerSubscriber} from '../objects/interfaces';
import {ISigmaNode} from '../objects/sigmaNode/ISigmaNode';
import {SigmaNodeHandler} from '../objects/sigmaNode/SigmaNodeHandler';
import {SigmaNodeHandlerSubscriber} from '../objects/sigmaNode/SigmaNodeHandlerSubscriber';
import {TYPES} from '../objects/types';
import {getSigmaIdsForContentId, SIGMA_ID1, SIGMA_ID2} from '../testHelpers/testHelpers';
import {App} from './app';

describe('App integration test 1 - 12/1/2017', () => {
    it('Adding a mutation into the global store for a content user data,' +
        ' should update the sigma node instance for all sigma nodes containing that content id', () => {
        // const sigmaNode1 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        // const sigmaNode2 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        // const sigmaNodes = {}
        // sigmaNodes[SIGMA_ID1] = sigmaNode1
        // sigmaNodes[SIGMA_ID2] = sigmaNode2
        // const sigmaNodeHandler: ISigmaNodeHandler = new SigmaNodeHandler({getSigmaIdsForContentId, sigmaNodes})
        // const sigmaNodeHandlerSubscriber: ISigmaNodeHandlerSubscriber = new SigmaNodeHandlerSubscriber({sigmaNodeHandler})
        // const subscribableGlobalDataStore: ISubscribableGlobalDataStore
        // const app: IApp = new App({})

    })
})
