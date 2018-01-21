import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {
    CONTENT_TYPES, ContentPropertyNames, FieldMutationTypes, IDatedMutation,
    IProppedDatedMutation
} from '../interfaces';
import {SubscribableMutableStringSet} from '../set/SubscribableMutableStringSet';
import {TYPES} from '../types';
import {MutableSubscribableContent} from './MutableSubscribableContent';
test('MutableSubscribableContent:::a mutation in one of the subscribable properties' +
    ' should publish an update of the entire object\'s value '
    + ' after startPublishing has been called', (t) => {
    /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
     // TODO: figure out why DI puts in a bad updatesCallback!
    */

    const type = new MutableSubscribableField<CONTENT_TYPES>({field: CONTENT_TYPES.FACT})
    const question = new MutableSubscribableField<string>({field: 'What is capital of Ohio?'})
    const answer = new MutableSubscribableField<string>({field: 'Columbus'})
    const title = new MutableSubscribableField<string>({field: ''})
    const content = new MutableSubscribableContent({
        type, question, answer, title, updatesCallbacks: [],
    })

    content.startPublishing()

    const callback = sinon.spy()
    content.onUpdate(callback)

    const sampleMutation = myContainer.get<IDatedMutation<FieldMutationTypes>>(TYPES.IProppedDatedMutation)
    // question.addMutation(sampleMutation)
    // const newContentDataValue = content.val()
    // const calledWith = callback.getCall(0).args[0]
    // expect(callback.callCount).to.equal(1)
    // expect(calledWith).to.deep.equal(newContentDataValue)
    t.pass()
})
test('MutableSubscribableContent:::a mutation in one of the subscribable properties' +
    ' should NOT publish an update of the entire object\'s value'
    + ' before startPublishing has been called', (t) => {

    /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
     // TODO: figure out why DI puts in a bad updatesCallback!
    */

    const type = new MutableSubscribableField<CONTENT_TYPES>({field: CONTENT_TYPES.FACT})
    const question = new MutableSubscribableField<string>({field: 'What is capital of Ohio?'})
    const answer = new MutableSubscribableField<string>({field: 'Columbus'})
    const title = new MutableSubscribableField<string>({field: ''})
    const content = new MutableSubscribableContent({
        type, question, answer, title, updatesCallbacks: [],
    })

    const callback = sinon.spy()
    content.onUpdate(callback)

    expect(callback.callCount).to.equal(0)
    t.pass()
})
test('MutableSubscribableContent:::addMutation ' +
    ' should call addMutation on the appropriate descendant property' +
    'and that mutation called on the descendant property should no longer have the propertyName on it', (t) => {
    const type = new MutableSubscribableField<CONTENT_TYPES>({field: CONTENT_TYPES.FACT})
    const question = new MutableSubscribableField<string>({field: 'What is capital of Ohio?'})
    const answer = new MutableSubscribableField<string>({field: 'Columbus'})
    const title = new MutableSubscribableField<string>({field: ''})
    const content = new MutableSubscribableContent({
        type, question, answer, title, updatesCallbacks: [],
    })
    const questionAddMutationSpy = sinon.spy(question, 'addMutation')

    // tslint:disable variable-name
    const mutationWithoutPropName: IDatedMutation<FieldMutationTypes> = {
        data: 'What is the capital of California?',
        timestamp: Date.now(),
        type: FieldMutationTypes.SET
    }
    const mutation: IProppedDatedMutation<FieldMutationTypes, ContentPropertyNames> = {
        ...mutationWithoutPropName,
        propertyName: ContentPropertyNames.QUESTION,
    }

    content.addMutation(mutation)
    expect(questionAddMutationSpy.callCount).to.equal(1)
    const calledWith = questionAddMutationSpy.getCall(0).args[0]
    expect(calledWith).to.deep.equal(mutationWithoutPropName)
    t.pass()

})
