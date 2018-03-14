import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import 'reflect-metadata'
import {
    CONTENT_TYPES, IContentData, IContentUserData, IMutableSubscribableGlobalStore, IProficiencyStats, ISigmaNode,
    ISigmaNodeData, ITooltipRenderer
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {SigmaNodeUtils} from '../SigmaNode/SigmaNodeUtils';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {escape, TooltipRenderer, TooltipRendererArgs} from './tooltipRenderer';
import {myContainer, myContainerLoadAllModules, state} from '../../../inversify.config';
import {TYPES} from '../types';
import {expect} from 'chai'
import clonedeep = require('lodash.clonedeep')
import BranchesStore from '../../core/store/store';
import {Store} from 'vuex';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';


myContainerLoadAllModules({fakeSigma: true});
test('TooltipRenderer:::Dependency injection should set all properties in constructor', (t) => {
    
    const injects: boolean = injectionWorks<TooltipRendererArgs, ITooltipRenderer>({
        container: myContainer,
        argsType: TYPES.TooltipRendererArgs,
        interfaceType: TYPES.ITooltipRenderer
    });
    expect(injects).to.equal(true);
    t.pass()
});

// test('tooltips renderer content should escape', t => {
//
//     const contentId = '452340985'
//     const userId = 'abdcede13'
//     const proficiencyStats: IProficiencyStats = {
//         THREE: 2,
//         ONE: 2,
//     } as IProficiencyStats
//     const contentUserId = getContentUserId({contentId, userId})
//     const contentUserData: IContentUserData = {
//         id: contentUserId,
//         sampleContentUser1Overdue: false,
//         sampleContentUser1Timer: 30,
//         sampleContentUser1Proficiency: PROFICIENCIES.ONE,
//         lastEstimatedStrength: 40,
//     }
//     const content = {
//         type: CONTENT_TYPES.FACT,
//         question: 'What is capital of Ohio?',
//         answer: 'Columbus',
//         title: null,
//     }
//     const node: ISigmaNodeData = {
//         id: '1234',
//         parentId: '12345',
//         contentId,
//         children: [],
//         x: 5,
//         y: 7,
//         aggregationTimer: 50,
//         content,
//         contentUserData,
//         contentUserId,
//         label: 'What is capital . . .',
//         size: 10,
//         colorSlices: SigmaNodeUtils.getColorSlicesFromProficiencyStats(proficiencyStats),
//         proficiencyStats,
//         sampleContentUser1Proficiency: PROFICIENCIES.ONE,
//         sampleContentUser1Overdue: false,
//     }
//     const contentString = JSON.stringify(node.content)
//     const contentUserDataString = JSON.stringify(node.contentUserData)
//     let expectedVueTreeTemplate: string =
//         `<div id="vue"><tree
//                 id="${node.id}"
//                 x="${node.x}"
//                 y="${node.y}"
//                 parent-id="${node.parentId}"
//                 content-id="${node.contentId}"
//                 content-string="${contentString}"
//                 content-user-id="${contentUserId}"
//                 content-user-data-string="${contentUserDataString}"></tree></div>`;
//     expectedVueTreeTemplate = expectedVueTreeTemplate.replace(/\r?\n|\r/g, '')
//     expectedVueTreeTemplate = expectedVueTreeTemplate.replace(/\s\s+/g, ' ')
//     const store: Store<any> = myContainer.get<BranchesStore>(TYPES.BranchesStore) as Store<any>
//     const tooltipRenderer: ITooltipRenderer = new TooltipRenderer({store})
//     store.state.userId = userId
//     const vueTreeTemplate = tooltipRenderer.renderer(node, null)
//     expect(vueTreeTemplate).to.deep.equal(expectedVueTreeTemplate)
//     t.pass()
// })
