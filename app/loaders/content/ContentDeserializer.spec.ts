import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import {stringArrayToSet} from '../../core/newUtils';
import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IHash, IMutableSubscribableContent, IContent, IContentData,
    CONTENT_TYPES, ISyncableMutableSubscribableContent
} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableContent} from '../../objects/content/MutableSubscribableContent';
import {ContentDeserializer} from './ContentDeserializer';
import {myContainerLoadAllModules} from '../../../inversify.config';
import {SyncableMutableSubscribableContent} from '../../objects/content/SyncableMutableSubscribableContent';

myContainerLoadAllModules()
test('ContentDeserializer::: deserializeFromDB Should deserializeFromDB properly', (t) => {
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

    const type = new MutableSubscribableField<CONTENT_TYPES>({field: typeVal})
    const question = new MutableSubscribableField<string>({field: questionVal})
    const answer = new MutableSubscribableField<string>({field: answerVal})
    const title = new MutableSubscribableField<string>({field: titleVal})
    /* = myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
     // TODO: figure out why DI puts in a bad updatesCallback!
    */
    const expectedContent: ISyncableMutableSubscribableContent = new SyncableMutableSubscribableContent(
        {updatesCallbacks: [], type, question, answer, title}
    )
    const deserializedContent: IMutableSubscribableContent = ContentDeserializer.deserialize({contentData, contentId})
    expect(deserializedContent).to.deep.equal(expectedContent)
    t.pass()
})
