import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {CONTENT_ID} from '../../testHelpers/testHelpers';
import {IContentUserData} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';

const userId = '12345'
const contentUserId = getContentUserId({userId, contentId: CONTENT_ID})
const nextReviewTimeVal = Date.now() + 1000 * 60
const lastInteractionTimeVal = Date.now()
const sampleContentUserData1: IContentUserData = {
    id: contentUserId,
    lastEstimatedStrength: 54, // TODO: this mig
    overdue: true,
    proficiency: PROFICIENCIES.ONE,
    timer: 432,
    nextReviewTime: nextReviewTimeVal,
    lastInteractionTime: lastInteractionTimeVal,
}
