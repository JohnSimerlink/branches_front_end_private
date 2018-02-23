import {
    IContentUserData, IContentUserDataFromDB, ISubscribableMutableField, ISyncableMutableSubscribableContentUser,
    timestamp
} from '../interfaces';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {SyncableMutableSubscribableContentUser} from './SyncableMutableSubscribableContentUser';

const contentId = '423487234'
const userId = '12476abc'
export const sampleContentUserId1 = getContentUserId({contentId, userId})
const overdueVal = true
const lastRecordedStrengthVal = 30
const proficiencyVal = PROFICIENCIES.TWO
const timerVal = 30
const nextReviewTimeVal = Date.now() + 1000 * 60
const lastInteractionTimeVal = Date.now()
const overdue = new MutableSubscribableField<boolean>({field: false})
const lastRecordedStrength = new MutableSubscribableField<number>({field: 45})
const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
const timer = new MutableSubscribableField<number>({field: 30})
const lastInteractionTime: ISubscribableMutableField<timestamp> =
    new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal})
const nextReviewTime: ISubscribableMutableField<timestamp> =
    new MutableSubscribableField<timestamp>({field: nextReviewTimeVal})
export const sampleContentUserDataFromDB1: IContentUserDataFromDB = {
    id: sampleContentUserId1,
    overdue: {
        val: overdueVal,
    },
    lastRecordedStrength: {
        val: lastRecordedStrengthVal,
    },
    proficiency: {
        val: proficiencyVal,
    },
    timer: {
        val: timerVal
    },
    lastInteractionTime: {
        val: lastInteractionTimeVal,
    },
    nextReviewTime: {
        val: nextReviewTimeVal,
    }
}
export const sampleContentUserData1: IContentUserData = {
    id: sampleContentUserId1,
    overdue: overdueVal,
    lastEstimatedStrength: lastRecordedStrengthVal,
    proficiency: proficiencyVal,
    timer: timerVal,
    lastInteractionTime: lastInteractionTimeVal,
    nextReviewTime: nextReviewTimeVal,
}
export const sampleContentUser1: ISyncableMutableSubscribableContentUser = new SyncableMutableSubscribableContentUser({
    id: sampleContentUserId1,
    overdue,
    lastEstimatedStrength: lastRecordedStrength,
    proficiency,
    timer,
    lastInteractionTime,
    nextReviewTime,
    updatesCallbacks: [],
})
