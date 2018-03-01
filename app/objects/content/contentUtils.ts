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
    const objectToStringify: any = {
        time: Date.now(),
        random: Math.random()
    } /* TODO: generate the id via firebase or server side . . .
     e.g. using some sort of firebaseRef.push() method where the id is returned */
    /* Some malicious person could hardcode an id and send a new contentItem at an id
     that already exists to erase currently existing data */
    const stringified = JSON.stringify(objectToStringify)
    const contentId = md5(stringified)
    log('J14J - createContentId  called', contentId)
    return contentId
}
