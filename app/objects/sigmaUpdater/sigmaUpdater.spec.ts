import test from 'ava'
import {injectionWorks} from '../../testHelpers/testHelpers';
import {myContainer} from '../../../inversify.config';
import {TYPES} from '../types';
import {SigmaUpdater, SigmaUpdaterArgs} from './sigmaUpdater';
import {ISigmaUpdater} from '../interfaces';
import {expect} from 'chai'
import * as sinon from 'sinon'
import Graph = SigmaJs.Graph;
import Edge = SigmaJs.Edge;

test('DI constructor should work', (t) => {

    const injects = injectionWorks<SigmaUpdaterArgs, ISigmaUpdater>({
        container: myContainer,
        argsType: TYPES.SigmaUpdaterArgs,
        interfaceType: TYPES.ISigmaUpdater,
    })
    expect(injects).to.equal(true)
    t.pass()

})
test('AddNode Should add to graphData, if sigma not yet initialized', (t) => {
    const graphData: SigmaJs.GraphData = {
        nodes: [],
        edges: [],
    }
    const node: SigmaJs.Node = {id: '53234'} as SigmaJs.Node
    const sigmaUpdater = new SigmaUpdater({graphData, sigmaInstance: null, graph: null, initialized: false})
    const expectedGraphData = {
        nodes: [node],
        edges: []
    }
    sigmaUpdater.addNode(node)
    expect(graphData).to.deep.equal(expectedGraphData)
    t.pass()
})

test('AddNode Should call sigmaInstance.addNode and sigmaInstance.refresh(), if sigma is initialized', (t) => {
    const node: SigmaJs.Node = {id: '53234'} as SigmaJs.Node
    const graph: SigmaJs.Graph = {
        addNode(node: SigmaJs.Node) { return {} as Graph},
        addEdge(edge: Edge) { return {} as Graph}
    } as SigmaJs.Graph
    const sigmaInstance: SigmaJs.Sigma = {
        refresh() {},
        graph,
    } as SigmaJs.Sigma
    const sigmaUpdater = new SigmaUpdater(
        {graphData: null, sigmaInstance, graph: sigmaInstance.graph, initialized: true}
        )
    const expectedGraphData = {
        nodes: [node],
        edges: []
    }
    const addNodeSpy = sinon.spy(graph, 'addNode')
    const refreshSpy = sinon.spy(sigmaInstance, 'refresh')
    sigmaUpdater.addNode(node)
    expect(addNodeSpy.callCount).to.deep.equal(1)
    const calledWith = addNodeSpy.getCall(0).args[0]
    expect(calledWith).to.deep.equal(node)
    expect(refreshSpy.callCount).to.deep.equal(1)
    t.pass()

})
