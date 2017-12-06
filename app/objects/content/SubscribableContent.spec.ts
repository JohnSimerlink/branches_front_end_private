import {expect} from 'chai'
import * as sinon from 'sinon'
import {SubscribableMutableField} from '../field/SubscribableMutableField';
import {
    CONTENT_TYPES,
} from '../interfaces';
import {SubscribableContent} from './SubscribableContent';

describe('SubscribableContent', () => {
    it('constructor should set all the subscribable properties', () => {
        const type = new SubscribableMutableField<CONTENT_TYPES>({field: CONTENT_TYPES.FACT})
        const question = new SubscribableMutableField<string>({field: 'What is capital of Ohio?'})
        const answer = new SubscribableMutableField<string>({field: 'Columbus'})
        const title = new SubscribableMutableField<string>({field: ''})
        const content = new SubscribableContent({
            type, question, answer, title, updatesCallbacks: [],
        })
        expect(content.type).to.deep.equal(type)
        expect(content.question).to.deep.equal(question)
        expect(content.answer).to.deep.equal(answer)
        expect(content.title).to.deep.equal(title)
    })
    it('.val() should display the value of the object', () => {
        const type = new SubscribableMutableField<CONTENT_TYPES>({field: CONTENT_TYPES.FACT})
        const question = new SubscribableMutableField<string>({field: 'What is capital of Ohio?'})
        const answer = new SubscribableMutableField<string>({field: 'Columbus'})
        const title = new SubscribableMutableField<string>({field: ''})
        const content = new SubscribableContent({
            title, question, answer, type, updatesCallbacks: [],
        })

        const expectedVal = {
            title: title.val(),
            type: type.val(),
            answer: answer.val(),
            question: question.val(),
        }

        expect(content.val()).to.deep.equal(expectedVal)
    })
    it('startPublishing() should call the onUpdate methods of all member Subscribable properties', () => {
        const type = new SubscribableMutableField<CONTENT_TYPES>({field: CONTENT_TYPES.FACT})
        const question = new SubscribableMutableField<string>({field: 'What is capital of Ohio?'})
        const answer = new SubscribableMutableField<string>({field: 'Columbus'})
        const title = new SubscribableMutableField<string>({field: ''})
        const content = new SubscribableContent({
            title, question, answer, type, updatesCallbacks: [],
        })
        const titleOnUpdateSpy = sinon.spy(title, 'onUpdate')
        const typeOnUpdateSpy = sinon.spy(type, 'onUpdate')
        const answerOnUpdateSpy = sinon.spy(answer, 'onUpdate')
        const questionOnUpdateSpy = sinon.spy(question, 'onUpdate')

        content.startPublishing()
        expect(questionOnUpdateSpy.callCount).to.deep.equal(1)
        expect(titleOnUpdateSpy.callCount).to.deep.equal(1)
        expect(typeOnUpdateSpy.callCount).to.deep.equal(1)
        expect(answerOnUpdateSpy.callCount).to.deep.equal(1)
    })
})
