import {
    IContentUserData,
    IContentUserDataFromDB,
    IMutableSubscribableField,
    ISyncableMutableSubscribableContentUser,
    timestamp
} from '../interfaces';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {SyncableMutableSubscribableContentUser} from './SyncableMutableSubscribableContentUser';

export const sampleContentUser1ContentId = '423487234';
export const sampleContentUser1UserId = '12476abc';
export const sampleContentUser1Id =
    getContentUserId({contentId: sampleContentUser1ContentId, userId: sampleContentUser1UserId});
export const sampleContentUser1OverdueVal = true;
export const sampleContentUser1LastRecordedStrengthVal = 30;
export const sampleContentUser1ProficiencyVal = PROFICIENCIES.TWO;
export const sampleContentUser1TimerVal = 30;
export const sampleContentUser1NextReviewTimeVal = Date.now() + 1000 * 60;
export const sampleContentUser1LastInteractionTimeVal = Date.now();
export const sampleContentUser1Overdue = new MutableSubscribableField<boolean>({field: sampleContentUser1OverdueVal});
export const sampleContentUser1LastRecordedStrength = new MutableSubscribableField<number>({field: 45});
export const sampleContentUser1Proficiency = new MutableSubscribableField<PROFICIENCIES>({field: PROFICIENCIES.TWO});
export const sampleContentUser1Timer = new MutableSubscribableField<number>({field: 30});
export const sampleContentUser1LastInteractionTime: IMutableSubscribableField<timestamp> =
    new MutableSubscribableField<timestamp>({field: sampleContentUser1LastInteractionTimeVal});
export const sampleContentUser1NextReviewTime: IMutableSubscribableField<timestamp> =
    new MutableSubscribableField<timestamp>({field: sampleContentUser1NextReviewTimeVal});
export const sampleContentUserDataFromDB1: IContentUserDataFromDB = {
    id: sampleContentUser1Id,
    overdue: {
        val: sampleContentUser1OverdueVal,
    },
    lastRecordedStrength: {
        val: sampleContentUser1LastRecordedStrengthVal,
    },
    proficiency: {
        val: sampleContentUser1ProficiencyVal,
    },
    timer: {
        val: sampleContentUser1TimerVal
    },
    lastInteractionTime: {
        val: sampleContentUser1LastInteractionTimeVal,
    },
    nextReviewTime: {
        val: sampleContentUser1NextReviewTimeVal,
    }
};
export const sampleContentUserData1: IContentUserData = {
    id: sampleContentUser1Id,
    overdue: sampleContentUser1OverdueVal,
    lastEstimatedStrength: sampleContentUser1LastRecordedStrengthVal,
    proficiency: sampleContentUser1ProficiencyVal,
    timer: sampleContentUser1TimerVal,
    lastInteractionTime: sampleContentUser1LastInteractionTimeVal,
    nextReviewTime: sampleContentUser1NextReviewTimeVal,
};
export const sampleContentUser1: ISyncableMutableSubscribableContentUser = new SyncableMutableSubscribableContentUser({
    id: sampleContentUser1Id,
    overdue: sampleContentUser1Overdue,
    lastEstimatedStrength: sampleContentUser1LastRecordedStrength,
    proficiency: sampleContentUser1Proficiency,
    timer: sampleContentUser1Timer,
    lastInteractionTime: sampleContentUser1LastInteractionTime,
    nextReviewTime: sampleContentUser1NextReviewTime,
    updatesCallbacks: [],
});
