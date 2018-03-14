import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {CONTENT_ID} from '../../testHelpers/testHelpers';
import {IContentUserData, timestamp, decibels} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {calculateNextReviewTime} from '../../forgettingCurve'
import {pseudoRandomInt0To100, getSomewhatRandomId} from '../../testHelpers/randomValues'
import {MutableSubscribableField} from '../field/MutableSubscribableField'
import {SyncableMutableSubscribableContentUser} from './SyncableMutableSubscribableContentUser'

const userId = '12345';
const contentUserId = getContentUserId({userId, contentId: CONTENT_ID});
const nextReviewTimeVal = Date.now() + 1000 * 60;
const lastInteractionTimeVal = Date.now();
const sampleContentUserData1: IContentUserData = {
    id: contentUserId,
    lastEstimatedStrength: 54, // TODO: this mig
    overdue: true,
    proficiency: PROFICIENCIES.ONE,
    timer: 432,
    nextReviewTime: nextReviewTimeVal,
    lastInteractionTime: lastInteractionTimeVal,
};

export function getASampleContentUser1() {

}
function getRandomLastEstimatedStrengthVal(): decibels{
    return pseudoRandomInt0To100()
}
// some time in the last month
function getRandomLastInteractionTimeVal(): timestamp {
    const millisecondsSinceLastInteraction = pseudoRandomInt0To100() * 10 * 60 * 60 * 24 * 30
    const now = Date.now()
    const lastInteractionTimeVal = now - millisecondsSinceLastInteraction

    return lastInteractionTimeVal
}
function getRandomProficiencyVal() {
    return pseudoRandomInt0To100()
}
/*
The user has spent between 0 and 1000 seconds studying this content so far
 */
function getRandomTimerVal() {
    return pseudoRandomInt0To100() * 10
}
export function getASampleContentUser({contentId}) {
    const userId = getSomewhatRandomId()
    const contentUserId = getContentUserId({userId, contentId})
    const lastEstimatedStrengthVal = getRandomLastEstimatedStrengthVal()
    const lastInteractionTimeVal = getRandomLastInteractionTimeVal()
    const nextReviewTimeVal = calculateNextReviewTime({lastInteractionTime: lastInteractionTimeVal, lastInteractionEstimatedStrength: lastEstimatedStrengthVal})
    const proficiencyVal = getRandomProficiencyVal()
    const timerVal = getRandomTimerVal()
    const timeOverdueMilliSecondsFromNow =
        Date.now() - nextReviewTimeVal
    const overdueVal = timeOverdueMilliSecondsFromNow > 0

    const lastEstimatedStrength = new MutableSubscribableField<decibels>({field: lastEstimatedStrengthVal})
    const lastInteractionTime = new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal})
    const nextReviewTime = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal})
    const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: proficiencyVal})
    const timer = new MutableSubscribableField<number>({field: timerVal})
    const overdue = new MutableSubscribableField<boolean>({field: overdueVal})

    const contentUser = new SyncableMutableSubscribableContentUser({
        id: contentUserId,
        updatesCallbacks: [],
        lastEstimatedStrength,
        lastInteractionTime,
        nextReviewTime,
        proficiency,
        timer,
        overdue
    })
    return contentUser
}
