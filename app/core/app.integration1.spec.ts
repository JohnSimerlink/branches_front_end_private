import 'reflect-metadata'
import {IApp, ISigmaNodeHandler, ISigmaNodeHandlerSubscriber} from '../objects/interfaces';
import {ISigmaNode} from '../objects/sigmaNode/ISigmaNode';
import {SigmaNodeHandler} from '../objects/sigmaNode/SigmaNodeHandler';
import {SigmaNodeHandlerSubscriber} from '../objects/sigmaNode/SigmaNodeHandlerSubscriber';
import {App} from './app';

describe('App integration test 1 - 12/1/2017', () => {
    it('Adding a mutation into the global store for a content user data,' +
        ' should update the sigma node instance for all sigma nodes containing that content id', () => {
        // const CONTENT_ID = '1234'
        // const SIGMA_ID_1 = '4332485'
        // const SIGMA_ID_2 = '8352485'
        // const contentIdSigmaIdMap: object = {}
        // contentIdSigmaIdMap[CONTENT_ID] = SIGMA_ID_1
        // contentIdSigmaIdMap[CONTENT_ID] = SIGMA_ID_2
        //
        //
        // const sigmaNodes: ISigmaNode[] = []
        // const sigmaNodeHandler: ISigmaNodeHandler = new SigmaNodeHandler({contentIdSigmaIdMap, sigmaNodes})
        // const sigmaNodeHandlerSubscriber: ISigmaNodeHandlerSubscriber = new SigmaNodeHandlerSubscriber({})
        // const app: IApp = new App({})

    })
})
