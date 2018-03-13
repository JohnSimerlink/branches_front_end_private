// tslint:disable object-literal-sort-keys
import {injectFakeDom} from '../../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../../inversify.config';
import {CONTENT_ID2} from '../../../testHelpers/testHelpers';
import {MutableSubscribableContentUser} from '../../contentUser/MutableSubscribableContentUser';
import {MutableSubscribableField} from '../../field/MutableSubscribableField';
import {
    ContentUserPropertyMutationTypes,
    ContentUserPropertyNames, FieldMutationTypes, IContentUserData, IIdProppedDatedMutation,
    IMutableSubscribableContentUser,
    IMutableSubscribableContentUserStore, IProppedDatedMutation, ISubscribableContentStoreSource,
    ISubscribableContentUserStoreSource,
    ISubscribableStoreSource,
    timestamp,
} from '../../interfaces';
import {PROFICIENCIES} from '../../proficiency/proficiencyEnum';
import {TYPES} from '../../types';
import {MutableSubscribableContentUserStore} from './MutableSubscribableContentUserStore';
import {ContentUserDeserializer} from '../../../loaders/contentUser/ContentUserDeserializer';
import {getContentUserId} from '../../../loaders/contentUser/ContentUserLoaderUtils';
import {SyncableMutableSubscribableContentUser} from '../../contentUser/SyncableMutableSubscribableContentUser';
import {IMutableSubscribableField} from '../../interfaces';

myContainerLoadAllModules({fakeSigma: true})
test('MutableSubscribableContentUserStore > addMutation::::addMutation' +
    ' to storeSource should call addMutation on the appropriate item,' +
    ' and with a modified mutation argument that no longer has the id', (t) => {
    const userId = 'abcd_1234'
    const contentId = CONTENT_ID2
    const contentUserId = getContentUserId({userId, contentId})
    const nextReviewTimeVal = Date.now() + 1000 * 60
    const lastInteractionTimeVal = Date.now()
    const overdue = new MutableSubscribableField<boolean>({field: false})
    const lastRecordedStrength = new MutableSubscribableField<number>({field: 45})
    const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
    const timer = new MutableSubscribableField<number>({field: 30})
    const lastInteractionTime: IMutableSubscribableField<timestamp> =
        new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal})
    const nextReviewTime: IMutableSubscribableField<timestamp> =
        new MutableSubscribableField<timestamp>({field: nextReviewTimeVal})
    const contentUser = new SyncableMutableSubscribableContentUser({
        id: contentUserId, lastEstimatedStrength: lastRecordedStrength, overdue, proficiency,
        timer, lastInteractionTime, nextReviewTime, updatesCallbacks: [],
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
    const userId = 'abcd_1234'
    const contentId = CONTENT_ID2
    const contentUserId = getContentUserId({userId, contentId})
    const nonExistentId = 'abdf1295'
    const nextReviewTimeVal = Date.now() + 1000 * 60
    const lastInteractionTimeVal = Date.now()
    const overdue = new MutableSubscribableField<boolean>({field: false})
    const lastRecordedStrength = new MutableSubscribableField<number>({field: 45})
    const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
    const timer = new MutableSubscribableField<number>({field: 30})
    const lastInteractionTime: IMutableSubscribableField<timestamp> =
        new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal})
    const nextReviewTime: IMutableSubscribableField<timestamp> =
        new MutableSubscribableField<timestamp>({field: nextReviewTimeVal})
    const contentUser = new SyncableMutableSubscribableContentUser({
        id: contentUserId, lastEstimatedStrength: lastRecordedStrength, overdue, proficiency, timer,
        lastInteractionTime, nextReviewTime, updatesCallbacks: [],
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

test('MutableSubscribableContentUserStore > addItem::::addMutation' +
    ' should call set() on storeSource', (t) => {
    const userId = 'abcd_1234'
    const contentId = CONTENT_ID2
    const contentUserId = getContentUserId({userId, contentId})
    const contentUserData: IContentUserData = {
        id: contentUserId,
        proficiency: PROFICIENCIES.FOUR,
        timer: 27,
        lastEstimatedStrength: 50,
        overdue: false,
        lastInteractionTime: Date.now(),
        nextReviewTime: Date.now() + 1000 * 60,
    }
    const contentUser = ContentUserDeserializer.deserialize({id: contentUserId, contentUserData})
    const storeSource: ISubscribableContentUserStoreSource
        = myContainer.get<ISubscribableContentUserStoreSource>
    (TYPES.ISubscribableContentUserStoreSource)
    const contentUserStore: IMutableSubscribableContentUserStore = new MutableSubscribableContentUserStore({
        storeSource,
        updatesCallbacks: []
    })
    const contentUserStoreAddAndSubscribeToItemSpy = sinon.spy(contentUserStore, 'addItem')
    contentUserStore.startPublishing()
    contentUserStore.addAndSubscribeToItemFromData({id: contentUserId, contentUserData})
    expect(contentUserStoreAddAndSubscribeToItemSpy.callCount).to.deep.equal(1)
    const calledWithContentUser = contentUserStoreAddAndSubscribeToItemSpy.getCall(0).args[1]
    // expect(calledWithContentUser).to.deep.equal(contentUser)
    t.pass()
})
