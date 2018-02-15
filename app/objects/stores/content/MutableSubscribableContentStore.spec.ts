// tslint:disable object-literal-sort-keys
import {injectFakeDom} from '../../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../../inversify.config';
import {CONTENT_ID2} from '../../../testHelpers/testHelpers';
import {MutableSubscribableContent} from '../../content/MutableSubscribableContent';
import {MutableSubscribableField} from '../../field/MutableSubscribableField';
import {
    CONTENT_TYPES,
    ContentPropertyMutationTypes,
    ContentPropertyNames, FieldMutationTypes, IIdProppedDatedMutation,
    IMutableSubscribableContentStore, IProppedDatedMutation, ISubscribableContentStoreSource,
} from '../../interfaces';
import {TYPES} from '../../types';
import {MutableSubscribableContentStore} from './MutableSubscribableContentStore';
import {SyncableMutableSubscribableContent} from '../../content/SyncableMutableSubscribableContent';

myContainerLoadAllModules()
test('MutableSubscribableContentStore > addMutation::::addMutation' +
    ' to storeSource should call addMutation on the appropriate item,' +
    ' and with a modified mutation argument that no longer has the id', (t) => {
    const contentId = CONTENT_ID2
    const type = new MutableSubscribableField<CONTENT_TYPES>({field: CONTENT_TYPES.FACT})
    const question = new MutableSubscribableField<string>({field: 'What is capital of Ohio?'})
    const answer = new MutableSubscribableField<string>({field: 'Columbus'})
    const title = new MutableSubscribableField<string>({field: ''})
    const content = new SyncableMutableSubscribableContent({
        type, question, answer, title, updatesCallbacks: [],
    })

    const storeSource: ISubscribableContentStoreSource
        = myContainer.get<ISubscribableContentStoreSource>
    (TYPES.ISubscribableContentStoreSource)
    storeSource.set(contentId, content)
    const contentStore: IMutableSubscribableContentStore = new MutableSubscribableContentStore({
        storeSource,
        updatesCallbacks: []
    })
    const contentAddMutationSpy = sinon.spy(content, 'addMutation')

    const proppedMutation: IProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames> = {
        data: 'California',
        propertyName: ContentPropertyNames.ANSWER,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }

    const sampleMutation: IIdProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames> = {
        ...proppedMutation,
        id: contentId,
    }

    contentStore.addMutation(sampleMutation)

    expect(contentAddMutationSpy.callCount).to.equal(1)
    const calledWith = contentAddMutationSpy.getCall(0).args[0]
    expect(calledWith).to.deep.equal(proppedMutation)
    t.pass()
})
test('MutableSubscribableContentStore > addMutation::::addMutation' +
    ' to storeSource that doesn\'t contain the item (and I guess couldn\'t load it on the fly' +
    ' it either, should throw a RangeError', (t) => {
    const contentId = CONTENT_ID2
    const nonExistentId = 'abdf1295'
    const type = new MutableSubscribableField<CONTENT_TYPES>({field: CONTENT_TYPES.FACT})
    const question = new MutableSubscribableField<string>({field: 'What is capital of Ohio?'})
    const answer = new MutableSubscribableField<string>({field: 'Columbus'})
    const title = new MutableSubscribableField<string>({field: ''})
    const content = new SyncableMutableSubscribableContent({
        type, question, answer, title, updatesCallbacks: [],
    })

    const storeSource: ISubscribableContentStoreSource
        = myContainer.get<ISubscribableContentStoreSource>
    (TYPES.ISubscribableContentStoreSource)
    storeSource.set(contentId, content)

    const contentStore: IMutableSubscribableContentStore = new MutableSubscribableContentStore({
        storeSource,
        updatesCallbacks: []
    })

    const proppedMutation: IProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames> = {
        data: 'California',
        propertyName: ContentPropertyNames.ANSWER,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }

    const sampleMutation: IIdProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames> = {
        ...proppedMutation,
        id: nonExistentId,
    }
    expect(() => contentStore.addMutation(sampleMutation)).to.throw(RangeError)
    t.pass()
})
