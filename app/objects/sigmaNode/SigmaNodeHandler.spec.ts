import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {CONTENT_TYPES} from '../contentItem/ContentTypes';
import {IContentData} from '../contentItem/IContentData';
import {ObjectDataTypes} from '../dataStores/ObjectTypes';
import {ITypeAndIdAndValUpdates} from '../interfaces';
import {IBasicTreeDataWithoutId} from '../tree/IBasicTreeData';
import {TYPES} from '../types';
import {ISigmaNode} from './ISigmaNode';
import {SigmaNodeHandler} from './SigmaNodeHandler';
import {IContentUserData} from '../contentUserData/IContentUserData';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {ITreeUserData} from '../treeUserData/ITreeUserData';
import {ICoordinate} from '../point/IPoint';

describe('SigmaNodeHandler', () => {
    it('A Tree Update should call the correct method on the sigma Node with the correct args', () => {
        const sigmaNode = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const TREE_ID = '12334'
        const sigmaNodes = {}
        sigmaNodes[TREE_ID] = sigmaNode

        const contentIdSigmaIdMap = {}
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
        const sigmaNodeHandler = new SigmaNodeHandler({sigmaNodes, contentIdSigmaIdMap})
        const sigmaNodeReceiveNewTreeDataSpy = sinon.spy(sigmaNode, 'receiveNewTreeData')

        sigmaNodeHandler.handleUpdate(update)
        expect(sigmaNodeReceiveNewTreeDataSpy.getCall(0).args[0]).to.deep.equal(val)
    })
    it('A Tree Location Update should call the correct method on the sigma Node with the correct args', () => {
        const sigmaNode = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const TREE_ID = '12334'
        const sigmaNodes = {}
        sigmaNodes[TREE_ID] = sigmaNode

        const contentIdSigmaIdMap = {}
        const val: ICoordinate = {
            x: 5,
            y: 9,
        }
        const update: ITypeAndIdAndValUpdates = {
            id: TREE_ID,
            type: ObjectDataTypes.TREE_LOCATION_DATA,
            val,
        }
        const sigmaNodeHandler = new SigmaNodeHandler({sigmaNodes, contentIdSigmaIdMap})
        const sigmaNodeReceiveNewTreeLocationDataSpy = sinon.spy(sigmaNode, 'receiveNewTreeLocationData')

        sigmaNodeHandler.handleUpdate(update)
        expect(sigmaNodeReceiveNewTreeLocationDataSpy.getCall(0).args[0]).to.deep.equal(val)
    })
    it('A Tree User Data Update should call the correct method on the sigma Node with the correct args', () => {
        const sigmaNode = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const TREE_ID = '12334'
        const sigmaNodes = {}
        sigmaNodes[TREE_ID] = sigmaNode

        const contentIdSigmaIdMap = {}
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
        const sigmaNodeHandler = new SigmaNodeHandler({sigmaNodes, contentIdSigmaIdMap})
        const sigmaNodeReceiveNewTreeDataSpy = sinon.spy(sigmaNode, 'receiveNewTreeUserData')

        sigmaNodeHandler.handleUpdate(update)
        expect(sigmaNodeReceiveNewTreeDataSpy.getCall(0).args[0]).to.deep.equal(val)
    })
    it('A Content Update should call the correct method on the sigma Node with the correct args', () => {
        const sigmaNode = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const TREE_ID = '12334'
        const CONTENT_ID = '5982347'
        const sigmaNodes = {}
        sigmaNodes[TREE_ID] = sigmaNode

        const contentIdSigmaIdMap = {}
        contentIdSigmaIdMap[CONTENT_ID] = TREE_ID
        const newContentId = '4324234'
        const newParentId = '4344324234'
        const newChildren = ['45344324234', 'aabc321', 'abcd43132']
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
        const sigmaNodeHandler = new SigmaNodeHandler({sigmaNodes, contentIdSigmaIdMap})
        const sigmaNodeReceiveNewTreeDataSpy = sinon.spy(sigmaNode, 'receiveNewContentData')

        sigmaNodeHandler.handleUpdate(update)
        expect(sigmaNodeReceiveNewTreeDataSpy.getCall(0).args[0]).to.deep.equal(val)
    })
    it('A Content User Update should call the correct method on the sigma Node with the correct args', () => {
        const sigmaNode = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const TREE_ID = '12334'
        const CONTENT_ID = '5982347'
        const sigmaNodes = {}
        sigmaNodes[TREE_ID] = sigmaNode

        const contentIdSigmaIdMap = {}
        contentIdSigmaIdMap[CONTENT_ID] = TREE_ID
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
        const sigmaNodeHandler = new SigmaNodeHandler({sigmaNodes, contentIdSigmaIdMap})
        const sigmaNodeReceiveNewTreeDataSpy = sinon.spy(sigmaNode, 'receiveNewContentUserData')

        sigmaNodeHandler.handleUpdate(update)
        expect(sigmaNodeReceiveNewTreeDataSpy.getCall(0).args[0]).to.deep.equal(val)
    })
})
