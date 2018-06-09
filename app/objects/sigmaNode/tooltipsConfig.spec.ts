import {injectFakeDom} from '../../testHelpers/injectFakeDom';

injectFakeDom();
import test from 'ava';
import 'reflect-metadata';
import {IContentUserData, IProficiencyStats} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {myContainerLoadAllModules} from '../../../inversify.config';

myContainerLoadAllModules({fakeSigma: true});
test('tooltips renderer content should escape', t => {
	const contentId = '452340985';
	const userId = 'abdcede13';
	const proficiencyStats: IProficiencyStats = {
		THREE: 2,
		ONE: 2,
	} as IProficiencyStats;
	const contentUserId = getContentUserId({contentId, userId});
	const nextReviewTimeVal = Date.now() + 1000 * 60;
	const lastInteractionTimeVal = Date.now();
	const contentUserData: IContentUserData = {
		id: contentUserId,
		overdue: false,
		timer: 30,
		proficiency: PROFICIENCIES.ONE,
		lastEstimatedStrength: 40,
		nextReviewTime: nextReviewTimeVal,
		lastInteractionTime: lastInteractionTimeVal,
	};
	// const node: ISigmaNodeData = {
	//      id: '1234',
	//      parentId: '12345',
	//      contentId: '4239847',
	//      children: [],
	//      x: 5,
	//      y: 7,
	//      aggregationTimer: 50,
	//      content: {
	//           type: CONTENT_TYPES.FLASHCARD,
	//           question: 'What is capital of Ohio?',
	//           answer: 'Columbus',
	//           title: null,
	//      },
	//      contentUserData,
	//      contentUserId: contentUserData.id,
	//      label: 'What is capital . . .',
	//      size: 10,
	//      colorSlices: SigmaNodeUtils.getColorSlicesFromProficiencyStats(proficiencyStats),
	//      proficiencyStats,
	//      proficiency: PROFICIENCIES.ONE,
	//      overdue: false,
	//      nextReviewTime: Date.now() + 10000
	// }
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
	t.pass();
});
