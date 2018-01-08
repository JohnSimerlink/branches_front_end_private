import {IContentData} from '../interfaces';

export function isValidContent(content: IContentData) {
    return isValidContentFact(content)
        || isValidContentNotFact(content)
    // && content.children instanceof Array
}
function isValidContentNotFact(content: IContentData) {
    return content && content.type && content.title
}
function isValidContentFact(content: IContentData) {
    return content && content.type && content.question && content.answer
}
