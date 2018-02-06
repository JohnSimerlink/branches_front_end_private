import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {IRenderedNodesManager, ISigmaRenderManager} from '../interfaces';
import {TYPES} from '../types';
import {log} from '../../core/log'
import {myContainer, } from '../../../inversify.config';

test('RenderedNodesManager::::subscribe should add RenderedNodesManagerCore.addNodeToRenderList' +
    ' to obj\'s callback list', (t) => {
    // log('html element is', HTMLElement)
    // expect(sample('5')).to.equal(false)
    // t.pass()
    const subscribable = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
    const renderedNodesManager: IRenderedNodesManager
        = myContainer.get<IRenderedNodesManager>(TYPES.IRenderedNodesManager)
    const subscribableOnUpdateSpy = sinon.spy(subscribable, 'onUpdate')
    renderedNodesManager.subscribe(subscribable)
    expect(subscribableOnUpdateSpy.callCount).to.equal(1)
    t.pass()
})
// globalAny.cleanup()
