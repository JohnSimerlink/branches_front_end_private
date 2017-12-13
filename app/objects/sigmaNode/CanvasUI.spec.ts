import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {
    ISubscribable, ISubscribableContentStore, ISubscribableContentUserStore, ISubscribableGlobalStore,
    ISubscribableTreeLocationStore,
    ISubscribableTreeStore,
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
import {SubscribableTreeLocationStore} from '../stores/treeLocation/SubscribableTreeLocationStore';

describe('CanvasUI', () => {
    it('should subscribe to the onUpdate method of a subscribable obj passed to it', () => {
        const canvasUI = myContainer.get<CanvasUI>(TYPES.CanvasUI)

        const subscribable: ISubscribable<ITypeAndIdAndValUpdates> = myContainer.get<ISubscribableGlobalStore>(TYPES.ISubscribableGlobalStore)
        // const subscribable = myContainer.get<SubscribableGlobalStore>(TYPES.ISubscribableGlobalStore)

        const subscribableOnUpdateSpy = sinon.spy(subscribable, 'onUpdate')

        canvasUI.subscribe(subscribable)
        expect(subscribableOnUpdateSpy.callCount).to.equal(1)
    })
})
