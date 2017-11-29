import {expect} from 'chai'
import {myContainer} from '../../../inversify.config';
import {IdMutationTypes} from '../id/IdMutationTypes';
import {IDatedMutation, IMutation} from '../mutations/IMutation';
import {IBasicTree} from '../tree/IBasicTree';
import {IBasicTreeData, IBasicTreeDataWithoutId} from '../tree/IBasicTreeData';
import {TYPES} from '../types';
import {ISigmaNode} from './ISigmaNode';
import {ISigmaNodeData} from './ISigmaNodeData';
import {SigmaNode} from './SigmaNode';
import {ITreeUserData} from '../treeUserData/ITreeUserData';
import {IProficiencyStats} from '../proficiencyStats/IProficiencyStats';
import {SigmaNodeUtils} from './SigmaNodeUtils';

describe('sigmaNode', () => {
    it('receive new tree', () => {
        const parentId = '12345'
        const contentId = '12312345'
        const children = ['12312345', '123123123123123', '432493598342']
        const sigmaNode = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)

        const treeData: IBasicTreeDataWithoutId = {
            children,
            contentId,
            parentId,
        }
        sigmaNode.receiveNewTreeData(treeData)
        expect(sigmaNode.parentId).to.equal(parentId)
        expect(sigmaNode.contentId).to.equal(contentId)
        expect(sigmaNode.children).to.deep.equal(children)
    })
    it('receive new treeUserData', () => {
        const sigmaNode = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)

        const aggregationTimer = 1000
        const proficiencyStats = {
                TWO: 3,
                UNKNOWN: 3
            } as IProficiencyStats
        const treeUserData: ITreeUserData = {
            aggregationTimer, // seconds
            proficiencyStats,
        }
        const colorSlices = SigmaNodeUtils.getColorSlicesFromProficiencyStats(treeUserData.proficiencyStats)
        sigmaNode.receiveNewTreeUserData(treeUserData)
        expect(sigmaNode.aggregationTimer).to.equal(aggregationTimer)
        expect(sigmaNode.colorSlices).to.deep.equal(colorSlices)
        expect(sigmaNode.proficiencyStats).to.deep.equal(proficiencyStats)
    })
})
