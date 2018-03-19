import {injectFakeDom} from '../../testHelpers/injectFakeDom';
import test from 'ava';
import {expect} from 'chai';
import 'reflect-metadata';
import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    CONTENT_TYPES,
    IContentData,
    IMutableSubscribableContent,
    ISyncableMutableSubscribableContent
} from '../../objects/interfaces';
import {ContentDeserializer} from './ContentDeserializer';
import {myContainerLoadAllModules} from '../../../inversify.config';
import {SyncableMutableSubscribableContent} from '../../objects/content/SyncableMutableSubscribableContent';

injectFakeDom();

myContainerLoadAllModules({fakeSigma: true});
test('ContentDeserializer::: deserializeFromDB Should deserializeFromDB properly', (t) => {
    const typeVal = CONTENT_TYPES.FLASHCARD;
    const questionVal = 'What is the Capital of Ohio?';
    const answerVal = 'Columbus';
    const titleVal = null;

    const contentData: IContentData = {
        type: typeVal,
        question: questionVal,
        answer: answerVal,
        title: titleVal,
    };
    const contentId = '092384';

    const type = new MutableSubscribableField<CONTENT_TYPES>({field: typeVal});
    const question = new MutableSubscribableField<string>({field: questionVal});
    const answer = new MutableSubscribableField<string>({field: answerVal});
    const title = new MutableSubscribableField<string>({field: titleVal});
    /* = myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
     // TODO: figure out why DI puts in a bad updatesCallback!
    */
    const expectedContent: ISyncableMutableSubscribableContent = new SyncableMutableSubscribableContent(
        {updatesCallbacks: [], type, question, answer, title}
    );
    const deserializedContent: IMutableSubscribableContent = ContentDeserializer.deserialize({contentData, contentId});
    expect(deserializedContent).to.deep.equal(expectedContent);
    t.pass();
});
