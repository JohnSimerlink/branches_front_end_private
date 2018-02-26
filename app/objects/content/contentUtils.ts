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
    const stringified = stringify(objectToStringify)
    const contentId = md5(stringified)
    log('J14J - createContentId  called', contentId)
    return contentId
}
