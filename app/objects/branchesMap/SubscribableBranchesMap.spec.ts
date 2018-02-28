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
import {SubscribableUser} from './SubscribableBranchesMap';
import {myContainerLoadAllModules} from '../../../inversify.config';
import {SyncableMutableSubscribableUser} from './SyncableMutableSubscribableBranchesMap';

myContainerLoadAllModules()
test('SubscribableUser:::constructor should set all the subscribable properties', (t) => {
    const timestampToday = Date.now()
    const everBeenActivatedValue: boolean = false
    const membershipExpirationDate = new MutableSubscribableField<timestamp>({field: timestampToday})
    const everActivatedMembership = new MutableSubscribableField<boolean>({field: everBeenActivatedValue})
    const user: ISyncableMutableSubscribableUser = new SyncableMutableSubscribableUser(
        {updatesCallbacks: [], membershipExpirationDate, everActivatedMembership}
    )
    expect(user.membershipExpirationDate).to.deep.equal(membershipExpirationDate)
    expect(user.everActivatedMembership).to.deep.equal(everActivatedMembership)
    t.pass()
})
test('SubscribableUser:::.val() should display the value of the object', (t) => {
    const timestampToday = Date.now()
    const everBeenActivatedValue: boolean = false
    const membershipExpirationDate = new MutableSubscribableField<timestamp>({field: timestampToday})
    const everActivatedMembership = new MutableSubscribableField<boolean>({field: everBeenActivatedValue})
    const user: ISyncableMutableSubscribableUser = new SyncableMutableSubscribableUser(
        {updatesCallbacks: [], membershipExpirationDate, everActivatedMembership}
    )

    const expectedVal = {
        membershipExpirationDate: membershipExpirationDate.val(),
        everActivatedMembership: everActivatedMembership.val(),
    }

    expect(user.val()).to.deep.equal(expectedVal)
    t.pass()
})
test('SubscribableUser:::startPublishing() should call the onUpdate methods of' +
    ' all member Subscribable properties', (t) => {
    const timestampToday = Date.now()
    const everBeenActivatedValue: boolean = false
    const membershipExpirationDate = new MutableSubscribableField<timestamp>({field: timestampToday})
    const everActivatedMembership = new MutableSubscribableField<boolean>({field: everBeenActivatedValue})
    const user: ISyncableMutableSubscribableUser = new SyncableMutableSubscribableUser(
        {updatesCallbacks: [], membershipExpirationDate, everActivatedMembership}
    )

    const membershipExpirationDateOnUpdateSpy = sinon.spy(membershipExpirationDate, 'onUpdate')
    const everActivatedMembershipOnUpdateSpy = sinon.spy(everActivatedMembership, 'onUpdate')
    user.startPublishing()
    expect(membershipExpirationDateOnUpdateSpy.callCount).to.deep.equal(1)
    expect(everActivatedMembershipOnUpdateSpy.callCount).to.deep.equal(1)
    t.pass()
})
