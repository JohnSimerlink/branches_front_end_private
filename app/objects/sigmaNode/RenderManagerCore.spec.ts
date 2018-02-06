import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import {myContainer} from '../../../inversify.config';
import {TREE_ID} from '../../testHelpers/testHelpers';
import {IRenderedNodesManagerCore, ISigmaNode} from '../interfaces';
import {TYPES} from '../types';
import {RenderedNodesManagerCore} from './RenderManagerCore';
import * as sinon from 'sinon'

test('RenderedNodesManagerCore::::addNodeToRenderList should add to RenderList', (t) => {
    const sigmaId = TREE_ID
    const sigmaNode = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
    const sigmaNodes = {}
    sigmaNodes[sigmaId] = sigmaNode
    const sigmaUpdater = {
        addNode() {},
        addEdges() {},
    }
    const addNodeToSigma = sinon.spy(sigmaUpdater, 'addNode')
    const renderedNodesManagerCore: IRenderedNodesManagerCore
        = new RenderedNodesManagerCore(
            {sigmaNodes, sigmaEdges: {}, sigmaUpdater}
            )

    renderedNodesManagerCore.addNodeToRenderList(sigmaId)
    expect(addNodeToSigma.callCount).to.deep.equal(1)
    const calledWith = addNodeToSigma.getCall(0).args[0]
    expect(calledWith).to.deep.equal(sigmaNode)
    t.pass()
})
