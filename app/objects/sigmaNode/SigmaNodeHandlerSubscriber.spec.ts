import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {SubscribableGlobalDataStore} from '../dataStores/SubscribableGlobalDataStore';
import {TYPES} from '../types';
import {SigmaNodeHandlerSubscriber} from './SigmaNodeHandlerSubscriber';

describe('SigmaNodeHandlerSubscriber', () => {
    it('should subscribe to the onUpdate method of a subscribable obj passed to it', () => {
        const sigmaNodeHandlerSubscriber = myContainer.get<SigmaNodeHandlerSubscriber>(TYPES.SigmaNodeHandlerSubscriber)

        const subscribable = myContainer.get<SubscribableGlobalDataStore>(TYPES.SubscribableGlobalDataStore)

        const subscribableOnUpdateSpy = sinon.spy(subscribable, 'onUpdate')

        sigmaNodeHandlerSubscriber.subscribe(subscribable)
    })
})
