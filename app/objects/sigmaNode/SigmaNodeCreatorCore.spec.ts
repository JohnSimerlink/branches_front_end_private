import {expect} from 'chai'
import {TREE_ID} from '../../testHelpers/testHelpers';
import {IHash, ISigmaNode, ISigmaNodeCreatorCore, ITreeData, ITreeDataWithoutId} from '../interfaces';
import {SigmaNode} from './SigmaNode';
import {SigmaNodeCreatorCore} from './SigmaNodeCreatorCore';

describe('SigmaNodeCreatorCore', () => {
    it('.receiveNewTreeData should create a new sigma node '
    + 'and call sigmaNode.receiveNewTreeData and add that node to sigmaNodes'
        , () => {
        const sigmaId = TREE_ID
        const treeData: ITreeDataWithoutId = {
            contentId: '543534',
            parentId: '4234325',
            children: ['234', '5435']
        }
        const sigmaNodes: IHash<ISigmaNode> = {}
        const expectedSigmaNode: ISigmaNode = new SigmaNode()
        expectedSigmaNode.receiveNewTreeData(treeData)
        const sigmaNodeCreatorCore: ISigmaNodeCreatorCore = new SigmaNodeCreatorCore({sigmaNodes})
        sigmaNodeCreatorCore.receiveNewTreeData({treeId: sigmaId, treeData})
        const createdSigmaNode = sigmaNodes[sigmaId]
        expect(expectedSigmaNode).to.deep.equal(createdSigmaNode)
    })
})
