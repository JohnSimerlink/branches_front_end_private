import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava';
import {expect} from 'chai';
import 'reflect-metadata';
import * as sinon from 'sinon';
import {ISyncableMutableSubscribableUser,} from '../interfaces';
import {myContainerLoadAllModules} from '../../../inversify.config';
import {SyncableMutableSubscribableUser} from './SyncableMutableSubscribableUser';
import {
    sampleUser1,
    sampleUser1CurrentHoveredTreeId,
    sampleUser1EverActivatedMembership,
    sampleUser1MembershipExpirationDate,
    sampleUser1OpenMapId,
    sampleUser1Points,
    sampleUser1RootMapId,
    sampleUser1UserInfo,
    sampleUserData1,
} from './UserTestHelpers';


test('SubscribableUser:::.val() should display the value of the object', (t) => {
    const user: ISyncableMutableSubscribableUser = sampleUser1;

    const expectedVal = sampleUserData1;

    expect(user.val()).to.deep.equal(expectedVal);
    t.pass();
});
test('SubscribableUser:::startPublishing() should call the onUpdate methods of' +
    ' all member Subscribable properties', (t) => {
    const user: ISyncableMutableSubscribableUser = new SyncableMutableSubscribableUser(
        {
            updatesCallbacks: [],
            membershipExpirationDate: sampleUser1MembershipExpirationDate,
            everActivatedMembership: sampleUser1EverActivatedMembership,
            points: sampleUser1Points,
            rootMapId: sampleUser1RootMapId,
            openMapId: sampleUser1OpenMapId,
            currentHoveredTreeId: sampleUser1CurrentHoveredTreeId,
            userInfo: sampleUser1UserInfo,
        });

    const membershipExpirationDateOnUpdateSpy = sinon.spy(sampleUser1MembershipExpirationDate, 'onUpdate');
    const everActivatedMembershipOnUpdateSpy = sinon.spy(sampleUser1EverActivatedMembership, 'onUpdate');
    const pointsOnUpdateSpy = sinon.spy(sampleUser1Points, 'onUpdate');
    const rootMapIdOnUpdateSpy = sinon.spy(sampleUser1RootMapId, 'onUpdate');
    const openMapIdOnUpdateSpy = sinon.spy(sampleUser1OpenMapId, 'onUpdate');
    const currentHoveredTreeIdOnUpdateSpy = sinon.spy(sampleUser1CurrentHoveredTreeId, 'onUpdate');
    const userInfoOnUpdateSpy = sinon.spy(sampleUser1UserInfo, 'onUpdate');

    user.startPublishing();
    expect(membershipExpirationDateOnUpdateSpy.callCount).to.deep.equal(1);
    expect(everActivatedMembershipOnUpdateSpy.callCount).to.deep.equal(1);
    expect(pointsOnUpdateSpy.callCount).to.deep.equal(1);
    expect(rootMapIdOnUpdateSpy.callCount).to.deep.equal(1);
    expect(openMapIdOnUpdateSpy.callCount).to.deep.equal(1);
    expect(currentHoveredTreeIdOnUpdateSpy.callCount).to.deep.equal(1);
    // expect(userInfoOnUpdateSpy.callCount).to.deep.equal(1);

    t.pass();
});
