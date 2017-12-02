import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {CONTENT_TYPES} from '../contentItem/ContentTypes';
import {IContentData} from '../contentItem/IContentData';
import {IContentUserData} from '../contentUserData/IContentUserData';
import {ObjectDataTypes} from '../dataStores/ObjectTypes';
import {ITypeAndIdAndValUpdates} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types';
import {ISigmaNode} from './ISigmaNode';
import {SigmaNodeHandler} from './SigmaNodeHandler';
import {IBasicTreeDataWithoutId} from '../tree/IBasicTreeData';
import {ICoordinate} from '../point/IPoint';
import {ITreeUserData} from '../treeUserData/ITreeUserData';

const TREE_ID = '12334'
const TREE_ID2 = '1252334'
const CONTENT_ID = '5982347'
function getSigmaIdsForContentId(contentId) {
   switch (contentId) {
       case CONTENT_ID:
           return [TREE_ID, TREE_ID2]
   }
}
let sigmaNodes
let sigmaNode1
let sigmaNode2

let sigmaNodeHandler
describe('SigmaNodeHandler', () => {
    beforeEach('init sigmaNodes', () => {
        sigmaNode1 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        sigmaNode2 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        sigmaNodes = {}
        sigmaNodes[TREE_ID] = sigmaNode1
        sigmaNodes[TREE_ID2] = sigmaNode2

        sigmaNodeHandler = new SigmaNodeHandler({sigmaNodes, getSigmaIdsForContentId})
    })

    it('A Tree Update should call the correct method on the sigma Node with the correct args', () => {
        const newContentId = '4324234'
        const newParentId = '4344324234'
        const newChildren = ['45344324234', 'aabc321', 'abcd43132']
        const val: IBasicTreeDataWithoutId = {
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

        sigmaNodeHandler.handleUpdate(update)
        expect(sigmaNode1ReceiveNewTreeDataSpy.callCount).to.equal(1)
        expect(sigmaNode1ReceiveNewTreeDataSpy.getCall(0).args[0]).to.deep.equal(val)
        expect(sigmaNode2ReceiveNewTreeDataSpy.callCount).to.equal(0)
    })

    it('A Tree Location Update should call the correct method on the sigma Node with the correct args', () => {
        const val: ICoordinate = {
            x: 5,
            y: 9,
        }
        const update: ITypeAndIdAndValUpdates = {
            id: TREE_ID,
            type: ObjectDataTypes.TREE_LOCATION_DATA,
            val,
        }

        const sigmaNode1ReceiveNewTreeLocationDataSpy = sinon.spy(sigmaNode1, 'receiveNewTreeLocationData')
        const sigmaNode2ReceiveNewTreeLocationDataSpy = sinon.spy(sigmaNode2, 'receiveNewTreeLocationData')

        sigmaNodeHandler.handleUpdate(update)
        expect(sigmaNode1ReceiveNewTreeLocationDataSpy.getCall(0).args[0]).to.deep.equal(val)
        expect(sigmaNode1ReceiveNewTreeLocationDataSpy.callCount).to.equal(1)
        expect(sigmaNode2ReceiveNewTreeLocationDataSpy.callCount).to.equal(0)
    })

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

        sigmaNodeHandler.handleUpdate(update)
        expect(sigmaNode1ReceiveNewTreeUserDataSpy.getCall(0).args[0]).to.deep.equal(val)
        expect(sigmaNode1ReceiveNewTreeUserDataSpy.callCount).to.equal(1)
        expect(sigmaNode2ReceiveNewTreeUserDataSpy.callCount).to.equal(0)
    })

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

        sigmaNodeHandler.handleUpdate(update)
        expect(sigmaNode1ReceiveNewContentDataSpy.getCall(0).args[0]).to.deep.equal(val)
        expect(sigmaNode2ReceiveNewContentDataSpy.getCall(0).args[0]).to.deep.equal(val)
    })

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

        sigmaNodeHandler.handleUpdate(update)
        expect(sigmaNode1ReceiveNewContentUserDataSpy.getCall(0).args[0]).to.deep.equal(val)
        expect(sigmaNode2ReceiveNewContentUserDataSpy.getCall(0).args[0]).to.deep.equal(val)
    })
})
