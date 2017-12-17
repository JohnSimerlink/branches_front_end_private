// tslint:disable object-literal-sort-keys
import {expect} from 'chai'
import * as sinon from 'sinon'
import {log} from '../../../app/core/log'
import {myContainer} from '../../../inversify.config';
import {CONTENT_TYPES, ISigmaNodesUpdater, ISigmaRenderManager, ITreeLocationData} from '../interfaces';
import {ObjectDataTypes} from '../interfaces';
import {ITypeAndIdAndValUpdates} from '../interfaces';
import {
    IContentData, IContentUserData, ICoordinate,
    ISigmaNode, ITreeDataWithoutId, ITreeUserData
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types';
import {SigmaNodesUpdater} from './SigmaNodesUpdater';

import test from 'ava'
import {
    CONTENT_ID, getSigmaIdsForContentId, SIGMA_ID1, SIGMA_ID2, TREE_ID,
    TREE_ID2
} from '../../testHelpers/testHelpers';

let sigmaNodes
let sigmaNode1
let sigmaNode2

let sigmaNodesUpdater: ISigmaNodesUpdater
let sigmaRenderManager: ISigmaRenderManager
test.beforeEach('init sigmaNodes', () => {
    sigmaNode1 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
    sigmaNode2 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
    sigmaNodes = {}
    sigmaNodes[SIGMA_ID1] = sigmaNode1
    sigmaNodes[SIGMA_ID2] = sigmaNode2
    sigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)

    sigmaNodesUpdater = new SigmaNodesUpdater(
        {sigmaNodes, getSigmaIdsForContentId, sigmaRenderManager}
    )
})
//
test('SigmaNodesUpdater:::A Tree Update should call the correct method' +
    ' on the sigma Node with the correct args', (t) => {
    const newContentId = '4324234'
    const newParentId = '4344324234'
    const newChildren = ['45344324234', 'aabc321', 'abcd43132']
    const val: ITreeDataWithoutId = {
        children: newChildren,
        contentId: newContentId,
        parentId: newParentId,
    }
    const update: ITypeAndIdAndValUpdates = {
        id: TREE_ID,
        type: ObjectDataTypes.TREE_DATA,
        val,
    }
    const sigmaNode1ReceiveNewTreeDataSpy = sinon.spy(sigmaNode1, 'receiveNewTreeData')
    const sigmaNode2ReceiveNewTreeDataSpy = sinon.spy(sigmaNode2, 'receiveNewTreeData')
    // TODO: make one unit for testing that updateSigmaNode gets called correctly twice
    // (and with the correct params ?). . .and make another unit for testing that updateSigmaNode behaves correctly

    sigmaNodesUpdater.handleUpdate(update)
    expect(sigmaNode1ReceiveNewTreeDataSpy.callCount).to.equal(1)
    expect(sigmaNode1ReceiveNewTreeDataSpy.getCall(0).args[0]).to.deep.equal(val)
    expect(sigmaNode2ReceiveNewTreeDataSpy.callCount).to.equal(0)
    t.pass()
})
//
test('SigmaNodesUpdater:::A Tree Location Update should call' +
    ' the correct method on the sigma Node with the correct args', (t) => {
    const val: ITreeLocationData = {
        point: {
            x: 5,
            y: 9,
        },
    }
    const update: ITypeAndIdAndValUpdates = {
        id: TREE_ID,
        type: ObjectDataTypes.TREE_LOCATION_DATA,
        val,
    }

    const sigmaNode1ReceiveNewTreeLocationDataSpy = sinon.spy(sigmaNode1, 'receiveNewTreeLocationData')
    const sigmaNode2ReceiveNewTreeLocationDataSpy = sinon.spy(sigmaNode2, 'receiveNewTreeLocationData')

    sigmaNodesUpdater.handleUpdate(update)
    expect(sigmaNode1ReceiveNewTreeLocationDataSpy.getCall(0).args[0]).to.deep.equal(val)
    expect(sigmaNode1ReceiveNewTreeLocationDataSpy.callCount).to.equal(1)
    expect(sigmaNode2ReceiveNewTreeLocationDataSpy.callCount).to.equal(0)
    t.pass()
})
//
test('SigmaNodesUpdater:::A Tree User Data Update should call' +
    ' the correct method on the sigma Node with the correct args', (t) => {
    const val: ITreeUserData = {
        aggregationTimer: 1230,
        proficiencyStats: {
            UNKNOWN: 8,
            ONE: 3,
            TWO: 4,
            THREE: 5,
            FOUR: 8,
        },
    }
    // TODO: make ITypeandIdAndValUpdates a generic that takes the type, so that we can have type safety on val
    const update: ITypeAndIdAndValUpdates = {
        id: TREE_ID,
        type: ObjectDataTypes.TREE_USER_DATA,
        val,
    }
    const sigmaNode1ReceiveNewTreeUserDataSpy = sinon.spy(sigmaNode1, 'receiveNewTreeUserData')
    const sigmaNode2ReceiveNewTreeUserDataSpy = sinon.spy(sigmaNode2, 'receiveNewTreeUserData')

    sigmaNodesUpdater.handleUpdate(update)
    expect(sigmaNode1ReceiveNewTreeUserDataSpy.getCall(0).args[0]).to.deep.equal(val)
    expect(sigmaNode1ReceiveNewTreeUserDataSpy.callCount).to.equal(1)
    expect(sigmaNode2ReceiveNewTreeUserDataSpy.callCount).to.equal(0)
    t.pass()
})
//
test('SigmaNodesUpdater:::A Content Update should call the correct method' +
    ' on the sigma Node with the correct args', (t) => {
    const val: IContentData = {
        answer: 'Sacramento',
        question: 'California',
        type: CONTENT_TYPES.FACT,
    }
    // TODO: make ITypeandIdAndValUpdates a generic that takes the type, so that we can have type safety on val
    const update: ITypeAndIdAndValUpdates = {
        id: CONTENT_ID,
        type: ObjectDataTypes.CONTENT_DATA,
        val,
    }
    const sigmaNode1ReceiveNewContentDataSpy = sinon.spy(sigmaNode1, 'receiveNewContentData')
    const sigmaNode2ReceiveNewContentDataSpy = sinon.spy(sigmaNode2, 'receiveNewContentData')

    sigmaNodesUpdater.handleUpdate(update)
    expect(sigmaNode1ReceiveNewContentDataSpy.getCall(0).args[0]).to.deep.equal(val)
    expect(sigmaNode2ReceiveNewContentDataSpy.getCall(0).args[0]).to.deep.equal(val)
    t.pass()
})
//
test('SigmaNodesUpdater:::A Content User Update should call the correct method' +
    ' on the sigma Node with the correct args', (t) => {
    const val: IContentUserData = {
        lastRecordedStrength: 54, // TODO: this mig
        overdue: true,
        proficiency: PROFICIENCIES.ONE,
        timer: 432,
    }
    // TODO: make ITypeandIdAndValUpdates a generic that takes the type, so that we can have type safety on val
    const update: ITypeAndIdAndValUpdates = {
        id: CONTENT_ID,
        type: ObjectDataTypes.CONTENT_USER_DATA,
        val,
    }
    const sigmaNode1ReceiveNewContentUserDataSpy = sinon.spy(sigmaNode1, 'receiveNewContentUserData')
    const sigmaNode2ReceiveNewContentUserDataSpy = sinon.spy(sigmaNode2, 'receiveNewContentUserData')

    sigmaNodesUpdater.handleUpdate(update)
    expect(sigmaNode1ReceiveNewContentUserDataSpy.getCall(0).args[0]).to.deep.equal(val)
    expect(sigmaNode2ReceiveNewContentUserDataSpy.getCall(0).args[0]).to.deep.equal(val)
    t.pass()
})

test('SigmaNodesUpdater:::A receive tree data and receive tree location data should call the appropriate methods' +
    ' on sigmaRenderManager place the node into the rendered nodes list', (t) => {
    const newContentId = '4324234'
    const newParentId = '4344324234'
    const newChildren = ['45344324234', 'aabc321', 'abcd43132']
    const treeData: ITreeDataWithoutId = {
        children: newChildren,
        contentId: newContentId,
        parentId: newParentId,
    }
    const treeDataUpdate: ITypeAndIdAndValUpdates = {
        id: TREE_ID,
        type: ObjectDataTypes.TREE_DATA,
        val: treeData,
    }

    const treeLocationData: ITreeLocationData = {
        point: {
            x: 5,
            y: 9,
        },
    }
    const treeLocationDataUpdate: ITypeAndIdAndValUpdates = {
        id: TREE_ID,
        type: ObjectDataTypes.TREE_LOCATION_DATA,
        val: treeLocationData,
    }

    const sigmaRenderManagerMarkTreeDataLoadedSpy = sinon.spy(sigmaRenderManager, 'markTreeDataLoaded')
    const sigmaRenderManagerMarkTreeLocationDataLoadedSpy = sinon.spy
    (sigmaRenderManager, 'markTreeLocationDataLoaded')

    expect(sigmaRenderManagerMarkTreeDataLoadedSpy.callCount).to.equal(0)
    expect(sigmaRenderManagerMarkTreeLocationDataLoadedSpy.callCount).to.equal(0)
    sigmaNodesUpdater.handleUpdate(treeDataUpdate)
    expect(sigmaRenderManagerMarkTreeDataLoadedSpy.callCount).to.equal(1)
    expect(sigmaRenderManagerMarkTreeLocationDataLoadedSpy.callCount).to.equal(0)
    sigmaNodesUpdater.handleUpdate(treeLocationDataUpdate)
    expect(sigmaRenderManagerMarkTreeLocationDataLoadedSpy.callCount).to.equal(1)
    expect(sigmaRenderManagerMarkTreeDataLoadedSpy.callCount).to.equal(1)
    t.pass()
})
