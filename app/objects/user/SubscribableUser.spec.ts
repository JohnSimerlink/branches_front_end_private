import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {
    CONTENT_TYPES, ISyncableMutableSubscribableUser, timestamp,
} from '../interfaces';
import {SubscribableUser} from './SubscribableUser';
import {myContainerLoadAllModules} from '../../../inversify.config';
import {SyncableMutableSubscribableUser} from './SyncableMutableSubscribableUser';
import {
    sampleUser1, sampleUser1EverActivatedMembership, sampleUser1MembershipExpirationDate, sampleUser1Points,
    sampleUserData1
} from './UserTestHelpers';
import points from '../../components/points/points';

myContainerLoadAllModules()

test('SubscribableUser:::.val() should display the value of the object', (t) => {
    const user: ISyncableMutableSubscribableUser = sampleUser1

    const expectedVal = sampleUserData1

    expect(user.val()).to.deep.equal(expectedVal)
    t.pass()
})
test('SubscribableUser:::startPublishing() should call the onUpdate methods of' +
    ' all member Subscribable properties', (t) => {
    const user: ISyncableMutableSubscribableUser = new SyncableMutableSubscribableUser(
        {updatesCallbacks: [], membershipExpirationDate : sampleUser1MembershipExpirationDate, everActivatedMembership :
        sampleUser1EverActivatedMembership, points: sampleUser1Points}
    )

    const membershipExpirationDateOnUpdateSpy = sinon.spy(sampleUser1MembershipExpirationDate, 'onUpdate')
    const everActivatedMembershipOnUpdateSpy = sinon.spy(sampleUser1EverActivatedMembership, 'onUpdate')
    const pointsOnUpdateSpy = sinon.spy(sampleUser1Points, 'onUpdate')

    user.startPublishing()
    expect(membershipExpirationDateOnUpdateSpy.callCount).to.deep.equal(1)
    expect(everActivatedMembershipOnUpdateSpy.callCount).to.deep.equal(1)
    expect(pointsOnUpdateSpy.callCount).to.deep.equal(1)

    t.pass()
})
