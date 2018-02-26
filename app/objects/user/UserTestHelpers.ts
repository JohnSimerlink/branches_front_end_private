import {ISyncableMutableSubscribableUser, IUserData, timestamp} from '../interfaces';
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

export const membershipExpirationDate = new MutableSubscribableField<timestamp>({field: sampleUserData1ExpirationDate})
export const everActivatedMembership =
    new MutableSubscribableField<boolean>({field: sampleUserData1TimestampEverBeenActivatedValue})
export const points =
    new MutableSubscribableField<number>({field: sampleUserData1Points})
export const expectedUser1: ISyncableMutableSubscribableUser = new SyncableMutableSubscribableUser(
    {updatesCallbacks: [], membershipExpirationDate, everActivatedMembership, points}
)
