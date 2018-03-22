import {injectFakeDom} from '../../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava';
import {expect} from 'chai';
import * as sinon from 'sinon';
import {myContainer, myContainerLoadAllModules} from '../../../../inversify.config';
import {CONTENT_ID2} from '../../../testHelpers/testHelpers';
import {MutableSubscribableContentUser} from '../../contentUser/MutableSubscribableContentUser';
import {MutableSubscribableField} from '../../field/MutableSubscribableField';
import {
    ContentUserPropertyNames,
    FieldMutationTypes,
    IMutableSubscribableField,
    IProppedDatedMutation,
    ISubscribableContentUserStore,
    timestamp
} from '../../interfaces';
import {PROFICIENCIES} from '../../proficiency/proficiencyEnum';
import {TYPES} from '../../types';
import {getContentUserId} from '../../../loaders/contentUser/ContentUserLoaderUtils';
import {getASampleContentUser} from '../../contentUser/contentUserTestHelpers';

myContainerLoadAllModules({fakeSigma: true});
test('SubscribableContentUserStore > addItem:::' +
    'An update in a member contentUser item should be published to a subscriber of the contentUser data store', (t) => {
    const contentId = CONTENT_ID2;
    const userId = 'abc123';
    const contentUserId = getContentUserId({contentId, userId});
    const contentUser = getASampleContentUser({contentId})
    const contentUserStore: ISubscribableContentUserStore
        = myContainer.get<ISubscribableContentUserStore>(TYPES.ISubscribableContentUserStore);
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    contentUserStore.onUpdate(callback1);
    contentUserStore.onUpdate(callback2);
    contentUserStore.startPublishing();
    /* TODO: add test to put subscribeToAllItems() before the onUpdates to show it works irrespective of order
     */
    contentUserStore.addItem(contentUserId, contentUser);

    const sampleMutation: IProppedDatedMutation<FieldMutationTypes, ContentUserPropertyNames> = {
        data: contentUser.timer.val() + 1,
        propertyName: ContentUserPropertyNames.TIMER,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    };

    contentUser.addMutation(sampleMutation);

    const contentUserNewVal = contentUser.val();
    expect(callback1.callCount).to.equal(1)
    expect(callback1.getCall(0).args[0].id).to.equal(contentUserId)
    expect(callback1.getCall(0).args[0].val).to.deep.equal(contentUserNewVal)
    expect(callback2.callCount).to.equal(1)
    expect(callback2.getCall(0).args[0].id).to.equal(contentUserId);
    expect(callback2.getCall(0).args[0].val).to.deep.equal(contentUserNewVal);
    t.pass();
});
