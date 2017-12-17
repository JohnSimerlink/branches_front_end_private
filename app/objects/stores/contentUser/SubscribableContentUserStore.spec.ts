import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../../inversify.config';
import {CONTENT_ID2} from '../../../testHelpers/testHelpers';
import {MutableSubscribableContentUser} from '../../contentUserData/MutableSubscribableContentUser';
import {SubscribableMutableField} from '../../field/SubscribableMutableField';
import {
    ContentUserPropertyNames, FieldMutationTypes, IProppedDatedMutation, ISubscribableContentUserCore,
    ISubscribableContentUserStore
} from '../../interfaces';
import {PROFICIENCIES} from '../../proficiency/proficiencyEnum';
import {TYPES} from '../../types';
import {SubscribableStore} from '../SubscribableStore';
import {SubscribableContentUserStore} from './SubscribableContentUserStore';

test('SubscribableContentUserStore > addAndSubscribeToItem:::' +
    'An update in a member content should be published to a subscriber of the content data stores', (t) => {
    /* TODO: Note this is more of an integration test than a true unit test.
    It might be that some of these modules are designed poorly, being the reason
     why I couldn't find an easy way to do a pure unit test.
     e.g. rather than just triggering an update directly on content,
     I had to do it indirectly by adding a mutation
     */
    const contentId = CONTENT_ID2
    const overdue = new SubscribableMutableField<boolean>({field: false})
    const lastRecordedStrength = new SubscribableMutableField<number>({field: 45})
    const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
    const timer = new SubscribableMutableField<number>({field: 30})
    const contentUser = new MutableSubscribableContentUser({
        lastRecordedStrength, overdue, proficiency, timer, updatesCallbacks: [],
    })
    const contentUserStore: ISubscribableContentUserStore
        = myContainer.get<ISubscribableContentUserStore>(TYPES.ISubscribableContentUserStore)
    // const contentUserStore = myContainer.get<ISubscribableContentUserStore>(TYPES.ISubscribableContentUserStore)
    const callback1 = sinon.spy()
    const callback2 = sinon.spy()

    contentUserStore.onUpdate(callback1)
    contentUserStore.onUpdate(callback2)
    contentUserStore.startPublishing()
    /* TODO: add test to put subscribeToAllItems() before the onUpdates to show it works irrespective of order
     */
    contentUserStore.addAndSubscribeToItem(contentId, contentUser)

    const sampleMutation: IProppedDatedMutation<FieldMutationTypes, ContentUserPropertyNames> = {
        data: PROFICIENCIES.TWO,
        propertyName: ContentUserPropertyNames.PROFICIENCY,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }

    contentUser.addMutation(sampleMutation)

    const contentUserNewVal = contentUser.val()
    // expect(callback1.callCount).to.equal(1)
    // expect(callback1.getCall(0).args[0].id).to.equal(contentId)
    // expect(callback1.getCall(0).args[0].val).to.deep.equal(contentUserNewVal)
    // expect(callback2.callCount).to.equal(1)
    expect(callback2.getCall(0).args[0].id).to.equal(contentId)
    expect(callback2.getCall(0).args[0].val).to.deep.equal(contentUserNewVal)
    t.pass()
})
