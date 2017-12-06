import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {
    ISubscribable, ISubscribableContentStore, ISubscribableContentUserStore, ISubscribableTreeStore,
    ISubscribableTreeUserStore,
    ITypeAndIdAndValUpdates
} from '../interfaces';
import {SubscribableContentUserStore} from '../stores/contentUser/SubscribableContentUserStore';
import {SubscribableGlobalStore} from '../stores/SubscribableGlobalStore';
import {SubscribableTreeStore} from '../stores/tree/SubscribableTreeStore';
import {TYPES} from '../types';
import {CanvasUI} from './CanvasUI';
import {SubscribableTreeUserStore} from '../stores/treeUser/SubscribableTreeUserStore';
import {SubscribableContentStore} from '../stores/content/SubscribableContentStore';

describe('CanvasUI', () => {
    it('should subscribe to the onUpdate method of a subscribable obj passed to it', () => {
        const canvasUI = myContainer.get<CanvasUI>(TYPES.CanvasUI)

        const treeStore: ISubscribableTreeStore = new SubscribableTreeStore({
            store: {},
            updatesCallbacks: []
        })
        const treeUserStore: ISubscribableTreeUserStore = new SubscribableTreeUserStore({
            store: {},
            updatesCallbacks: []
        })
        const contentStore: ISubscribableContentStore = new SubscribableContentStore({
            store: {},
            updatesCallbacks: []
        })
        const contentUserStore: ISubscribableContentUserStore = new SubscribableContentUserStore({
            store: {},
            updatesCallbacks: []
        })
        const subscribable: ISubscribable<ITypeAndIdAndValUpdates> = new SubscribableGlobalStore({
            contentUserStore,
            contentStore,
            treeStore,
            treeUserStore,
            updatesCallbacks: []
        })
        // const subscribable = myContainer.get<SubscribableGlobalStore>(TYPES.ISubscribableGlobalStore)

        const subscribableOnUpdateSpy = sinon.spy(subscribable, 'onUpdate')

        canvasUI.subscribe(subscribable)
        expect(subscribableOnUpdateSpy.callCount).to.equal(1)
    })
})
