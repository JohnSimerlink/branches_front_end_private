import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {injectionWorks, TREE_ID} from '../../testHelpers/testHelpers';
import {
    IHash, ISigmaNode, IManagedSigmaNodeCreatorCore, ISigmaRenderManager, ITreeDataWithoutId,
    ITreeLocationData
} from '../interfaces';
import {TYPES} from '../types';
import {ManagedSigmaNodeCreatorCore, ManagedSigmaNodeCreatorCoreArgs} from './ManagedSigmaNodeCreatorCore';
import {SigmaNode} from './SigmaNode';
import {SigmaNodeCreatorCore, SigmaNodeCreatorCoreArgs} from './SigmaNodeCreatorCore';
import {SigmaRenderManager} from './SigmaRenderManager';

describe('ManagedSigmaNodeCreatorCore', () => {
    it('DI constructor works', () => {
        const injects = injectionWorks<ManagedSigmaNodeCreatorCoreArgs, IManagedSigmaNodeCreatorCore>({
            container: myContainer,
            argsType: TYPES.ManagedSigmaNodeCreatorCoreArgs,
            classType: TYPES.IManagedSigmaNodeCreatorCore,
        })
        expect(injects).to.equal(true)
    })
    it('.receiveNewTreeData should call sigmaRenderManager.markTreeDataLoaded'
        , () => {
            const sigmaId = TREE_ID
            const treeData: ITreeDataWithoutId = {
                contentId: '543534',
                parentId: '4234325',
                children: ['234', '5435']
            }
            const sigmaNodes: IHash<ISigmaNode> = {}
            const sigmaRenderManager: ISigmaRenderManager
                = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
            const sigmaRenderManagerMarkTreeDataLoaded = sinon.spy(sigmaRenderManager, 'markTreeDataLoaded')
            const managedSigmaNodeCreatorCore: IManagedSigmaNodeCreatorCore
                = new ManagedSigmaNodeCreatorCore({sigmaNodes, sigmaRenderManager})
            managedSigmaNodeCreatorCore.receiveNewTreeData({treeId: sigmaId, treeData})
            expect(sigmaRenderManagerMarkTreeDataLoaded.callCount).to.equal(1)
            const calledWith = sigmaRenderManagerMarkTreeDataLoaded.getCall(0).args[0]
            expect(calledWith).to.equal(sigmaId)
        })
    it('.receiveNewTreeLocationData should call sigmaRenderManager.markTreeLocationDataLoaded'
        , () => {
            const sigmaId = TREE_ID

            const pointVal = {
                x: 5,
                y: 9,
            }
            const treeLocationData: ITreeLocationData = {
                point: pointVal
            }
            const sigmaNodes: IHash<ISigmaNode> = {}
            const sigmaRenderManager: ISigmaRenderManager
                = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
            const sigmaRenderManagerMarkTreeLocationDataLoaded
                = sinon.spy(sigmaRenderManager, 'markTreeLocationDataLoaded')
            const managedSigmaNodeCreatorCore: IManagedSigmaNodeCreatorCore
                = new ManagedSigmaNodeCreatorCore({sigmaNodes, sigmaRenderManager})
            managedSigmaNodeCreatorCore.receiveNewTreeLocationData({treeId: sigmaId, treeLocationData})
            expect(sigmaRenderManagerMarkTreeLocationDataLoaded.callCount).to.equal(1)
            const calledWith = sigmaRenderManagerMarkTreeLocationDataLoaded.getCall(0).args[0]
            expect(calledWith).to.equal(sigmaId)
        })
})
