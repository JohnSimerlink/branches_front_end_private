import {CONTENT_TYPES, IContentData, IContentDataFromDB, decibels, timestamp} from '../interfaces';
import {SyncableMutableSubscribableContentUser} from '../contentUser/SyncableMutableSubscribableContentUser';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {pseudoRandomInt0To100, getSomewhatRandomId} from '../../testHelpers/randomValues';
import {SyncableMutableSubscribableContent} from './SyncableMutableSubscribableContent';

export const sampleContentData1Question = 'What is the capital of California?';
export const sampleContentData1Answer = 'Sacramento';
export const sampleContentData1Type = CONTENT_TYPES.FLASHCARD;
export const sampleContentData1: IContentData = {
    question: sampleContentData1Question,
    answer: sampleContentData1Answer,
    type: sampleContentData1Type,
    title: null,
};
export const sampleContentDataFromDB1: IContentDataFromDB = {
    question: {
        val: sampleContentData1Question,
    } ,
    answer: {
        val: sampleContentData1Answer
    },
    type: {
        val: sampleContentData1Type,
    },
    title: {
        val: null,
    }
};

const sampleContent1Type = new MutableSubscribableField<CONTENT_TYPES>({field: sampleContentData1Type});
const sampleContent1Question = new MutableSubscribableField<string>({field: sampleContentData1Question});
const sampleContent1Answer = new MutableSubscribableField<string>({field: sampleContentData1Answer});
const sampleContent1Title = new MutableSubscribableField<string>({field: null});

export function getASampleContent1() {
    const content = new SyncableMutableSubscribableContent({
        updatesCallbacks: [],
        type: sampleContent1Type, question: sampleContent1Question,
        answer: sampleContent1Answer, title: sampleContent1Title,
    });
    return content;
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
    return pseudoRandomInt0To100() * 10;
}
export function getASampleContent() {
    const id = getSomewhatRandomId();
    const num = pseudoRandomInt0To100();
    const questionVal = 'This is a sample Question ' + num;
    const answerVal = 'This is a sample Answer ' + num;
    const typeVal = CONTENT_TYPES.FLASHCARD;
    const titleVal = null;

    const type = new MutableSubscribableField<CONTENT_TYPES>({field: typeVal});
    const question = new MutableSubscribableField<string>({field: questionVal});
    const answer = new MutableSubscribableField<string>({field: answerVal});
    const title = new MutableSubscribableField<string>({field: titleVal});
    const content = new SyncableMutableSubscribableContent({
        updatesCallbacks: [],
        type, question, answer, title
    })

    return content;
}
