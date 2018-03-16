import {injectFakeDom} from '../../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../../inversify.config';
import {CONTENT_ID2} from '../../../testHelpers/testHelpers';
import {MutableSubscribableContent} from '../../content/MutableSubscribableContent';
import {MutableSubscribableField} from '../../field/MutableSubscribableField';
import {
    CONTENT_TYPES,
    ContentPropertyNames, FieldMutationTypes, IMutableSubscribableContent, IProppedDatedMutation,
    ISubscribableContentStore, ISubscribableContentStoreSource, ISubscribableStoreSource
} from '../../interfaces';
import {TYPES} from '../../types';
import {SubscribableContentStore} from './SubscribableContentStore';

myContainerLoadAllModules({fakeSigma: true});
test('SubscribableContentStore > addItem:::An update' +
    ' in a member content should be published to a subscriber of the content data stores', (t) => {
    /* TODO: Note this is more of an integration test than a true unit test.
    It might be that some of these modules are designed poorly, being the reason
     why I couldn't find an easy way to do a pure unit test.
     e.g. rather than just triggering an update directly on content,
     I had to do it indirectly by adding a mutation
     */
    const contentId = CONTENT_ID2;
    const type = new MutableSubscribableField<CONTENT_TYPES>({field: CONTENT_TYPES.FLASHCARD});
    const question = new MutableSubscribableField<string>({field: 'What is capital of Ohio?'});
    const answer = new MutableSubscribableField<string>({field: 'Columbus'});
    const title = new MutableSubscribableField<string>({field: ''});
    const content = new MutableSubscribableContent({
        type, question, answer, title, updatesCallbacks: [],
    });

    const storeSource: ISubscribableContentStoreSource
        = myContainer.get<ISubscribableContentStoreSource>
    (TYPES.ISubscribableContentStoreSource);
    const contentStore: ISubscribableContentStore = new SubscribableContentStore({
        storeSource,
        updatesCallbacks: []
    });
    // const contentStore = myContainer.get<ISubscribableContentStore>(TYPES.ISubscribableContentStore)
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    contentStore.onUpdate(callback1);
    contentStore.onUpdate(callback2);
    contentStore.startPublishing();
    /* TODO: add test to put subscribeToAllItems() before the onUpdates to show it works irrespective of order
     */
    contentStore.addItem(contentId, content);

    const sampleMutation: IProppedDatedMutation<FieldMutationTypes, ContentPropertyNames> = {
        data: 'Sacramento',
        propertyName: ContentPropertyNames.ANSWER,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    };

    content.addMutation(sampleMutation);

    const contentNewVal = content.val();
    expect(callback1.callCount).to.equal(1);
    expect(callback1.getCall(0).args[0].id).to.equal(contentId);
    expect(callback1.getCall(0).args[0].val).to.deep.equal(contentNewVal);
    expect(callback2.callCount).to.equal(1);
    expect(callback2.getCall(0).args[0].id).to.equal(contentId);
    expect(callback2.getCall(0).args[0].val).to.deep.equal(contentNewVal);
    t.pass()
});
