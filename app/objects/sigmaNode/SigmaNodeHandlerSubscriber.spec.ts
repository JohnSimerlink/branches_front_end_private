import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {
    ISubscribable, ISubscribableTreeStore,
    ITypeAndIdAndValUpdates
} from '../interfaces';
import {SubscribableGlobalStore} from '../stores/SubscribableGlobalStore';
import {SubscribableTreeStore} from '../stores/SubscribableTreeStore';
import {TYPES} from '../types';
import {SigmaNodeHandlerSubscriber} from './SigmaNodeHandlerSubscriber';

describe('SigmaNodeHandlerSubscriber', () => {
    it('should subscribe to the onUpdate method of a subscribable obj passed to it', () => {
        const sigmaNodeHandlerSubscriber = myContainer.get<SigmaNodeHandlerSubscriber>(TYPES.SigmaNodeHandlerSubscriber)

        const treeStore: ISubscribableTreeStore = new SubscribableTreeStore({
            store: {},
            updatesCallbacks: []
        })
        const subscribable: ISubscribable<ITypeAndIdAndValUpdates> = new SubscribableGlobalStore({
            treeStore,
            updatesCallbacks: []
        })
        // const subscribable = myContainer.get<SubscribableGlobalStore>(TYPES.ISubscribableGlobalStore)

        const subscribableOnUpdateSpy = sinon.spy(subscribable, 'onUpdate')

        sigmaNodeHandlerSubscriber.subscribe(subscribable)
    })
})
