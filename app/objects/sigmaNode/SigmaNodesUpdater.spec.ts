// tslint:disable object-literal-sort-keys
import {expect} from 'chai'
import * as sinon from 'sinon'
import {log} from '../../../app/core/log'
import {myContainer} from '../../../inversify.config';
import {CONTENT_TYPES, ISigmaNodesUpdater, ISigmaRenderManager, ITreeLocationData} from '../interfaces';
import {ObjectDataTypes} from '../interfaces';
import {ITypeAndIdAndValUpdates} from '../interfaces';
import {IContentData, IContentUserData, ICoordinate,
    ISigmaNode, ITreeDataWithoutId, ITreeUserData} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types';
import {SigmaNodesUpdater} from './SigmaNodesUpdater';

import {
    CONTENT_ID, getSigmaIdsForContentId, SIGMA_ID1, SIGMA_ID2, TREE_ID,
    TREE_ID2
} from '../../testHelpers/testHelpers';

let sigmaNodes
let sigmaNode1
let sigmaNode2
let renderedSigmaNodes

let sigmaNodesUpdater: ISigmaNodesUpdater
let sigmaRenderManager: ISigmaRenderManager
describe('SigmaNodesUpdater', () => {
    beforeEach('init sigmaNodes', () => {
        sigmaNode1 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        sigmaNode2 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        sigmaNodes = {}
        renderedSigmaNodes = {}
        sigmaNodes[SIGMA_ID1] = sigmaNode1
        sigmaNodes[SIGMA_ID2] = sigmaNode2
        sigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)

        sigmaNodesUpdater = new SigmaNodesUpdater(
            {sigmaNodes, getSigmaIdsForContentId, renderedSigmaNodes, sigmaRenderManager}
            )
    })
//
    it('A Tree Update should call the correct method on the sigma Node with the correct args', () => {
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
    })
//
    it('A Tree Location Update should call the correct method on the sigma Node with the correct args', () => {
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
    })
//
    it('A Tree User Data Update should call the correct method on the sigma Node with the correct args', () => {
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
    })
//
    it('A Content Update should call the correct method on the sigma Node with the correct args', () => {
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
    })
//
    it('A Content User Update should call the correct method on the sigma Node with the correct args', () => {
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
    })

    it('A receive tree data and receive tree location data should place the node into the rendered nodes list', () => {
        const newContentId = '4324234'
        const newParentId = '4344324234'
        const newChildren = ['45344324234', 'aabc321', 'abcd43132']
        const val1: ITreeDataWithoutId = {
            children: newChildren,
            contentId: newContentId,
            parentId: newParentId,
        }
        const update1: ITypeAndIdAndValUpdates = {
            id: TREE_ID,
            type: ObjectDataTypes.TREE_DATA,
            val: val1,
        }

        const val2: ITreeLocationData = {
            point: {
                x: 5,
                y: 9,
            },
        }
        const update2: ITypeAndIdAndValUpdates = {
            id: TREE_ID,
            type: ObjectDataTypes.TREE_LOCATION_DATA,
            val: val2,
        }

        const sigmaRenderManagerMarkTreeDataLoadedSpy = sinon.spy(sigmaRenderManager, 'markTreeDataLoaded')

        log('renderedSigmaNodes are ', renderedSigmaNodes)
        let isNotRendered = !renderedSigmaNodes[TREE_ID]
        expect(isNotRendered).to.equal(true)
        log('renderedSigmaNodes are ', renderedSigmaNodes)
        sigmaNodesUpdater.handleUpdate(update1)
        expect(sigmaRenderManagerMarkTreeDataLoadedSpy.callCount).to.equal(1)
        isNotRendered = !renderedSigmaNodes[TREE_ID]
        expect(isNotRendered).to.equal(true)
        isNotRendered = !renderedSigmaNodes[TREE_ID]
        expect(isNotRendered).to.equal(true)
        sigmaNodesUpdater.handleUpdate(update2)
        isNotRendered = !renderedSigmaNodes[TREE_ID]
        expect(isNotRendered).to.equal(false)
        // /* TODO: rather than just adding an object to a hashmap, have a renderedNodeList.add() method,
        //  which will also call sigmaInstance.addNode() */
    })

})
