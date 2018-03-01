import {IContentData} from '../interfaces';
import {log} from '../../core/log'
let stringify = require('json-stable-stringify').default
if (!stringify) {
    stringify = require('json-stable-stringify')
}
let md5 = require('md5').default
if (!md5) {
    md5 = require('md5')
}

// TODO: make the id
export function createContentId({question, answer, title, type}: IContentData) {
    log('J14J - createContentId  called', {question, answer, title, type})
    const objectToStringify: IContentData = {} as IContentData
    objectToStringify.type = type
    if (question) {
        objectToStringify.question = question
    }
    if (answer) {
        objectToStringify.answer = answer
    }
    if (title) {
        objectToStringify.title = title
    }
    const objectToStringifyFinal: any = objectToStringify
    if (title) {
        objectToStringifyFinal.random = Math.random() + Date.now()/* We need this field, because when people are creating titles, we need a different id for a Title of "History"
         (under the category of "Africa" vs under the category of "Australia") */
        /* Contrast this to a question/answer pair, where we always want the same question/answer pair to have the same id, regardless of what category it is under
        e.g. "when was Georg Wash born?" "1722"
        if under the American History category should have the same id as if it was a fact created under the Famous People category"

         */
    }
    const stringified = stringify(objectToStringify)
    const contentId = md5(stringified)
    log('J14J - createContentId  called', contentId)
    return contentId
}
