// tslint:disable object-literal-sort-keys
import {injectFakeDom} from '../../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../../inversify.config';
import {CONTENT_ID2} from '../../../testHelpers/testHelpers';
import {MutableSubscribableContentUser} from '../../contentUser/MutableSubscribableContentUser';
import {SubscribableMutableField} from '../../field/SubscribableMutableField';
import {
    ContentUserPropertyMutationTypes,
    ContentUserPropertyNames, FieldMutationTypes, IIdProppedDatedMutation, IMutableSubscribableContentUser,
    IMutableSubscribableContentUserStore, IProppedDatedMutation, ISubscribableContentStoreSource, ISubscribableContentUserStoreSource,
    ISubscribableStoreSource
} from '../../interfaces';
import {PROFICIENCIES} from '../../proficiency/proficiencyEnum';
import {TYPES} from '../../types';
import {MutableSubscribableContentUserStore} from './MutableSubscribableContentUserStore';

test('MutableSubscribableContentUserStore > addMutation::::addMutation' +
    ' to storeSource should call addMutation on the appropriate item,' +
    ' and with a modified mutation argument that no longer has the id', (t) => {
    const contentId = CONTENT_ID2
    const overdue = new SubscribableMutableField<boolean>({field: false})
    const lastRecordedStrength = new SubscribableMutableField<number>({field: 45})
    const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
    const timer = new SubscribableMutableField<number>({field: 30})
    const contentUser = new MutableSubscribableContentUser({
        lastRecordedStrength, overdue, proficiency, timer, updatesCallbacks: [],
    })
    const storeSource: ISubscribableContentUserStoreSource
        = myContainer.get<ISubscribableContentUserStoreSource>
    (TYPES.ISubscribableContentUserStoreSource)
    storeSource.set(contentId, contentUser)
    const contentUserStore: IMutableSubscribableContentUserStore = new MutableSubscribableContentUserStore({
        storeSource,
        updatesCallbacks: []
    })
    const contentUserAddMutationSpy = sinon.spy(contentUser, 'addMutation')

    const proppedMutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
        data: PROFICIENCIES.TWO,
        propertyName: ContentUserPropertyNames.PROFICIENCY,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }

    const sampleMutation: IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
        ...proppedMutation,
        id: contentId,
    }

    contentUserStore.addMutation(sampleMutation)

    expect(contentUserAddMutationSpy.callCount).to.equal(1)
    const calledWith = contentUserAddMutationSpy.getCall(0).args[0]
    expect(calledWith).to.deep.equal(proppedMutation)
    t.pass()
})
test('MutableSubscribableContentUserStore > addMutation::::addMutation' +
    ' to storeSource that doesn\'t contain the item (and I guess couldn\'t load it on the fly' +
    ' it either, should throw a RangeError', (t) => {
    const contentId = CONTENT_ID2
    const nonExistentId = 'abdf1295'
    const overdue = new SubscribableMutableField<boolean>({field: false})
    const lastRecordedStrength = new SubscribableMutableField<number>({field: 45})
    const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
    const timer = new SubscribableMutableField<number>({field: 30})
    const contentUser = new MutableSubscribableContentUser({
        lastRecordedStrength, overdue, proficiency, timer, updatesCallbacks: [],
    })
    const storeSource: ISubscribableContentUserStoreSource
        = myContainer.get<ISubscribableContentUserStoreSource>
    (TYPES.ISubscribableContentUserStoreSource)
    storeSource.set(contentId, contentUser)
    const contentUserStore: IMutableSubscribableContentUserStore = new MutableSubscribableContentUserStore({
        storeSource,
        updatesCallbacks: []
    })

    const proppedMutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
        data: PROFICIENCIES.TWO,
        propertyName: ContentUserPropertyNames.PROFICIENCY,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }

    const sampleMutation: IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
        ...proppedMutation,
        id: nonExistentId,
    }
    expect(() => contentUserStore.addMutation(sampleMutation)).to.throw(RangeError)
    t.pass()
})
