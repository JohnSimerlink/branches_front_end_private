import * as jsdom from 'jsdom-global'
import test from 'ava'
import {GRAPH_CONTAINER_ID} from '../../core/globals';
const globalAny: any = global
globalAny.cleanup = jsdom(`<!doctype html><html><head><meta charset="utf-8">' +
  '</head><body><div id='${GRAPH_CONTAINER_ID}'></div></body></html>`)
import {expect} from 'chai'
import * as sinon from 'sinon'
// import {myContainer} from '../../../inversify.config';
import {IRenderedNodesManager, ISigmaRenderManager} from '../interfaces';
import {TYPES} from '../types';
import {log} from '../../core/log'
import {myContainer,} from '../../../inversify.config';
test('RenderedNodesManager::::subscribe should add RenderedNodesManagerCore.addToRenderList' +
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
