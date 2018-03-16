// tslint:disable object-literal-sort-keys
import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import {IContentData} from '../interfaces';
import {CONTENT_TYPES} from '../interfaces';
import {ContentItemUtils, QUESTION_ANSWER_LABEL_SEPARATOR} from './ContentItemUtils';
import {myContainerLoadAllModules} from '../../../inversify.config';
myContainerLoadAllModules({fakeSigma: true});
test('ContentItemUtils:::Should properly return title for Category', (t) => {
    const A_TITLE = 'History';
    const contentData: IContentData = {
        title:  A_TITLE,
        type: CONTENT_TYPES.CATEGORY,
    };
    expect(ContentItemUtils.getLabelFromContent(contentData)).to.equal(A_TITLE);
    t.pass()
});
test('ContentItemUtils:::Should properly return title for skill', (t) => {
    const A_TITLE = 'Taking derivatives of a x ^ n';
    const contentData: IContentData = {
        title:  A_TITLE,
        type: CONTENT_TYPES.SKILL,
    };
    expect(ContentItemUtils.getLabelFromContent(contentData)).to.equal(A_TITLE);
    t.pass()
});
test('ContentItemUtils:::Should properly return title for question', (t) => {
    const question = 'What is capital of Ohio?';
    const answer = 'Columbus';
    const contentData: IContentData = {
        question,
        answer,
        type: CONTENT_TYPES.FLASHCARD,
    };
    const expectedTitle = question + QUESTION_ANSWER_LABEL_SEPARATOR + answer;
    expect(ContentItemUtils.getLabelFromContent(contentData)).to.equal(question);
    t.pass()
});
