// tslint:disable object-literal-sort-keys
import {expect} from 'chai'
import {ContentItemUtils, QUESTION_ANSWER_LABEL_SEPARATOR} from './ContentItemUtils';
import {CONTENT_TYPES} from './ContentTypes';
import {IContentData} from './IContentData';

describe('ContentItemUtils', () => {
    it('Should properly return title for Category', () => {
        const A_TITLE = 'History'
        const contentData: IContentData = {
            title:  A_TITLE,
            type: CONTENT_TYPES.CATEGORY,
        }
        expect(ContentItemUtils.getLabelFromContent(contentData)).to.equal(A_TITLE)
    })
    it('Should properly return title for skilll', () => {
        const A_TITLE = 'Taking derivatives of a x ^ n'
        const contentData: IContentData = {
            title:  A_TITLE,
            type: CONTENT_TYPES.SKILL,
        }
        expect(ContentItemUtils.getLabelFromContent(contentData)).to.equal(A_TITLE)
    })
    it('Should properly return title for skilll', () => {
        const question = 'What is capital of Ohio?'
        const answer = 'Columbus'
        const contentData: IContentData = {
            question,
            answer,
            type: CONTENT_TYPES.FACT,
        }
        const expectedTitle = question + QUESTION_ANSWER_LABEL_SEPARATOR + answer
        expect(ContentItemUtils.getLabelFromContent(contentData)).to.equal(expectedTitle)
    })
})
