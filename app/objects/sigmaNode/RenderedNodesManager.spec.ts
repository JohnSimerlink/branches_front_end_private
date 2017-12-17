import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {IRenderedNodesManager, ISigmaRenderManager} from '../interfaces';
import {TYPES} from '../types';

test('RenderedNodesManager::::subscribe should add RenderedNodesManagerCore.addToRenderList to obj\'s callback list', (t) => {
    const subscribable = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
    const renderedNodesManager: IRenderedNodesManager
        = myContainer.get<IRenderedNodesManager>(TYPES.IRenderedNodesManager)
    const subscribableOnUpdateSpy = sinon.spy(subscribable, 'onUpdate')
    renderedNodesManager.subscribe(subscribable)
    expect(subscribableOnUpdateSpy.callCount).to.equal(1)
    t.pass()
})
