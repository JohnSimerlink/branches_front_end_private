import {expect} from 'chai'
import {injectionWorks, TREE_ID} from '../../testHelpers/testHelpers';
import {
    IHash, IManagedSigmaNodeCreatorCore, ISigmaNode, ISigmaNodeCreatorCore, ISigmaRenderManager,
    ITreeDataWithoutId
} from '../interfaces';
import {SigmaNode} from './SigmaNode';
import {SigmaNodeCreatorCore, SigmaNodeCreatorCoreArgs} from './SigmaNodeCreatorCore';
import {SigmaRenderManagerArgs} from './SigmaRenderManager';
import {myContainer} from '../../../inversify.config';
import {TYPES} from '../types';
import {ManagedSigmaNodeCreatorCoreArgs} from './ManagedSigmaNodeCreatorCore';

describe('SigmaNodeCreatorCore', () => {
    it('DI constructor works', () => {
        const injects = injectionWorks<SigmaNodeCreatorCoreArgs, ISigmaNodeCreatorCore>({
            container: myContainer,
            argsType: TYPES.SigmaNodeCreatorCoreArgs,
            classType: TYPES.ISigmaNodeCreatorCore,
        })
        expect(injects).to.equal(true)
    })
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
        const sigmaNodeCreatorCore: IManagedSigmaNodeCreatorCore = new SigmaNodeCreatorCore({sigmaNodes})
        sigmaNodeCreatorCore.receiveNewTreeData({treeId: sigmaId, treeData})
        const createdSigmaNode = sigmaNodes[sigmaId]
        expect(expectedSigmaNode).to.deep.equal(createdSigmaNode)
    })
    it('.receiveNewTreeData should error on creating a new sigmaNode if that node already exists'
        , () => {
            const sigmaId = TREE_ID
            const treeData: ITreeDataWithoutId = {
                contentId: '543534',
                parentId: '4234325',
                children: ['234', '5435']
            }
            const existingSigmaNode: ISigmaNode = new SigmaNode()
            existingSigmaNode.receiveNewTreeData(treeData)
            const sigmaNodes: IHash<ISigmaNode> = {}
            sigmaNodes[sigmaId] = existingSigmaNode
            const sigmaNodeCreatorCore: IManagedSigmaNodeCreatorCore = new SigmaNodeCreatorCore({sigmaNodes})
            expect(() => sigmaNodeCreatorCore.receiveNewTreeData({treeId: sigmaId, treeData})).to.throw(RangeError)
        })
})
