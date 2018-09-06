import 'reflect-metadata';
import test from 'ava';
import {expect} from 'chai';
import {myContainer, myContainerLoadRendering} from '../../../inversify.config';
import {TREE_ID} from '../../testHelpers/testHelpers';
import {IRenderManagerCore, ISigmaNode} from '../interfaces';
import {TYPES} from '../types';
import {RenderManagerCore} from './RenderManagerCore';
import * as sinon from 'sinon';

myContainerLoadRendering();
test('RenderManagerCore::::addNodeToRenderList should add to RenderList', (t) => {
	const sigmaId = TREE_ID;
	const sigmaNode = myContainer.get<ISigmaNode>(TYPES.ISigmaNode);
	const sigmaNodes = {};
	sigmaNodes[sigmaId] = sigmaNode;
	const sigmaUpdater = {
		removeNode(){
		},
		addNode() {
		},
		addEdges() {
		},
	};
	const addNodeToSigma = sinon.spy(sigmaUpdater, 'addNode');
	const renderedNodesManagerCore: IRenderManagerCore
		= new RenderManagerCore(
		{sigmaNodes, sigmaEdges: {}, sigmaUpdater}
	);

	renderedNodesManagerCore.addNodeToRenderList(sigmaId);
	expect(addNodeToSigma.callCount).to.deep.equal(1);
	const calledWith = addNodeToSigma.getCall(0).args[0];
	expect(calledWith).to.deep.equal(sigmaNode);
	t.pass();
});
