import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {
    ISubscribable, ISubscribableContentUserStore, ISubscribableTreeStore,
    ITypeAndIdAndValUpdates
} from '../interfaces';
import {SubscribableContentUserStore} from '../stores/contentUser/SubscribableContentUserStore';
import {SubscribableGlobalStore} from '../stores/SubscribableGlobalStore';
import {SubscribableTreeStore} from '../stores/tree/SubscribableTreeStore';
import {TYPES} from '../types';
import {CanvasUI} from './CanvasUI';

describe('CanvasUI', () => {
    it('should subscribe to the onUpdate method of a subscribable obj passed to it', () => {
        const canvasUI = myContainer.get<CanvasUI>(TYPES.CanvasUI)

        const treeStore: ISubscribableTreeStore = new SubscribableTreeStore({
            store: {},
            updatesCallbacks: []
        })
        const contentUserStore: ISubscribableContentUserStore = new SubscribableContentUserStore({
            store: {},
            updatesCallbacks: []
        })
        const subscribable: ISubscribable<ITypeAndIdAndValUpdates> = new SubscribableGlobalStore({
            contentUserStore,
            treeStore,
            updatesCallbacks: []
        })
        // const subscribable = myContainer.get<SubscribableGlobalStore>(TYPES.ISubscribableGlobalStore)

        const subscribableOnUpdateSpy = sinon.spy(subscribable, 'onUpdate')

        canvasUI.subscribe(subscribable)
        expect(subscribableOnUpdateSpy.callCount).to.equal(1)
    })
})
