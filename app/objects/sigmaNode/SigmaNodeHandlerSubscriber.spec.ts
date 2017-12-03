import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {
    ISubscribable, ISubscribableGlobalStore, ISubscribableTreeCore, ISubscribableTreeStore,
    ITypeAndIdAndValUpdates
} from '../interfaces';
import {SubscribableGlobalStore} from '../stores/SubscribableGlobalStore';
import {TYPES} from '../types';
import {SigmaNodeHandlerSubscriber} from './SigmaNodeHandlerSubscriber';
import {SubscribableStore} from '../stores/SubscribableStore';

describe('SigmaNodeHandlerSubscriber', () => {
    it('should subscribe to the onUpdate method of a subscribable obj passed to it', () => {
        const sigmaNodeHandlerSubscriber = myContainer.get<SigmaNodeHandlerSubscriber>(TYPES.SigmaNodeHandlerSubscriber)

        const treeStore: ISubscribableTreeStore = new SubscribableStore<ISubscribableTreeCore>({
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
