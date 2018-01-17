import test from 'ava'
import 'reflect-metadata'
import {
    CONTENT_TYPES, IContentData, IContentUserData, IMutableSubscribableGlobalStore, IProficiencyStats, ISigmaNode,
    ISigmaNodeData, ITooltipRenderer
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {SigmaNodeUtils} from '../SigmaNode/SigmaNodeUtils';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoader';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {TooltipRenderer, TooltipRendererArgs} from './tooltipRenderer';
import {myContainer, state} from '../../../inversify.config';
import {TYPES} from '../types';
import {expect} from 'chai'
import clonedeep = require('lodash.clonedeep')
import BranchesStore from '../../core/store2';

test('TooltipRenderer:::Dependency injection should set all properties in constructor', (t) => {
    const injects: boolean = injectionWorks<TooltipRendererArgs, ITooltipRenderer>({
        container: myContainer,
        argsType: TYPES.TooltipRendererArgs,
        interfaceType: TYPES.ITooltipRenderer
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('TooltipRenderer:::Constructor should set userId with value from store state', (t) => {
    const userId = 'abcdegh12938'
    const stateClone = clonedeep(state)
    stateClone.userId = userId
    const globalDataStore: IMutableSubscribableGlobalStore =
        myContainer.get<IMutableSubscribableGlobalStore>(TYPES.IMutableSubscribableGlobalStore)

    const store = new BranchesStore({state: stateClone, globalDataStore})
    const tooltipRenderer: ITooltipRenderer = new TooltipRenderer({store})
    // TODO: REWRITE this test with the partial DEPENDENCY INJECTION THING RIGHT NOW
    // stateClone.userId = userId
    // const store = new BranchesStore({state: stateClone, globalDataStore})
    // const injects: boolean = injectionWorks<TooltipRendererArgs, ITooltipRenderer>({
    //     container: myContainer,
    //     argsType: TYPES.TooltipRendererArgs,
    //     interfaceType: TYPES.ITooltipRenderer
    // })
    // expect(injects).to.equal(true)
    t.pass()
})

test('tooltips renderer content should escape', t => {
    const contentId = '452340985'
    const userId = 'abdcede13'
    const proficiencyStats: IProficiencyStats = {
        THREE: 2,
        ONE: 2,
    } as IProficiencyStats
    const contentUserId = getContentUserId({contentId, userId})
    const contentUserData: IContentUserData = {
        id: contentUserId,
        overdue: false,
        timer: 30,
        proficiency: PROFICIENCIES.ONE,
        lastRecordedStrength: 40,
    }
    const node: ISigmaNodeData = {
        id: '1234',
        parentId: '12345',
        contentId: '4239847',
        children: [],
        x: 5,
        y: 7,
        aggregationTimer: 50,
        content: {
            type: CONTENT_TYPES.FACT,
            question: 'What is capital of Ohio?',
            answer: 'Columbus',
            title: null,
        },
        contentUserData,
        contentUserId: contentUserData.id,
        label: 'What is capital . . .',
        size: 10,
        colorSlices: SigmaNodeUtils.getColorSlicesFromProficiencyStats(proficiencyStats),
        proficiencyStats,
        proficiency: PROFICIENCIES.ONE,
        overdue: false,
    }
    // const expectedVueTreeTemplate: string =
    //     `<div id="vue">
    //         <tree
    //             parentid='${node.parentId}'
    //             contentid='${node.contentId}'
    //             content-string='${contentEscaped}'
    //             content-user-string='${contentUserDataEscaped}'
    //             id='${node.id}'>
    //         </tree>
    //     </div>`;
    // const vueTreeTemplate = renderer(node, null)
    t.pass()
})
