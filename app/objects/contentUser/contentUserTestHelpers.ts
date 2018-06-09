import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {CONTENT_ID} from '../../testHelpers/testHelpers';
import {IContentUserData, timestamp, decibels, IContentUserDataFromDB} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {calculateNextReviewTime} from '../../forgettingCurve';
import {pseudoRandomInt0To100, getSomewhatRandomId} from '../../testHelpers/randomValues';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {SyncableMutableSubscribableContentUser} from './SyncableMutableSubscribableContentUser';

export const sampleContentUser1ContentId = CONTENT_ID;
export const sampleContentUser1UserId = '12345';
export const sampleContentUser1Id = getContentUserId({
	userId: sampleContentUser1UserId,
	contentId: sampleContentUser1ContentId
});

export const sampleContentUser1OverdueVal = true;
export const sampleContentUser1LastEstimatedStrengthVal = 30;
export const sampleContentUser1ProficiencyVal = PROFICIENCIES.TWO;
export const sampleContentUser1TimerVal = 30;
export const sampleContentUser1NextReviewTimeVal = Date.now() + 1000 * 60;
export const sampleContentUser1LastInteractionTimeVal = Date.now();

export const sampleContentUserData1: IContentUserData = {
	id: sampleContentUser1Id,
	lastEstimatedStrength: sampleContentUser1LastEstimatedStrengthVal, // TODO: this mig
	overdue: sampleContentUser1OverdueVal,
	proficiency: sampleContentUser1ProficiencyVal,
	timer: sampleContentUser1TimerVal,
	nextReviewTime: sampleContentUser1NextReviewTimeVal,
	lastInteractionTime: sampleContentUser1LastInteractionTimeVal,
};
export const sampleContentUserData1FromDB: IContentUserDataFromDB = {
	id: sampleContentUser1Id,
	overdue: {
		val: sampleContentUser1OverdueVal,
	},
	lastRecordedStrength: {
		val: sampleContentUser1LastEstimatedStrengthVal,
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

export function getASampleContentUser1() {
	const lastEstimatedStrength =
		new MutableSubscribableField<decibels>({field: sampleContentUserData1.lastEstimatedStrength});
	const lastInteractionTime =
		new MutableSubscribableField<timestamp>({field: sampleContentUserData1.lastInteractionTime});
	const nextReviewTime = new MutableSubscribableField<timestamp>({field: sampleContentUserData1.nextReviewTime})
	const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: sampleContentUserData1.proficiency});
	const timer = new MutableSubscribableField<number>({field: sampleContentUserData1.timer});
	const overdue = new MutableSubscribableField<boolean>({field: sampleContentUserData1.overdue});
	const contentUser1 = new SyncableMutableSubscribableContentUser({
		id: sampleContentUser1Id,
		updatesCallbacks: [],
		lastEstimatedStrength,
		lastInteractionTime,
		nextReviewTime,
		proficiency,
		timer,
		overdue
	});

	return contentUser1;
}

function getRandomLastEstimatedStrengthVal(): decibels {
	return pseudoRandomInt0To100();
}

// some time in the last month
function getRandomLastInteractionTimeVal(): timestamp {
	const millisecondsSinceLastInteraction = pseudoRandomInt0To100() * 10 * 60 * 60 * 24 * 30;
	const now = Date.now();
	const lastInteractionTimeVal = now - millisecondsSinceLastInteraction;

	return lastInteractionTimeVal;
}

function getRandomProficiencyVal() {
	return pseudoRandomInt0To100();
}

/*
The user has spent between 0 and 1000 seconds studying this content so far
 */
function getRandomTimerVal() {
	return pseudoRandomInt0To100() * 10
}

export function getASampleContentUser({contentId}) {
	const userId = getSomewhatRandomId()
	const contentUserId = getContentUserId({userId, contentId});
	const lastEstimatedStrengthVal = getRandomLastEstimatedStrengthVal();
	const lastInteractionTimeVal = getRandomLastInteractionTimeVal();
	const nextReviewTimeVal =
		calculateNextReviewTime({
			lastInteractionTime: lastInteractionTimeVal,
			lastInteractionEstimatedStrength: lastEstimatedStrengthVal
		});
	const proficiencyVal = getRandomProficiencyVal();
	const timerVal = getRandomTimerVal();
	const timeOverdueMilliSecondsFromNow =
		Date.now() - nextReviewTimeVal;
	const overdueVal = timeOverdueMilliSecondsFromNow > 0;

	const lastEstimatedStrength = new MutableSubscribableField<decibels>({field: lastEstimatedStrengthVal});
	const lastInteractionTime = new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal});
	const nextReviewTime = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal})
	const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: proficiencyVal});
	const timer = new MutableSubscribableField<number>({field: timerVal});
	const overdue = new MutableSubscribableField<boolean>({field: overdueVal});

	const contentUser = new SyncableMutableSubscribableContentUser({
		id: contentUserId,
		updatesCallbacks: [],
		lastEstimatedStrength,
		lastInteractionTime,
		nextReviewTime,
		proficiency,
		timer,
		overdue
	});
	return contentUser;
}
