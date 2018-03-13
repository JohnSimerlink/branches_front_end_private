import {IContentData, id} from '../interfaces';
let stringify = require('json-stable-stringify').default;
if (!stringify) {
    stringify = require('json-stable-stringify')
}
let md5 = require('md5').default;
if (!md5) {
    md5 = require('md5')
}

export function createTreeId({contentId, parentId}: {contentId: id, parentId: id}): id {
    const objectToStringify = {
        contentId, parentId
    };
    const stringified = stringify(objectToStringify);
    const treeId = md5(stringified);
    return treeId
}
