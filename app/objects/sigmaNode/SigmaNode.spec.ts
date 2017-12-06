import {expect} from 'chai'
import {myContainer} from '../../../inversify.config';
import {ContentItemUtils} from '../contentItem/ContentItemUtils';
import {CONTENT_TYPES} from '../interfaces';
import {ContentUserDataUtils } from '../contentUserData/ContentUserDataUtils';
import {ITreeDataWithoutId, IContentData,
    IContentUserData, ICoordinate, IProficiencyStats,
    ISigmaNode, ITreeUserData} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types';
import {SigmaNodeUtils} from './SigmaNodeUtils';

describe('sigmaNode', () => {
    it('receive new tree', () => {
        const parentId = '12345'
        const contentId = '12312345'
        const children = ['12312345', '123123123123123', '432493598342']
        const sigmaNode = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)

        const treeData: ITreeDataWithoutId = {
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
    it('receive new ContentData', () => {
        const sigmaNode = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const contentData: IContentData = {
            answer: 'Columbus',
            question: 'Ohio',
            type: CONTENT_TYPES.FACT
        }
        const label = ContentItemUtils.getLabelFromContent(contentData)
        /* QUESTION / TODO: Doesn't this entire test seem useless?
         e.g. a redundant implementation of the implementation? */

        sigmaNode.receiveNewContentData(contentData)
        expect(sigmaNode.content).to.equal(contentData)
        expect(sigmaNode.label).to.equal(label)
    })
    it('receive new ContentUserData', () => {
        const sigmaNode = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const overdue = true
        const lastRecordedStrength = 50
        const proficiency: PROFICIENCIES = PROFICIENCIES.THREE
        const timer = 40
        const contentUserData: IContentUserData = {
            lastRecordedStrength,
            overdue,
            proficiency,
            timer,
        }
        const size = ContentUserDataUtils.getSizeFromContentUserData(contentUserData)
        /* QUESTION / TODO: Doesn't this entire test seem useless?
         e.g. a redundant implementation of the implementation? */

        sigmaNode.receiveNewContentUserData(contentUserData)
        expect(sigmaNode.size).to.equal(size)
        expect(sigmaNode.overdue).to.equal(overdue)
        expect(sigmaNode.contentUserData).to.deep.equal(contentUserData)
    })
    it('receive new TreeLocation', () => {
        const sigmaNode = myContainer.get<ISigmaNode>(TYPES.ISigmaNode)
        const x = 5
        const y = 7
        const location: ICoordinate = {
            x,
            y
        }
        /* QUESTION / TODO: Doesn't this entire test seem useless?
         e.g. a redundant implementation of the implementation? */

        sigmaNode.receiveNewTreeLocationData(location)
        expect(sigmaNode.x).to.equal(x)
        expect(sigmaNode.y).to.equal(y)
    })
})
