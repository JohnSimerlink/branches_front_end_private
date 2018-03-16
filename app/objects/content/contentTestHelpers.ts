import {CONTENT_TYPES, IContentData, IContentDataFromDB, decibels, timestamp} from '../interfaces';
import {SyncableMutableSubscribableContentUser} from '../contentUser/SyncableMutableSubscribableContentUser'
import {MutableSubscribableField} from '../field/MutableSubscribableField'
import {pseudoRandomInt0To100, getSomewhatRandomId} from '../../testHelpers/randomValues'
import {SyncableMutableSubscribableContent} from './SyncableMutableSubscribableContent'

export const sampleContentData1: IContentData = {
    answer: 'Sacramento',
    question: 'What is the capital of California?',
    type: CONTENT_TYPES.FLASHCARD,
};
export const sampleContentDataFromDB1: IContentDataFromDB = {
    answer: {
        val: 'Sacramento'
    },
    question: {
        val: 'What is the capital of California?',
    } ,
    type: {
        val: CONTENT_TYPES.FLASHCARD,
    },
    title: {
        val: null,
    }
};

function getRandomLastEstimatedStrengthVal(): decibels {
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
export function getASampleContent() {
    const id = getSomewhatRandomId()
    const num = pseudoRandomInt0To100()
    const questionVal = 'This is a sample Question ' + num
    const answerVal = 'This is a sample Answer ' + num
    const typeVal = CONTENT_TYPES.FLASHCARD
    const titleVal = null

    const type = new MutableSubscribableField<CONTENT_TYPES>({field: typeVal});
    const question = new MutableSubscribableField<string>({field: questionVal});
    const answer = new MutableSubscribableField<string>({field: answerVal});
    const title = new MutableSubscribableField<string>({field: titleVal});
    const content = new SyncableMutableSubscribableContent({
        updatesCallbacks: [],
        type, question, answer, title
    })

    return content
}
