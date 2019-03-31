import test
	from 'ava';
import {expect} from 'chai';
import 'reflect-metadata';
import {
	IMutableSubscribableUser,
	IUserDataFromDB
} from '../../objects/interfaces';
import {UserDeserializer} from './UserDeserializer';
import {myContainerLoadLoaders} from '../../../inversify.config';
import {
	sampleUser1,
	sampleUserData1,
	sampleUserData1Points,
	sampleUserDataFromDB1
} from '../../objects/user/UserTestHelpers';

myContainerLoadLoaders();
test('UserDeserializer::: deserialize should deserialize properly', (t) => {
	const deserializedUser: IMutableSubscribableUser = UserDeserializer.deserialize({userData: sampleUserData1});
	expect(deserializedUser).to.deep.equal(sampleUser1);
	t.pass();
});
test('UserDeserializer::: deserializeFromDB Should deserializeFromDB properly', (t) => {

	const userDataFromDB: IUserDataFromDB = sampleUserDataFromDB1;
	const points: number = sampleUserData1Points;

	const deserializedUser: IMutableSubscribableUser = UserDeserializer.deserializeFromDB({userDataFromDB});
	expect(deserializedUser).to.deep.equal(sampleUser1);
	t.pass();
});
