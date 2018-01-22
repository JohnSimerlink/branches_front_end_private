import {IContentData} from '../interfaces';
let stringify = require('json-stable-stringify').default
if (!stringify) {
    stringify = require('json-stable-stringify')
}
let md5 = require('md5').default
if (!md5) {
    md5 = require('md5')
}

export function createContentId({question, answer, title, type}: IContentData) {
    const objectToStringify: IContentData = {} as IContentData
    objectToStringify.type = type
    if (question) {
        objectToStringify.question = question
    }
    if (answer) {
        objectToStringify.question = question
    }
    if (title) {
        objectToStringify.title = title
    }
    const stringified = stringify(objectToStringify)
    const contentId = md5(stringified)
    return contentId
}
