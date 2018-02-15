import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IHash, IMutableSubscribableUser, IUser, IUserData,
    CONTENT_TYPES, ISyncableMutableSubscribableUser, timestamp, IUserDataFromDB
} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableUser} from '../../objects/user/MutableSubscribableUser';
import {UserDeserializer} from './UserDeserializer';
import {myContainerLoadAllModules} from '../../../inversify.config';
import {SyncableMutableSubscribableUser} from '../../objects/user/SyncableMutableSubscribableUser';

myContainerLoadAllModules()
test('UserDeserializer::: deserialize should deserialize properly', (t) => {
    const timestampToday = Date.now()
    const everBeenActivatedValue: boolean = false

    const userData: IUserData = {
        membershipExpirationDate: timestampToday,
        everActivatedMembership: everBeenActivatedValue
    }

    const membershipExpirationDate = new MutableSubscribableField<timestamp>({field: timestampToday})
    const everActivatedMembership = new MutableSubscribableField<boolean>({field: everBeenActivatedValue})
    const expectedUser: ISyncableMutableSubscribableUser = new SyncableMutableSubscribableUser(
        {updatesCallbacks: [], membershipExpirationDate, everActivatedMembership}
    )
    const deserializedUser: IMutableSubscribableUser = UserDeserializer.deserialize({userData})
    expect(deserializedUser).to.deep.equal(expectedUser)
    t.pass()
})
test('UserDeserializer::: deserializeFromDB Should deserializeFromDB properly', (t) => {
    const timestampToday = Date.now()
    const everBeenActivatedValue: boolean = false

    const userDataFromDB: IUserDataFromDB = {
        membershipExpirationDate: {
            val: timestampToday
        },
        everActivatedMembership: {
            val: everBeenActivatedValue
        }
    }

    const membershipExpirationDate = new MutableSubscribableField<timestamp>({field: timestampToday})
    const everActivatedMembership = new MutableSubscribableField<boolean>({field: everBeenActivatedValue})
    const expectedUser: ISyncableMutableSubscribableUser = new SyncableMutableSubscribableUser(
        {updatesCallbacks: [], membershipExpirationDate, everActivatedMembership}
    )
    const deserializedUser: IMutableSubscribableUser = UserDeserializer.deserializeFromDB({userDataFromDB})
    expect(deserializedUser).to.deep.equal(expectedUser)
    t.pass()
})
