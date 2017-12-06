// tslint:disable object-literal-sort-keys
import {expect} from 'chai'
import * as sinon from 'sinon'
import {CONTENT_ID2} from '../../../testHelpers/testHelpers';
import {MutableSubscribableContent} from '../../content/MutableSubscribableContent';
import {SubscribableMutableField} from '../../field/SubscribableMutableField';
import {
    CONTENT_TYPES,
    ContentPropertyMutationTypes,
    ContentPropertyNames, FieldMutationTypes, IIdProppedDatedMutation, IMutableSubscribableContentStore,
    IProppedDatedMutation
} from '../../interfaces';
import {PROFICIENCIES} from '../../proficiency/proficiencyEnum';
import {MutableSubscribableContentStore} from './MutableSubscribableContentStore';

describe('MutableSubscribableContentStore > addMutation', () => {
    it('addMutation to store should call addMutation on the appropriate item,' +
        ' and with a modified mutation argument that no longer has the id', () => {
        const contentId = CONTENT_ID2
        const type = new SubscribableMutableField<CONTENT_TYPES>({field: CONTENT_TYPES.FACT})
        const question = new SubscribableMutableField<string>({field: 'What is capital of Ohio?'})
        const answer = new SubscribableMutableField<string>({field: 'Columbus'})
        const title = new SubscribableMutableField<string>({field: ''})
        const content = new MutableSubscribableContent({
            type, question, answer, title, updatesCallbacks: [],
        })
        const store = {}
        store[contentId] = content
        const contentStore: IMutableSubscribableContentStore = new MutableSubscribableContentStore({
            store,
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
    })
    it('addMutation to store that doesn\'t contain the item (and I guess couldn\'t load it on the fly' +
        ' it either, should throw a RangeError', () => {
        const contentId = CONTENT_ID2
        const nonExistentId = 'abdf1295'
        const type = new SubscribableMutableField<CONTENT_TYPES>({field: CONTENT_TYPES.FACT})
        const question = new SubscribableMutableField<string>({field: 'What is capital of Ohio?'})
        const answer = new SubscribableMutableField<string>({field: 'Columbus'})
        const title = new SubscribableMutableField<string>({field: ''})
        const content = new MutableSubscribableContent({
            type, question, answer, title, updatesCallbacks: [],
        })
        const store = {}
        store[contentId] = content
        const contentStore: IMutableSubscribableContentStore = new MutableSubscribableContentStore({
            store,
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
    })
})
