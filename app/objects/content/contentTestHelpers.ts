import {CONTENT_TYPES, IContentData, IContentDataFromDB} from '../interfaces';

export const sampleContentData1: IContentData = {
    answer: 'Sacramento',
    question: 'What is the capital of California?',
    type: CONTENT_TYPES.FACT,
}
export const sampleContentDataFromDB1: IContentDataFromDB = {
    answer: {
        val: 'Sacramento'
    },
    question: {
        val: 'What is the capital of California?',
    } ,
    type: {
        val: CONTENT_TYPES.FACT,
    },
    title: {
        val: null,
    }
}
