import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {
    CONTENT_TYPES,
} from '../interfaces';
import {SubscribableContent} from './SubscribableContent';
import {myContainerLoadAllModules} from '../../../inversify.config';

myContainerLoadAllModules({fakeSigma: true});
test('SubscribableContent:::constructor should set all the subscribable properties', (t) => {
    const type = new MutableSubscribableField<CONTENT_TYPES>({field: CONTENT_TYPES.FLASHCARD});
    const question = new MutableSubscribableField<string>({field: 'What is capital of Ohio?'});
    const answer = new MutableSubscribableField<string>({field: 'Columbus'});
    const title = new MutableSubscribableField<string>({field: ''});
    const content = new SubscribableContent({
        type, question, answer, title, updatesCallbacks: [],
    });
    expect(content.type).to.deep.equal(type);
    expect(content.question).to.deep.equal(question);
    expect(content.answer).to.deep.equal(answer);
    expect(content.title).to.deep.equal(title);
    t.pass()
});
test('SubscribableContent:::.val() should display the value of the branchesMap', (t) => {
    const type = new MutableSubscribableField<CONTENT_TYPES>({field: CONTENT_TYPES.FLASHCARD});
    const question = new MutableSubscribableField<string>({field: 'What is capital of Ohio?'});
    const answer = new MutableSubscribableField<string>({field: 'Columbus'});
    const title = new MutableSubscribableField<string>({field: ''});
    const content = new SubscribableContent({
        title, question, answer, type, updatesCallbacks: [],
    });

    const expectedVal = {
        title: title.val(),
        type: type.val(),
        answer: answer.val(),
        question: question.val(),
    };

    expect(content.val()).to.deep.equal(expectedVal);
    t.pass()
});
test('SubscribableContent:::startPublishing() should call the onUpdate methods of' +
    ' all member Subscribable properties', (t) => {
    const type = new MutableSubscribableField<CONTENT_TYPES>({field: CONTENT_TYPES.FLASHCARD});
    const question = new MutableSubscribableField<string>({field: 'What is capital of Ohio?'});
    const answer = new MutableSubscribableField<string>({field: 'Columbus'});
    const title = new MutableSubscribableField<string>({field: ''});
    const content = new SubscribableContent({
        title, question, answer, type, updatesCallbacks: [],
    });
    const titleOnUpdateSpy = sinon.spy(title, 'onUpdate');
    const typeOnUpdateSpy = sinon.spy(type, 'onUpdate');
    const answerOnUpdateSpy = sinon.spy(answer, 'onUpdate');
    const questionOnUpdateSpy = sinon.spy(question, 'onUpdate');

    content.startPublishing();
    expect(questionOnUpdateSpy.callCount).to.deep.equal(1);
    expect(titleOnUpdateSpy.callCount).to.deep.equal(1);
    expect(typeOnUpdateSpy.callCount).to.deep.equal(1);
    expect(answerOnUpdateSpy.callCount).to.deep.equal(1);
    t.pass()
});
