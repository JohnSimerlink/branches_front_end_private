import test from 'ava'
import {expect} from 'chai'
import {myContainer} from '../../../inversify.config';
import {TREE_ID} from '../../testHelpers/testHelpers';
import {IRenderedNodesManagerCore, ISigmaNode} from '../interfaces';
import {TYPES} from '../types';
import {RenderedNodesManagerCore} from './RenderedNodesManagerCore';
import * as sinon from 'sinon'

test('RenderedNodesManagerCore::::addToRenderList should add to RenderList', (t) => {
    const sigmaId = TREE_ID
    const sigmaNode = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
    const sigmaNodes = {}
    sigmaNodes[sigmaId] = sigmaNode
    const addNodeToSigma = sinon.spy()
    const renderedNodesManagerCore: IRenderedNodesManagerCore
        = new RenderedNodesManagerCore({sigmaNodes, addNodeToSigma})

    renderedNodesManagerCore.addToRenderList(sigmaId)
    expect(addNodeToSigma.callCount).to.deep.equal(1)
    const calledWith = addNodeToSigma.getCall(0).args[0]
    expect(calledWith).to.deep.equal(sigmaNode)
    t.pass()
})
