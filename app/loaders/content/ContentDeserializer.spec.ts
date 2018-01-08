import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import {stringArrayToSet} from '../../core/newUtils';
import {SubscribableMutableField} from '../../objects/field/SubscribableMutableField';
import {
    IHash, IMutableSubscribableContent, IContent, IContentData,
    CONTENT_TYPES
} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableContent} from '../../objects/content/MutableSubscribableContent';
import {ContentDeserializer} from './ContentDeserializer';

test('ContentDeserializer::: deserialize Should deserialize properly', (t) => {
    const typeVal = CONTENT_TYPES.FACT
    const questionVal = 'What is the Capital of Ohio?'
    const answerVal = 'Columbus'
    const titleVal = null

    const contentData: IContentData = {
        type: typeVal,
        question: questionVal,
        answer: answerVal,
        title: titleVal,
    }
    const contentId = '092384'

    const type = new SubscribableMutableField<CONTENT_TYPES>({field: typeVal})
    const question = new SubscribableMutableField<string>({field: questionVal})
    const answer = new SubscribableMutableField<string>({field: answerVal})
    const title = new SubscribableMutableField<string>({field: titleVal})
    /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
     // TODO: figure out why DI puts in a bad updatesCallback!
    */
    const expectedContent: IMutableSubscribableContent = new MutableSubscribableContent(
        {updatesCallbacks: [], type, question, answer, title}
    )
    const deserializedContent: IMutableSubscribableContent = ContentDeserializer.deserialize({contentData, contentId})
    expect(deserializedContent).to.deep.equal(expectedContent)
    t.pass()
})
