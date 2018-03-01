import {ISyncableMutableSubscribableUser, IUserData,IUserDataFromDB, timestamp} from '../interfaces';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {SyncableMutableSubscribableUser} from './SyncableMutableSubscribableUser';

export const sampleUserData1ExpirationDate: timestamp = Date.now()
export const sampleUserData1TimestampEverBeenActivatedValue: boolean = false
export const sampleUserData1Points: number = 54

export const sampleUserData1: IUserData = {
    membershipExpirationDate: sampleUserData1ExpirationDate,
    everActivatedMembership: sampleUserData1TimestampEverBeenActivatedValue,
    points: sampleUserData1Points,
}

export const sampleUserDataFromDB1: IUserDataFromDB = {
    membershipExpirationDate: {
    	val: sampleUserData1ExpirationDate,
    },
    everActivatedMembership: {
    	val: sampleUserData1TimestampEverBeenActivatedValue
    },
    points: {
    	val: sampleUserData1Points
    },
}

export const sampleUser1MembershipExpirationDate = new MutableSubscribableField<timestamp>({field: sampleUserData1ExpirationDate})
export const sampleUser1EverActivatedMembership =
    new MutableSubscribableField<boolean>({field: sampleUserData1TimestampEverBeenActivatedValue})
export const sampleUser1Points =
    new MutableSubscribableField<number>({field: sampleUserData1Points})
export const sampleUser1: ISyncableMutableSubscribableUser = new SyncableMutableSubscribableUser(
    {updatesCallbacks: [], membershipExpirationDate: sampleUser1MembershipExpirationDate, everActivatedMembership: sampleUser1EverActivatedMembership, points: sampleUser1Points}
)
