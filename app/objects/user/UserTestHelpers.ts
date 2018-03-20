import {id, ISyncableMutableSubscribableUser, IUserData, IUserDataFromDB, timestamp} from '../interfaces';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {SyncableMutableSubscribableUser} from './SyncableMutableSubscribableUser';
import * as firebase from 'firebase';

export const sampleUserData1ExpirationDate: timestamp = Date.now();
export const sampleUserData1TimestampEverBeenActivatedValue: boolean = false;
export const sampleUserData1Points: number = 54;
export const sampleUserData1RootMapId: id = 'abc40981';
export const sampleUserData1OpenMapId: id = 'dfabc40981';
export const sampleUserData1CurrentHoveredTreeId: id = 'abcdfabc40981';
export const sampleUserData1UserInfo: firebase.UserInfo = {
    displayName: 'Test Display Name',
    email: 'email@test.com',
    phoneNumber: '513-123-1111',
    photoURL: 'http://image.com/img',
    providerId: '1039845',
    uid: '12309'
};

export const sampleUserData1: IUserData = {
    membershipExpirationDate: sampleUserData1ExpirationDate,
    everActivatedMembership: sampleUserData1TimestampEverBeenActivatedValue,
    points: sampleUserData1Points,
    rootMapId: sampleUserData1RootMapId,
    openMapId: sampleUserData1OpenMapId,
    currentHoveredTreeId: sampleUserData1CurrentHoveredTreeId,
    userInfo: sampleUserData1UserInfo,
};

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
    rootMapId: {
        val: sampleUserData1RootMapId
    },
    openMapId: {
        val: sampleUserData1OpenMapId
    },
    currentHoveredTreeId: {
        val: sampleUserData1CurrentHoveredTreeId
    },
    userInfo: {
        val: sampleUserData1UserInfo,
    }
};

export const sampleUser1MembershipExpirationDate
    = new MutableSubscribableField<timestamp>({field: sampleUserData1ExpirationDate});
export const sampleUser1EverActivatedMembership
    = new MutableSubscribableField<boolean>({field: sampleUserData1TimestampEverBeenActivatedValue});
export const sampleUser1Points
    = new MutableSubscribableField<number>({field: sampleUserData1Points});
export const sampleUser1RootMapId
    = new MutableSubscribableField<id>({field: sampleUserData1RootMapId});
export const sampleUser1OpenMapId
    = new MutableSubscribableField<id>({field: sampleUserData1OpenMapId});
export const sampleUser1CurrentHoveredTreeId
    = new MutableSubscribableField<id>({field: sampleUserData1CurrentHoveredTreeId});
export const sampleUser1UserInfo
    = new MutableSubscribableField<firebase.UserInfo>({field: sampleUserData1UserInfo});

export const sampleUser1: ISyncableMutableSubscribableUser = new SyncableMutableSubscribableUser(
    {updatesCallbacks: [],
        membershipExpirationDate: sampleUser1MembershipExpirationDate,
        everActivatedMembership: sampleUser1EverActivatedMembership,
        points: sampleUser1Points,
        rootMapId: sampleUser1RootMapId,
        openMapId: sampleUser1OpenMapId,
        currentHoveredTreeId: sampleUser1CurrentHoveredTreeId,
        userInfo: sampleUser1UserInfo
    }
);
